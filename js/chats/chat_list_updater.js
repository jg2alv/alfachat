function chatListUpdater() {
    const chat_list = document.querySelector(".chat_list");
    const xml = new XMLHttpRequest();
    setInterval(() => {
        xml.open("POST", "../xmlhttprequest/chat_list_refresher.php", true);
        xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xml.send(`cl=${chat_list.attributes["data-chats"].value}`);
        xml.onload = () => {
            if (xml.responseText) {
                chat_list.innerHTML = "";
                const response = JSON.parse(xml.responseText);
                let chats;
                response.forEach(user => {
                    chats += user["members"] ? `group:${user["id"]},` : user["id"] + ",";
                    addChat(user, chat_list);
                })
                chats = btoa(chats.slice(0, -1).replace("undefined", ""));
                chat_list.setAttribute("data-chats", chats);
            }
        }
    }, 300)
}