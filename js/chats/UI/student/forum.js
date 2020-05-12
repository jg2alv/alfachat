$(document).ready(() => $("#forum_menu").on("click", showForum));

function showForum() {
    $("#forum_menu").off("click");

    $("#forum").css("display", "flex");
    $(".chat_selector").css("display", "none");
    $(".chats").css("display", "none");
    hideSideMenu().then(() => {
        $("#forum_menu .pic img").attr("src", "assets/icons/home.png").attr("alt", "P&aacute;gina principal").css("max-width", "50%");
        $("#forum_menu .info").html("P&aacute;gina principal");
        $("#teacher_list").html("");
        subjectList(".subject_list");
        subjectList("#teacher_list");
    });

    $("#forum_menu").off("click");

    const canUpdateBackup = canUpdate;
    canUpdate.teacherListUpdater = false;
    canUpdate.chatListUpdater = false;
    canUpdate.chatsUpdater = false;

    $("#forum header img").eq(1)[0].onclick = $("#forum_menu")[0].onclick = () => {
        $("#forum_menu")[0].onclick = undefined;

        $("#forum").css("display", "none");
        $(".chat_selector").css("display", "block");
        $(".chats").css("display", "grid");
        hideSideMenu().then(() => {
            $("#forum_menu .pic img").attr("src", "assets/icons/forum.png").attr("alt", "F&oacute;rum").css("max-width", "75%");
            $("#forum_menu .info").html("F&oacute;rum");
            teacherListUpdater();
        });

        $("#forum_menu").off("click");
        canUpdate = canUpdateBackup;
        $("#forum_menu").on("click", showForum);
    };
}

function openSubject(e) {
    $("#forum header input").off("keyup");
    $(".doubt span").off("click");
    $("#forum header img").eq(2).css("display", "initial").on("click", function() {
        $(this).off("click");
        $("#forum main").css("grid-template-columns", "");
        openSubject(e);
    });

    $("#forum main").html("<div class='loading'>Carregando...</div>").css({"display": "grid", "padding": "0 5px", "box-sizing": "border-box"});
    $("#subjects_menu .menu_icon .pic img").css("border-radius", 0);
    $("#teacher_list .menu_icon").on("click", e => hideSideMenu().then(() => openSubject(e)));

    fetch_doubts($(e.currentTarget).attr("subject")).then(() => {
        $("#forum main").html("").css("grid-template-columns", "repeat(3, 1fr)");

        forum_doubts.forEach(doubt => {
            doubt[0] = JSON.parse(doubt[0]);

            doubtArea = document.createElement("div");
            $(doubtArea).attr("class", "doubt").attr("data-id", doubt[1][3]);
            $(doubtArea).html(`<div style="display: flex; flex-direction: column; height: 100%"><div style="border-bottom: 1px solid rgba(255, 255, 255, 0.3); padding-bottom: 10px; margin-bottom: 15px; flex: 1; font-size: 24px; text-transform: capitalize; font-weight: bolder">${doubt[1][0]}</div><div style="font-size: 18px; overflow: hidden; flex: 4; overflow-wrap: anywhere; flex-basis: 0">${doubt[0][0].content}</div><div style="flex: 3; color: #cccccc; font-size: 14px; padding-top: 15px">Autor: ${JSON.parse(doubt[0][0].sender).name}<br>Professor respons&aacute;vel: ${JSON.parse(doubt[0][0].receiver).name + ftags(doubt[1][1])}</div>`)
            $("#forum main").append(doubtArea);
        });

        if (!$("#forum main").html()) {
            $("#forum main").html("").css("grid-template-columns", "");
            $("#forum main").html("<div class='loading'>N&atilde;o h&aacute; d&uacute;vidas para serem exibidas!</div>");
            return;
        }

        $(".doubt span").on("click", function() {
            $("#forum header input")[0].value = $(this).html();
            dsearch();
        });

        $("#forum header input").on("keyup", dsearch);
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

    if (!input.value || input.value === " ") {
        $(".doubt").css("display", "block");
        return;
    }

    $(`.doubt:not(:contains('${input.value}'))`).css("display", "none");
}

function subjectList(subject_list) {
    for (subject in subjects) {
        if (typeof subjects[subject] === "function")
            continue;
        $(subject_list).append(subjects.draw(subject));
    }
    $(`${subject_list} .menu_icon`).on("click", openSubject);
}