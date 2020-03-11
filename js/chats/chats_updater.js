function updateChats(scroll = false) {
    const xml = new XMLHttpRequest();
    let chats = "";
    const message_area = $(".message_area")[0];
    xml.open("POST", "../xmlhttprequest/message_reciever.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send("c=" + id);
    xml.onload = () => {
        let response; // Try/ Catch has an specific scope. Declaring 'response' inside it doesn't work (since I'm using 'response' outside it as well)
        try {
            response = JSON.parse(xml.responseText)
        } catch {
            message_area.innerHTML = "";
            return;
        }
        $(".input_area input").focus();
        if (!$(".chats:visible").length) { // Mobile
            $(".chat_selector")[0].style.display = "none";
            $(".chats")[0].style.display = "grid";
            $(".chats")[0].style.width = "100%";
        }
        response.forEach(message => { // ForEach message
            const d = new Date(Number(message.time) * 1000);
            const messageTime = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
            if (message.sender !== atob(sessionStorage[btoa("id")])) { // If user didn't send the message
                if (atob(id).indexOf("group") > -1) { // If this chat is a group chat
                    chats += `<div style="display: grid"><div class="their"><div class="message" style="border-bottom-left-radius: 0;">${"<span style=\"color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold\">" + message["name"] + "</span>" + message.content + messageTime}</div><img class="profile_img" src="${message["photo"]}"></div></div>`;
                } else { // If chat isn't a group chat
                    chats += `<div style="display: grid"><div class="message their" style="margin-left: 20px">${message.content + messageTime}</div></div>`;
                }
            } else { // If user sent the message
                chats += `<div style="display: grid"><div class="message mine">${message.content + messageTime}</div></div>`;
            }
        });
        if (message_area.innerHTML !== chats) {
            message_area.innerHTML = chats;
        }
        if (scroll) {
            message_area.style.display = "block";
            message_area.scrollTop = message_area.scrollHeight;
        }
    };
}