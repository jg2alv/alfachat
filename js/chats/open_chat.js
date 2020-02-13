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
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let parent = e.target.parentNode;
    while (parent.classList.value != "chat") {
        parent = parent.parentNode;
    }
    parent.style.background = "#291a46";
    const id = parent.attributes["data-id"].value;

    if (id === "class") {
        xml.send("c=class");
    } else {
        xml.send("c=" + id);
    }

    xml.onload = () => {
        const M = [];
        const T = [];
        if (!xml.responseText === "[]") {
            const response = JSON.parse(xml.responseText);
            response.forEach(m => {
                if (m.sender == atob(id)) {
                    T.push(m);
                } else {
                    M.push(m);
                }
            });
            loadMessages(M, T);
        } else {
            loadMessages(false, false);
        }
    };
}

function loadMessages(M, T) {
    $(".choose_chat").eq(0).remove();
    $(".input_area").attr("style", "display: grid");
    $(".input_area input").focus();
    if (M && T) {
        if (!$(".chats:visible").length) {
            console.log("not visible");
            return;
        }
        // show messages
    }
}
