let id; // Setting global ID

$(document).ready(() => {
    const xml = new XMLHttpRequest();
    const chats = Array.from($(".chat:visible"));
    chats.forEach(chat => {
        chat.addEventListener("click", openChat); // Adding event to open chat on click
    });
    const form = $("form.input_area")[0];
    const input = $(".input_area input[type='text']")[0];
    form.addEventListener("submit", e => {
        e.preventDefault();
        statusBackend("o=set&i=online")
        xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        xml.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xml.send(`m=${input.value}&id=${id}`); // XML content is user input
        xml.onload = () => {
            input.value = "";
            const d = new Date();
            const messageTime = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
            document.querySelector(".message_area").innerHTML +=
                `<div class='message mine'>${xml.responseText + messageTime}</div>`;
        };
    });
    const header_input = document.querySelector(
        ".chat_selector header input[type='text']"
    );
    const chat_result_list = $(".chat_result_list")[0];
    const chat_list = $(".chat_list")[0];
    header_input.value = ""; // Removing input's value
    header_input.addEventListener("keyup", k => {
        // When user press any key, the result list will appear
        if (
            !header_input.value ||
            (header_input.value.length == 1 && k.keyCode == 78) ||
            header_input.value == " "
        ) {
            // If the header has no value OR (it's length is 1 AND user key is backspace) OR is the value is a spacebar
            chat_result_list.setAttribute("hidden", ""); // Set hidden attribute
            chat_list.removeAttribute("hidden"); // Removing original list's hidden attribute
            return; // Stopping the function
        }
        $(chat_list).attr("hidden", ""); // Setting original list hidden attr
        xml.open("POST", "../xmlhttprequest/chat_search.php", true);
        xml.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xml.send(`q=${header_input.value}`); // XML content is user input
        xml.onload = () => {
            chat_result_list.removeAttribute("hidden"); // Removing just to be sure
            chat_result_list.innerHTML = ""; // Removing list's HTML to avoid duplicate results
            if (xml.responseText) {
                // If there's a valid response text
                response = JSON.parse(xml.responseText); // Parsing JSON's server response text
                response.forEach(user => {
                    if (!isNaN(header_input.value)) {
                        user["bio"] = user["rg"]; // If user is searching other user's RG
                    }

                    if (!user["photo"]) {
                        // If user don't have a profile pic
                        user["photo"] = "assets/avatars/user/default.png";
                    }

                    if (!user["bio"]) {
                        user["bio"] = "";
                    }

                    chat_result_list.innerHTML += `<div class="chat" data-id="${btoa(
                        user["id"]
                    )}"><div class="chat_pic"><img src="${
                        user["photo"]
                    }"></div><div class="chat_info"><div>${
                        user["name"]
                    }</div><div>${user["bio"]}</div></div></div>`;
                    const chats = Array.from($(".chat:visible"));
                    chats.forEach(chat => {
                        chat.addEventListener("click", openChat);
                    });
                });
            } else {
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
                chat_result_list.style = "overflow-y: hidden !important";
            }
        };
    });
});

function openChat(e) {
    let parent = e.target;
    while (parent.classList.value != "chat") { // While the place where user clicked (children div) DO NOT have "chat" class
        parent = parent.parentNode; // Set it to it's parent (because IT WILL be a children)
    }
    id = parent.attributes["data-id"].value; // base64 id value. Example: 1; group:11 (in base64)
    statusBackend(`i=${id}&o=get`);
    if ($(".chats header div")[0].innerHTML === parent.children[1].children[0].innerHTML) { // If user clicked on the same chat, don't reload it.
        return;
    }

    $(".chat").attr("style", "background: #35215a"); // Removing "selected" background from every other div
    parent.style.background = "#291a46"; // Setting background to a darker one, indicating "selected"
    const message_area = $(".message_area")[0];
    $(".chats header div")[0].innerHTML = parent.children[1].children[0].innerHTML; // Setting header status to the name of chat user clicked
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/message_reciever.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    $(".choose_chat").remove(); // Removing "choose chat" balloon
    $(".input_area").attr("style", "display: grid");
    $(".message_area").attr("style", "display: grid"); // Removing unecessary divs and new ones.
    $(".message_area").html("");
    $(".chats header").attr("style", "display: flex");
    if (sessionStorage[atob(sessionStorage[btoa("id")]) + btoa("," + id)] === undefined) {
        xml.send("c=" + id);
        xml.onload = () => { 
            if (xml.responseText !== "[]") { // If there's a valid response
                $(".input_area input").focus();
                if (!$(".chats:visible").length) {
                    // Replace chat list with chat. The 'return' command needs to be there. #MediaQuery
                    return;
                }
                JSON.parse(xml.responseText).forEach(message => { // ForEach message
                    const d = new Date(Number(message.time) * 1000);
                    const messageTime = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
                    if (message.sender !== atob(sessionStorage[btoa("id")])) { // If user didn't send the message
                        if (atob(id).indexOf("group") > -1) { // If this chat is a group chat
                            message_area.innerHTML += `<div class="their"><div class="message" style="border-bottom-left-radius: 0;">${"<span style='color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold'>" + message["name"] + "</span>" + atob(message.content) + messageTime}</div><img class="profile_img" src="${message["photo"]}"></div>`;
                        } else { // If chat isn't a group chat
                            message_area.innerHTML += `<div class="message their" style="margin-left: 20px">${atob(message.content) + messageTime}</div>`;
                        }
                    } else { // If user sent the message
                        message_area.innerHTML += `<div class="message mine">${atob(message.content) + messageTime}</div>`;
                    }
                });
                sessionStorage[atob(sessionStorage[btoa("id")]) + btoa("," + id)] = btoa(message_area.innerHTML);
            }
        };
    } else {
        message_area.innerHTML = atob(sessionStorage[atob(sessionStorage[btoa("id")]) + btoa("," + id)]);
    }

    const clip = $(".input_area label img")[0]; // Clips img
    clip.addEventListener("mouseover", () => { // Change img src
        clip.src = "assets/icons/file_hover.png";
    });
    clip.addEventListener("mouseout", () => {
        clip.src = "assets/icons/file.png";
    });
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}