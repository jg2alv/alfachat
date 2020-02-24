let id; // Setting global ID

$(document).ready(() => {
    const chats = Array.from($(".chat:visible"));
    chats.forEach(chat => {
        chat.addEventListener("click", openChat); // Adding event to open chat on click
    });
});

function openChat(e) {
    let parent = e.target;
    while (parent.classList.value != "chat") { // While the place where user clicked (children div) DO NOT have "chat" class
        parent = parent.parentNode; // Set it to it's parent (because IT WILL be a children)
    }
    if ($(".chats header div")[0].innerHTML === parent.children[1].children[0].innerHTML) { // If user clicked on the same chat, don't reload it.
        return;
    }
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/message_reciever.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    $(".choose_chat").remove(); // Removing "choose chat" balloon
    $(".input_area").attr("style", "display: grid");
    $(".message_area").attr("style", "display: grid"); // Removing unecessary divs and new ones.
    $(".message_area").html("");
    $(".chats header").attr("style", "display: flex");
    const clip = $(".input_area label img")[0]; // Clips img
    clip.addEventListener("mouseover", () => { // Change img src
        clip.src = "assets/icons/file_hover.png";
    });
    clip.addEventListener("mouseout", () => {
        clip.src = "assets/icons/file.png";
    });
    id = parent.attributes["data-id"].value; // base64 id value. Example: 1; group:11 (in base64)
    statusBackend(`i=${id}&o=get`);

    $(".chat").attr("style", "background: #35215a"); // Removing "selected" background from every other div
    parent.style.background = "#291a46"; // Setting background to a darker one, indicating "selected"

    xml.send("c=" + id);
    xml.onload = () => {
        $(".chats header div")[0].innerHTML = parent.children[1].children[0].innerHTML; // Setting header status to the name of chat user clicked
        if (xml.responseText !== "[]") { // If there's a valid response
            const message_area = $(".message_area")[0];
            $(".input_area input").focus();
            if (!$(".chats:visible").length) {
                // Replace chat list with chat. The 'return' command needs to be there. #MediaQuery
                return;
            }
            JSON.parse(xml.responseText).forEach(message => { // ForEach message
                const d = new Date(Number(message.time) * 1000);
                const messageTime = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
                if (message.sender !== atob(sessionStorage[btoa("id")])) { // If message sender is not the same as the chat user clicked (if user didn't send the msg)
                    if (atob(id).indexOf("group") > -1) { // If this chat is a group chat
                        message_area.innerHTML += `<div class="their"><div class="message" style="border-bottom-left-radius: 0;" inc>${load_info(message, "name") + atob(message.content) + messageTime}</div><img class="profile_img" src="${load_info(message, "img")}"></div>`;
                    } else { // If chat isn't a group chat
                        message_area.innerHTML += `<div class="message their" style="margin-left: 20px">${atob(message.content) + messageTime}</div>`;
                    }
                } else { // If user sent the message
                    message_area.innerHTML += `<div class="message mine">${atob(message.content) + messageTime}</div>`;
                }
            });
        }
    };
}

function load_info(message, operation) { // IMPROVE THIS. REPLACE undefined IN MEMORY AND AFTER WRITE IT TO DOCUMENT
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/load_info.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(`g=${message.sender}&o=${operation}`); // XML content is user input
    xml.onload = () => {
        if (operation === "img") {
            const img = document.querySelector("img[src=undefined]");
            img.src = xml.responseText;
            img.style.display = "grid";
        } else {
            const message = document.querySelector("[inc]");
            message.innerHTML = message.innerHTML.replace("undefined", `<span style='color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold'>${xml.responseText}</span>`);
            message.removeAttribute("inc");
        }
    };
}