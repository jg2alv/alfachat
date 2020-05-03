function addChat(user, div, check = false) {
    if (user["members"] && Number(user["id"]) < 13) { // Class group
        user["photo"] = `assets/avatars/groups/class/${user["id"]}.png`;
        user["bio"] = `Turma do ${user["name"].replace("-", "do")}`;
    } else if (user["members"]) // Personal group
        user["photo"] = (user["photo"] === null) ? "assets/icons/group.png" : user["photo"]
    else // User
        user["photo"] = (user["photo"] === null) ? "assets/avatars/users/default.png" : user["photo"];

    if (check)
        return user["members"] ? `<div class="chat" data-id="${btoa("group:" + user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>` : `<div class="chat" data-id="${btoa(user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>`;
    else
        div.innerHTML += user["members"] ? `<div class="chat" data-id="${btoa("group:" + user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>` : `<div class="chat" data-id="${btoa(user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>`;
    
    $(".chat:visible").on("click", openChat);
}