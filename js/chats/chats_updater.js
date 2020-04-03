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
                if (message.file !== "0") {
                    message.file = JSON.parse(message.file);
                    const img = ["png", "jpg", "jpeg", "gif", "jfif"],
                    video = ["mp4", "webm", "ogg"];
                    if (img.includes(message.file.extension)) {
                        chats += `<div style="display: grid"><div class="message mine"><img src="${atob(message.file.location)}">${messageTime}</div></div>`;
                    } else if  (video.includes(message.file.extension)) {
                        chats += `<div style="display: grid"><div class="message mine"><video controls=""><source src="${atob(message.file.location)}" type="video/${message.file.extension}"></video>${messageTime}</div></div>`;
                    } else {
                        chats += `<div style="display: grid"><div class="message mine"><div><a style="display: flex" href="${atob(message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/download.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(message.file.size)}</div></div></a></div> ${messageTime}</div></div>`;
                    }
                } else {
                    chats += `<div style="display: grid"><div class="message mine">${message.content + messageTime}</div></div>`;
                }
            }
        });

        if (message_area.innerHTML !== chats) {
            message_area.innerHTML = chats;
        }

        if (scroll) {
            setTimeout(() => {
                message_area.scrollTop = message_area.scrollHeight;
                setTimeout(() => {
                    message_area.style.display = "block";
                }, 60);
                return;
            }, 50);
        }

        setTimeout(() => {
            message_area.style.display = "block";
        }, 50);
    };
}

function convertUnits(bytes) {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}