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
        if (!input.value) {
            return;
        }
        const message_area = document.querySelector(".message_area");
        xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xml.send(`m=${input.value}&id=${id}`); // XML content is user input
        xml.onload = () => {
            input.value = "";
            const d = new Date();
            const messageTime = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
            message_area.innerHTML += `<div style="display: grid"><div class="message mine">${xml.responseText + messageTime}</div></div>`;
            message_area.scrollTop = message_area.scrollHeight;
        };
    });

    const file = $(".input_area input[type='file']")[0];
    file.addEventListener("change", () => {
    if (file.files.length < 1) {
        return;
    }

    const formData = new FormData();
    formData.set("file_user_input", file.files[0]);
    formData.set("id", id);

    xml.open("POST", "../xmlhttprequest/chat_file_upload.php", true);
    xml.send(formData);
    
    xml.onload = () => {
        console.log(xml.responseText);
    }
    })
}