function loadMessages(R, U) {
    const ma = $(".message_area")[0];
    $(".chats header div")[0].innerHTML = U;
    $(".input_area input").focus();
    if (R) {
        if (!$(".chats:visible").length) {
            // Replace chat list with chat. The 'return' command needs to be there.
            return;
        }

        R.forEach(message => {
            const d = new Date(Number(message.time) * 1000);
            if (message.sender !== atob(sessionStorage[btoa("id")])) {
                if (atob(id).indexOf("group") !== -1) {
                    ma.innerHTML += `<div class="their"><div class="message" style="border-bottom-left-radius: 0;" inc>${load_info(message, "name") + atob(message.content)}<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div></div><img class="profile_img" src="${load_info(message, "img")}"></div>`;
                } else {
                    ma.innerHTML += `<div class="message their" style="margin-left: 20px">${atob(message.content)}<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div></div>`;
                }
            } else {
                ma.innerHTML += `<div class="message mine">${atob(message.content)}<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div></div>`;
            }
        });
    }
}

function load_info(message, o) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/load_info.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(`g=${message.sender}&o=${o}`); // XML content is user input
    if (o === "img") {
        xml.onload = () => {
            const img = document.querySelector("img[src=undefined]");
            img.src = xml.responseText;
            img.style.display = "grid";
        };
    } else if (o === "name") {
        xml.onload = () => {
            const message = document.querySelector("[inc]");
            message.innerHTML = message.innerHTML.replace("undefined", `<span style='color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold'>${xml.responseText}</span>`);
            message.removeAttribute("inc");
        };
    }
}
