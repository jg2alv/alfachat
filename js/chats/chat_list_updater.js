function chatListUpdater() {
    const t0 = performance.now(),
        chat_list = document.querySelector(".chat_list"),
        xml = new XMLHttpRequest();

    xml.open("POST", "../xmlhttprequest/chat_list_refresher.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(`cl=${chat_list.attributes["data-chats"].value}`);

    xml.onload = () => {
        if (xml.responseText) {
            const response = JSON.parse(xml.responseText);
            let chats = list = "";

            response.forEach(user => {
                chats += user["members"] ? `group:${user["id"]},` : user["id"] + ",";
                list += addChat(user, chat_list, true);
            })
            chats = btoa(chats.slice(0, -1));

            chat_list.setAttribute("data-chats", chats);

            if (chat_list.innerHTML !== list) {
                chat_list.innerHTML = list;
                $(".chat:visible").on("click", openChat);
            }
        }
    }

    const t1 = performance.now(),
        diff = t1 - t0;

    if (diff < 300) {
        setTimeout(chatListUpdater, 300 - diff);
    } else {
        chatListUpdater();
    }

    return;
}