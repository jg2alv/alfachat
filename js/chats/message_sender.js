$(document).ready(() => {
    const xml = new XMLHttpRequest();
    const form = $("form.input_area")[0];
    const input = $(".input_area input[type='text']")[0];
    form.addEventListener("submit", e => {
        e.preventDefault();
        xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        xml.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xml.send(`m=${input.value}&id=${id}`); // XML content is user input
        xml.onload = () => {
            input.value = "";
            const d = new Date();
            document.querySelector(".message_area").innerHTML +=
                "<div class='message mine'>" +
                xml.responseText +
                "<div class='message_time'>" +
                addZero(d.getHours()) +
                ":" +
                addZero(d.getMinutes()) +
                "</div></div>";
        };
    });
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
