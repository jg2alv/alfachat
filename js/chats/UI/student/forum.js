$(document).ready(() => {
    $("#forum_menu").on("click", () => {
        $("#forum").css("display", "flex");
        $(".chat_selector").css("display", "none");
        $(".chats").css("display", "none");
        hideSideMenu();
    });
});