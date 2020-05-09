$(document).ready(() => $("#forum_menu").on("click", showForum));

function showForum() {
    $("#forum_menu").off("click");

    $("#forum").css("display", "flex");
    $(".chat_selector").css("display", "none");
    $(".chats").css("display", "none");
    hideSideMenu().then(() => {
        $("#main_page .pic img").attr("src", "assets/icons/home.png").attr("alt", "P&aacute;gina principal").css("max-width", "50%");
        $("#main_page .info").html("P&aacute;gina principal");
        $("#teacher_list").html("");
        subjectList(".subject_list");
        subjectList("#teacher_list");
    });

    $("#forum_menu").off("click");
    $("#forum_menu").attr("id", "main_page");
    const canUpdateBackup = canUpdate;
    canUpdate.teacherListUpdater = false;
    canUpdate.chatListUpdater = false;
    canUpdate.chatsUpdater = false;
    $("#main_page").on("click", () => {
        $("#main_page").off("click");
        $("#forum").css("display", "none");
        $(".chat_selector").css("display", "block");
        $(".chats").css("display", "grid");
        hideSideMenu().then(() => {
            $("#forum_menu .pic img").attr("src", "assets/icons/forum.png").attr("alt", "F&oacute;rum").css("max-width", "75%");
            $("#forum_menu .info").html("F&oacute;rum");
            teacherListUpdater();
        });

        $("#main_page").off("click");
        $("#main_page").attr("id", "forum_menu");
        canUpdate = canUpdateBackup;
        $("#forum_menu").on("click", showForum);
    });
}

function openSubject(e) {
    $("#forum header input").off("keyup");
    $(".doubt span").off("click");

    $("#forum main").html("<div class='loading'>Carregando...</div>").css({"display": "grid", "padding": "0 5px", "box-sizing": "border-box"});
    $("#subjects_menu .menu_icon .pic img").css("border-radius", 0);
    $("#teacher_list .menu_icon").on("click", e => hideSideMenu().then(() => openSubject(e)));

    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/forum.php", true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send(`subject=${$(e.currentTarget).attr("subject")}`);
    xml.onload = () => {
        let doubts;
        try {
            doubts = JSON.parse(xml.responseText);
        } catch(e) {
            return;
        }

        $("#forum main").html("").css("grid-template-columns", "repeat(3, 1fr)");

        doubts.forEach(doubt => {
            doubt[0] = JSON.parse(doubt[0]);

            doubtArea = document.createElement("div");
            $(doubtArea).attr("class", "doubt").attr("data-id", doubt[0][0].doubt);
            $(doubtArea).html(`<div style="display: flex; flex-direction: column; height: 100%"><div style="flex: 2; font-size: 20px; text-transform: capitalize; font-weight: bold">${doubt[1][0]}</div><div style="overflow: hidden; flex: 4; text-align: justify">${doubt[0][0].content}</div><div style="flex: 1; color: #cccccc; font-size: 14px">Autor: ${JSON.parse(doubt[0][0].sender).name}<br>Professor respons&aacute;vel: ${JSON.parse(doubt[0][0].receiver).name}</div><div style="font-size: 14px; color: #337ab7; flex: 1; padding: 5px 0">${ftags(doubt[1][1])}</div></div>`)
            $("#forum main").append(doubtArea);

        });

        $(".doubt span").on("click", function() {
            $("#forum header input")[0].value = $(this).html();
            dsearch();
        });

        $("#forum header input").on("keyup", dsearch);
    }
}

function ftags(tags) {
    if (!tags)
        return "";

    const res = new Array();
    tags.split(" ").forEach(tag => res.push(`<span>${tag}</span>`));
    return res.join(" ");
}

function dsearch() {
    const input = $("#forum header input")[0];

    if (!input.value || input.value === " ") {
        $(".doubt").css("display", "flex");
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