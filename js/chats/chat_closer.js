function closeChat() {
    $(".chat_selector")[0].style.display = "block";
    $(".chats")[0].style.display = "none";
    $(".chats")[0].style.width = "";
    $(".chat").attr("style", "background: #35215a"); // Removing "selected" background from every other div
}