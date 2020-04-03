function addChat(user, div) {
    if (user["members"] && Number(user["id"]) < 13) { // Class group
        user["photo"] = `assets/avatars/groups/class/${user["id"]}.png`;
        user["bio"] = `Turma do ${user["name"].replace("-", "do")}`;
    } else if (user["members"]) { // Personal group
        if (user["photo"] === null) {
            user["photo"] = "assets/icons/group.png";
        }
        user["bio"] = user["desc"] ? user["desc"] : "Grupo de amantes do AlfaChat";
    } else { // User
        if (user["photo"] === null) {
            user["photo"] = "assets/avatars/users/default.png";
        }
        user["bio"] = user["bio"] ? user["bio"] : user["bio"] = "";
    }

    if (user["members"]) {
        div.innerHTML += `<div class="chat" data-id="${btoa("group:" + user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>`;
    } else {
        div.innerHTML += `<div class="chat" data-id="${btoa(user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>`;
    }
    const chats = Array.from($(".chat:visible"));
    chats.forEach(chat => {
        chat.addEventListener("click", openChat);
    });
}