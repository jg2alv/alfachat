$(document).ready(() => $("#forum_menu").on("click", showForum));

function showForum() {
    $("#forum").css("display", "flex");
    $(".chat_selector").css("display", "none");
    $(".chats").css("display", "none");
    hideSideMenu().then(() => {
        $("#main_page .pic img").attr("src", "assets/icons/home.png").attr("alt", "P&aacute;gina principal").css("max-width", "50%");
        $("#main_page .info").html("P&aacute;gina principal");
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
        });

        $("#main_page").off("click");
        $("#main_page").attr("id", "forum_menu");
        canUpdate = canUpdateBackup;
        $("#forum_menu").on("click", showForum);
    });
}

function openSubject(e) {
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

        const subjects = $(".subject_list").html();
        $("#forum main").html("");
        $("#teacher_list").html(subjects);
        $("#subjects_menu div .info").html("Mat&eacute;rias");

        return

        try {

        } catch(e) {

        }
    }
}