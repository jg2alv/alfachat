function loadMessages(R, U) {
    const ma = $(".message_area")[0];
    $(".chats header div")[0].innerHTML = U;
    $(".input_area input").focus();
    if (R) {
        if (!$(".chats:visible").length) {
            // Replace chat list with chat. The return needs to be there.
            return;
        }

        R.forEach(message => {
            const d = new Date(Number(message.time) * 1000);
            if (message.reciever == atob(id)) {
                ma.innerHTML +=
                    "<div class='message mine'>" +
                    atob(message.content) +
                    "<div class='message_time'>" +
                    addZero(d.getHours()) +
                    ":" +
                    addZero(d.getMinutes()) +
                    "</div></div>";
            } else {
                ma.innerHTML +=
                    "<div class='message their'>" +
                    atob(message.content) +
                    "<div class='message_time'>" +
                    addZero(d.getHours()) +
                    ":" +
                    addZero(d.getMinutes()) +
                    "</div></div>";
            }
        });
    }
}