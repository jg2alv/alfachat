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

    const id = parent.attributes["data-id"].value;
    setStatus(id);

    xml.send("c=" + id);

    xml.onload = () => {
        const U = parent.children[1].children[0].innerHTML;
        if (xml.responseText !== "[]") {
            const response = JSON.parse(xml.responseText);
            loadMessages(response, id, U);
        } else {
            loadMessages(false, id, U);
        }
    };
}

function loadMessages(R, I, U) {
    const ma = $(".message_area")[0];
    $(".chats header div")[0].innerHTML = U
    $(".input_area input").focus();
    if (R) {
        if (!$(".chats:visible").length) {
            console.log("not visible");
            return;
        }

        R.forEach(message => {
            const d = new Date(Number(message.time) * 1000);
            if (message.reciever == atob(I)) {
                ma.innerHTML +=
                    "<div class='message mine'>" +
                    atob(message.content) +
                    "<div class='message_time'>" +
                    d.getHours() +
                    ":" +
                    d.getMinutes() +
                    "</div></div>";
            } else {
                ma.innerHTML +=
                    "<div class='message their'>" +
                    atob(message.content) +
                    "<div class='message_time'>" +
                    d.getHours() +
                    ":" +
                    d.getMinutes() +
                    "</div></div>";
            }
        });
    }
}
