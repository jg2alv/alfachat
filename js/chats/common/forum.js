$(document).ready(() => $("#forum_menu").on("click", showForum));

function showForum() {
    $("#forum_menu").off("click").on("click", hideForum);

    $("#forum").css("display", "flex");
    $(".chat_selector").css("display", "none");
    $(".chats").css("display", "none");
    $("#forum main").css({ "display": "block", "padding": "0" }).html("<div class='subject_list'></div>");
    $("#forum header img:nth-of-type(2), #forum_menu").off("click").on("click", hideForum);
    hideSideMenu().then(() => {
        $("#forum_menu .pic img").attr("src", "assets/icons/home.png").attr("alt", "P&aacute;gina principal").css("max-width", "50%");
        $("#forum_menu .info").html("P&aacute;gina principal");
        $("#teacher_list").html("");
        subjectList(".subject_list");
        subjectList("#teacher_list");
    });

    canUpdate.teacherListUpdater = false;
    canUpdate.chatListUpdater = false;
    canUpdate.chatsUpdater = false;

    $("#forum header input").off("keyup").on("keyup", e => !e.target.value || e.target.value === " " ? $("#forum main .menu_icon").removeAttr("hidden") : $(`#forum main .menu_icon:not(:contains(${e.target.value}))`).attr("hidden", ""));
}

function hideForum() {
    $("#forum").css("display", "none");
    $(".chat_selector").css("display", "block");
    $(".chats").css("display", "grid");
    hideSideMenu().then(() => {
        $("#forum_menu .pic img").attr("src", "assets/icons/forum.png").attr("alt", "F&oacute;rum").css("max-width", "75%");
        $("#forum_menu .info").html("F&oacute;rum");
        teacherListUpdater();
    });

    $("#forum_menu").off("click").on("click", showForum);
    canUpdate.teacherListUpdater = true;
    canUpdate.chatListUpdater = true;
}

function openSubject(e) {
    hideSideMenu().then(() => {
        $("#forum header img").eq(2).css("display", "initial").off("click").on("click", function () {
            $("#forum main").css("grid-template-columns", "");
            openSubject(e);
        });

        $("#forum .input_area").remove();
        $("#forum").css("display", "flex");
        $("#forum main").css({ "display": "grid", "padding": "0 5px", "box-sizing": "border-box" }).html("<div class='loading'>Carregando...</div>");
        $("#subjects_menu .menu_icon .pic img").css("border-radius", 0);
        $("#teacher_list .menu_icon").on("click", e => hideSideMenu().then(() => openSubject(e)));
    });

    $("#forum header img").eq(1).off("click").on("click", showForum);
    $("#forum_menu").off("click").on("click", hideForum);

    fetch_doubts($(e.currentTarget).attr("subject")).then(() => {
        $("#forum main").html("").css("grid-template-columns", "repeat(3, 1fr)");

        forum_doubts.forEach((doubt, index) => {
            doubt[0] = JSON.parse(doubt[0]);

            doubtArea = document.createElement("div");
            $(doubtArea).attr("class", "doubt").attr("data-id", index);
            $(doubtArea).html(`<div style="display: flex; flex-direction: column; height: 100%"><div style="border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 10px; margin-bottom: 15px; flex: 1; font-size: 24px; text-transform: capitalize; font-weight: bolder">${doubt[1][0]}</div><div style="font-size: 18px; overflow: hidden; flex: 4; overflow-wrap: anywhere; flex-basis: 0">${doubt[0][0].content}</div><div style="flex: 3; color: #cccccc; font-size: 14px; padding-top: 15px">Autor: ${JSON.parse(doubt[0][0].sender).name}<br>Professor respons&aacute;vel: ${JSON.parse(doubt[0][0].receiver).name + ftags(doubt[1][1])}</div>`)
            $("#forum main").append(doubtArea);
        });

        if (!$("#forum main").html()) {
            $("#forum main").css("grid-template-columns", "").html("<div class='loading'>N&atilde;o h&aacute; d&uacute;vidas para serem exibidas!</div>");
            $("#forum header img").eq(1).off("click").on("click", showForum);
            return;
        }

        const loadConversation = function (ev, subject = false) {
            const doubt = forum_doubts[$(this).attr("data-id") || subject];
            subject = $(this).attr("data-id") || subject;

            $("#forum header img").eq(1).off("click").on("click", () => openSubject(e));
            $("#forum main").css("display", "block").html("<div class='message_area' style='display: block; visibility: visible; background-color: unset'></div>");

            doubt[0].forEach((msg, index) => $("#forum main .message_area").append(new Message(msg, index, true).parse()));
            const mediaObserver = new IntersectionObserver(entries => { // Observer to lazy-load images/ videos
                entries.forEach(entry => {
                    if (entry.target instanceof HTMLVideoElement) {
                        if (!entry.isIntersecting) {
                            $(entry.target.firstChild).attr("data-src", $(entry.target.firstChild).attr("src"));
                            $(entry.target.firstChild).removeAttr("src");
                        } else {
                            $(entry.target.firstChild).attr("src", $(entry.target.firstChild).attr("data-src"));
                            $(entry.target.firstChild).removeAttr("data-src");
                            entry.target.load();
                        }
                    } else {
                        if (!entry.isIntersecting) {
                            $(entry.target).attr("data-src", $(entry.target).attr("src"));
                            $(entry.target).removeAttr("src");
                        } else {
                            $(entry.target).attr("src", $(entry.target).attr("data-src"));
                            $(entry.target).removeAttr("data-src");
                        }
                    }
                })
            }, { root: $("#forum main .message_area")[0], rootMargin: "100%" }); // Getting global options

            $("[data-src]").each((index, item) => { // For every image with data-src attr (images to be lazy loaded)
                if (item instanceof HTMLSourceElement)
                    mediaObserver.observe(item.parentElement);
                else
                    mediaObserver.observe(item);
            });

            $("#forum .input_area").remove();
            $("#forum").css("display", "grid").append("<form class='input_area' style='display: flex; width: 100%; background-color: #35215a; box-shadow: 0 130px 130px 100px #000'><input id='file_input' type='file' style='display: none' name='file_input' multiple><img src='assets/icons/file.png' alt='Carregar arquivo'><ul id='suggester' class='suggester'></ul><textarea placeholder='Escreva sua mensagem'></textarea><div class='audio_control' hidden></div><div class='audio_control' hidden></div><span class='countdown' hidden>00:00</span><ul class='suggester emoji'></ul><img src='assets/icons/emoji.png' alt='Enviar emoji'><img src='assets/icons/audio.png' alt='Gravar audio'></form>");
            $("#forum .input_area .suggester.emoji").html($(".chats .input_area .suggester.emoji").html());
            $("#forum .input_area textarea").off("input").on("input", resize).on("input", Suggester);
            $("#forum header input").off("keyup", dsearch).on("keyup", e => !e.target.value || e.target.value === " " ? $("#forum main [data-message]").removeAttr("hidden") : $(`#forum main [data-message]:not(:contains(${e.target.value}))`).attr("hidden", ""));
            $("#forum header img").eq(2).off("click").on("click", () => loadConversation(false, $(this).attr("data-id") || subject));

            id = btoa(`doubt:${doubt[1][3]}`);
            messageSender();
        };

        $(".doubt span").off("click").on("click", function () {
            $("#forum header input").val($(this).html());
            dsearch();
        });

        $("#forum header input").off("keyup").on("keyup", dsearch);
        $(".doubt").on("click", loadConversation);
    });
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