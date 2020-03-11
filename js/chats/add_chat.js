function addChat(user, div) {
    if (user["members"]) {
        user["photo"] = `assets/avatars/groups/class/${user["id"]}.png`;
        user["bio"] = `Turma do ${user["name"].replace("-", "do")}`;
    } else {
        user["photo"] = user["photo"] ? user["photo"] : "assets/avatars/user/default.png";
        user["bio"] = user["bio"] ? user["bio"] : user["bio"] = "";
    }

    div.innerHTML += `<div class="chat" data-id="${btoa(
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
}