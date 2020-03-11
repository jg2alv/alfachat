function messageSender() {
    const xml = new XMLHttpRequest();
    const chats = Array.from($(".chat:visible"));
    chats.forEach(chat => {
        chat.addEventListener("click", openChat); // Adding event to open chat on click
    });
    const form = $("form.input_area")[0];
    const input = $(".input_area input[type='text']")[0];
    form.addEventListener("submit", e => {
        e.preventDefault();
        const message_area = document.querySelector(".message_area");
        statusBackend("o=set&i=online")
        xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xml.send(`m=${input.value}&id=${id}`); // XML content is user input
        xml.onload = () => {
            clearInterval(chats_updater);
            input.value = "";
            const d = new Date();
            const messageTime = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
            message_area.innerHTML += `<div style="display: grid"><div class="message mine">${xml.responseText + messageTime}</div></div>`;
            chats_updater = setInterval(updateChats, 300);
            message_area.scrollTop = message_area.scrollHeight;
        };
    });
}