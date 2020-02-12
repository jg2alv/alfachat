$(document).ready(() => {
    addChatsEventListeners();
});

function addChatsEventListeners() {
    chats = Array.from($(".chat:visible"));
    chats.forEach(chat => {
        chat.addEventListener("click", openChat);
    });
}

function openChat(e) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/get_chat_messages.php", true);
    xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    let parent = e.target.parentNode;
    while (parent.classList.value != "chat") {
        parent = parent.parentNode;
    }
    const id = parent.attributes["data-id"].value;

    if (id === "class") {
        xml.send("c=class");
    } else {
        xml.send("c=" + id);
    }

    xml.onload = () => {
        console.log(xml.responseText)
        // if ($(".chats:visible").length) {
        //     console.log("visible"); // 'chats' is separated from 'chat_list'
        // } else {
        //     console.log("not visible"); // 'chats' and 'chat_list' are one
        // }
    }
}
