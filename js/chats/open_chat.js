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
    xml.open("POST", "../xmlhttprequest/recieve_message.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    $(".choose_chat").attr("style", "display: none");
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

    if (id === "class") {
        xml.send("c=class");
    } else {
        xml.send("c=" + id);
    }

    xml.onload = () => {
        const M = [];
        const T = [];
        const U = parent.children[1].children[0].innerHTML;
        if (!(xml.responseText === "[]")) {
            const response = JSON.parse(xml.responseText);
            response.forEach(m => {
                if (m.sender == atob(id)) {
                    T.push(m);
                } else {
                    M.push(m);
                }
            });
            loadMessages(M, T, U);
        } else {
            loadMessages(false, false, U);
        }
    };
}

function loadMessages(M, T, U) {
    const ma = $(".message_area")[0];
    $(".chats header div").html(U);
    $(".input_area input").focus();
    if (M && T) {
        if (!$(".chats:visible").length) {
            console.log("not visible");
            return;
        }

        M.forEach(message => {
            ma.innerHTML +=
                "<div class='message mine'>" + message.content + "</div>";
        });
    }
}
