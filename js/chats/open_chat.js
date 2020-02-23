let id;

$(document).ready(() => {
    addChatsEventListeners();
});

function addChatsEventListeners() {
    const chats = Array.from($(".chat:visible"));
    chats.forEach(chat => {
        chat.addEventListener("click", openChat);
    });
}

function openChat(e) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/message_reciever.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    $(".choose_chat").remove();
    $(".input_area").attr("style", "display: grid");
    $(".message_area").attr("style", "display: grid");
    $(".message_area").html("");
    $(".chats header").attr("style", "display: flex");
    const clip = $(".input_area label img")[0];
    clip.addEventListener("mouseover", () => {
        clip.src = "assets/icons/file_hover.png";
    });
    clip.addEventListener("mouseout", () => {
        clip.src = "assets/icons/file.png";
    });
    let parent = e.target.parentNode;
    while (parent.classList.value != "chat") {
        parent = parent.parentNode;
    }

    $(".chat").attr("style", "background: #35215a");
    parent.style.background = "#291a46";

    id = parent.attributes["data-id"].value;
    setStatusFront(id);

    xml.send("c=" + id);

    xml.onload = () => {
        const U = parent.children[1].children[0].innerHTML;
        if (xml.responseText !== "[]") {
            const response = JSON.parse(xml.responseText);
            loadMessages(response, U);
        } else {
            loadMessages(false, U);
        }
    };
}