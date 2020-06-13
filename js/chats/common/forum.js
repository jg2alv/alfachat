$(document).ready(() => $("#forum_menu").on("click", showForum));

function showForum() {
    advMenu("#forum");
    $("#forum main").css({ "display": "block", "padding": "0" }).html("<div class='subject_list'></div>");
    subjectList(".subject_list");
    subjectList("#teacher_list");
    return new Promise(resolve => {
        hideSideMenu().then(() => {
            $("#forum_menu .pic img").attr("src", "assets/icons/home.png").attr("alt", "P&aacute;gina principal").css("max-width", "50%");
            $("#forum_menu .info").html("P&aacute;gina principal");
            $("#teacher_list").html("");
        });

        const canUpdateBck = canUpdate;
        falsify();

        $("#forum header input").off("keyup").on("keyup", e => !e.target.value || e.target.value === " " ? $("#forum main .menu_icon").removeAttr("hidden") : $(`#forum main .menu_icon:not(:contains(${e.target.value}))`).attr("hidden", ""));
        $("#forum header img:nth-of-type(2), #forum_menu").off("click").on("click", hideForum.bind(canUpdateBck));
        $("#forum_menu").off("click").on("click", hideForum.bind(canUpdateBck));
        resolve();
    });
}

function hideForum(canUpdateBck) {
    $("#forum").css("display", "none");
    $(".chat_selector").css("display", "block");
    $(".chats").css("display", "grid");
    hideSideMenu().then(() => {
        $("#forum_menu .pic img").attr("src", "assets/icons/forum.png").attr("alt", "F&oacute;rum").css("max-width", "75%");
        $("#forum_menu .info").html("F&oacute;rum");
        teacherListUpdater();
    });

    $("#forum_menu").off("click").on("click", showForum);
    canUpdate = canUpdateBck;
}

async function openSubject({ currentTarget }) {
    hideSideMenu().then(() => {
        $("#forum header img").eq(2).css("display", "initial").off("click").on("click", function () {
            $("#forum main").css("grid-template-columns", "");
            openSubject({ currentTarget: currentTarget });
        });

        $("#forum .input_area").remove();
        $("#forum").css("display", "flex");
        $("#forum main").css({ "display": "grid", "padding": "0 5px", "box-sizing": "border-box", "grid-template-columns": "" }).html("<div class='loading'>Carregando...</div>");
        $("#subjects_menu .menu_icon .pic img").css("border-radius", 0);
        $("#teacher_list .menu_icon").on("click", ({ currentTarget }) => hideSideMenu().then(() => openSubject({ currentTarget: currentTarget })));
    });

    $("#forum header img").eq(1).off("click").on("click", showForum);

    const loadConversation = function (ev, doubt_id = false) {
        const doubt = forum_doubts[$(this).attr("data-id") || doubt_id];
        doubt_id = $(this).attr("data-id") || doubt_id;

        $("#forum header img").eq(1).off("click").on("click", openSubject.bind(window, { currentTarget: currentTarget }));
        $("#forum main").css("display", "block").html("<div class='message_area' style='display: block; visibility: visible; background-color: unset'></div>");

        new Promise(resolve => {
            doubt[0].forEach(async msg => {
                const message = await new Message(msg, true).parse();
                $("#forum main .message_area").append(message);
                msg === doubt[0][doubt.length - 1] ? resolve() : null;
            });
        }).then(() => {
            const observerOptions = { root: $(".message_area:visible")[0], rootMargin: "500%" },
                observer = new IntersectionObserver(entries => entries.forEach(entry => !entry.isIntersecting ? $(entry.target).attr("data-src", $(entry.target).attr("src")).removeAttr("src") : $(entry.target).attr("src", $(entry.target).attr("data-src")).removeAttr("data-src")), observerOptions),
                prepareMedia = element => {
                    $("[data-src]", element).each(function () { observer.observe(this); }).off("click").on("click", MediaModal);

                    $("audio", element).off("loadmetadata").on("loadmetadata", e => $(e.target).siblings("span").html(`00:00/${convertTime(Math.floor(e.target.duration))}`)).off("timeupdate").on("timeupdate", e => {
                        const input = $(e.target).siblings("input[type='range']")[0],
                            duration = Math.floor(e.target.duration);

                        input.max = e.target.duration;
                        input.value = e.target.currentTime;

                        $(input).siblings("span").html(`${convertTime(Math.floor(e.target.currentTime))}/${convertTime(duration)}`);

                        if (Math.floor(input.value) === duration) {
                            e.target.pause();
                            $(input).siblings("img").attr("src", "assets/icons/play.png");
                            e.target.currentTime = 0;
                        }
                    }).each(function () {
                        this.volume = 0;
                        this.play();
                        setTimeout(() => {
                            this.pause();
                            this.volume = 1.0;
                            this.currentTime = 0;
                        }, 500);
                    });

                    $(".audio_btns", element).off("click").on("click", e => {
                        const audio = $(e.currentTarget).siblings("audio")[0],
                            input = $(e.currentTarget).siblings("input")[0];

                        if (audio.paused) {
                            $("audio").each(function () {
                                this.pause();
                                $(this).siblings("img")[0].src = "assets/icons/play.png";
                            });
                            audio.currentTime = Number(input.value)
                            audio.play();
                            e.currentTarget.src = "assets/icons/pause.png";
                        } else {
                            audio.pause();
                            e.currentTarget.src = "assets/icons/play.png";
                        }
                    });

                    $("input[type='range']", element).off("input").on("input", e => $(e.currentTarget).siblings('audio')[0].currentTime = Number(e.currentTarget.value));
                    $(".reply", element).off("click").on("click", e => scrollToMessage($(e.currentTarget).attr("data-reply")));
                    $(element).children().off("contextmenu").on("contextmenu", ContextMenu);
                    $("[data-subject-name]", element).off("click").on("click", e => showForum().then(() => $(`#forum main [subject] .info div:contains(${$(e.currentTarget).attr("data-subject-name")})`).click()));
                    $("[data-doubt]", element).off("click").on("click", e => showForum().then(async () => {
                        const data = atob($(e.currentTarget).attr("data-doubt")).split(":");
                        await openSubject({ currentTarget: data[0] });
                        $(`.doubt[data-id="${data[1]}"]`).click();
                    }));
                };

            prepareMedia($("#forum main .message_area")[0]);
        });

        $("#forum .input_area").remove();
        $("#forum").css("display", "grid").append("<form class='input_area' style='display: flex; width: 100%; background-color: #35215a; box-shadow: 0 130px 130px 100px #000'><input id='file_input' type='file' style='display: none' name='file_input' multiple><img src='assets/icons/file.png' alt='Carregar arquivo'><ul id='suggester' class='suggester'></ul><textarea placeholder='Escreva sua mensagem'></textarea><div class='audio_control' hidden></div><div class='audio_control' hidden></div><span class='countdown' hidden>00:00</span><ul class='suggester emoji'></ul><img src='assets/icons/emoji.png' alt='Enviar emoji'><img src='assets/icons/audio.png' alt='Gravar audio'></form>");
        $("#forum .input_area .suggester.emoji").html($(".chats .input_area .suggester.emoji").html());
        $("#forum .input_area textarea").off("input").on("input", resize).on("input", Suggester);
        $("#forum header input").off("keyup", dsearch).on("keyup", e => !e.target.value || e.target.value === " " ? $("#forum main [data-message]").removeAttr("hidden") : $(`#forum main [data-message]:not(:contains(${e.target.value}))`).attr("hidden", ""));
        $("#forum header img").eq(2).off("click").on("click", () => {
            loadConversation.call(this, false, $(this).attr("data-id") || doubt_id);
            new Toast("Atualizando conversa...").show().destroy(2500);
        });

        id = btoa(`doubt:${doubt[1][3]}`);
        messageSender();
    };

    await fetch_doubts($(currentTarget).attr("subject"));
    $("#forum main").html("").css("grid-template-columns", "repeat(3, 1fr)");

    forum_doubts.forEach(doubt => {
        doubtArea = document.createElement("div");
        $(doubtArea).attr("class", "doubt").attr("data-id", Number(doubt[1][3]) - 1);
        $(doubtArea).html(`<div style="display: flex; flex-direction: column; height: 100%"><div style="border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 10px; margin-bottom: 15px; flex: 1; font-size: 24px; text-transform: capitalize; font-weight: bolder">${doubt[1][0]}</div><div style="font-size: 18px; overflow: hidden; flex: 4; overflow-wrap: anywhere; flex-basis: 0">${doubt[0][0].content}</div><div style="flex: 3; color: #cccccc; font-size: 14px; padding-top: 15px">Autor: ${JSON.parse(doubt[0][0].sender).name}<br>Professor respons&aacute;vel: ${JSON.parse(doubt[0][0].receiver).name + ftags(doubt[1][1])}</div>`)
        $("#forum main").append(doubtArea);
    });

    if (!$("#forum main").html()) {
        $("#forum main").css("grid-template-columns", "").html("<div class='loading'>N&atilde;o h&aacute; d&uacute;vidas para serem exibidas!</div>");
        $("#forum header img").eq(1).off("click").on("click", showForum);
        return;
    }

    $(".doubt span").off("click").on("click", function () {
        $("#forum header input").val($(this).html());
        dsearch();
    });

    $("#forum header input").off("keyup").on("keyup", dsearch);
    $(".doubt").on("click", loadConversation);
}

function ftags(tags) {
    if (!tags)
        return "";

    const res = new Array();
    tags.split(" ").forEach(tag => res.push(`<span class="doubt_tag">${tag}</span>`));
    return `<br><br>${res.join(" ")}`;
}

function dsearch() {
    const input = $("#forum header input")[0];
    $(".doubt").css("display", "block");

    if ($(".doubt:visible").length || !input.value || input.value === " ") {
        $("#forum main .loading").remove();
        $("#forum main").css("grid-template-columns", "repeat(3, 1fr)");
        $(".doubt").css("display", "block");
    }

    for (let doubt of $("#forum main .doubt"))
        !doubt.innerText.includes(input.value) ? $(doubt).css("display", "none") : null;

    if (!$(".doubt:visible").length) {
        $("#forum main").css("grid-template-columns", "");
        !$("#forum main .loading:visible").length ? $("#forum main").append("<div class='loading'>N&atilde;o h&aacute; d&uacute;vidas para serem exibidas!</div>") : null;
    }
}

function subjectList(subject_list) {
    for (subject in subjects) {
        if (typeof subjects[subject] === "function")
            continue;
        $(subject_list).append(subjects.draw(subject));
    }
    $(`${subject_list} .menu_icon`).on("click", openSubject);
}