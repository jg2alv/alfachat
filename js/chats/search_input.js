const xml = new XMLHttpRequest();

$(document).ready(() => {
    const header_input = document.querySelector("header input");
    const chat_result_list = $(".chat_result_list")[0];
    header_input.value = "";
    header_input.addEventListener("keyup", k => {
        if (
            !header_input.value ||
            (header_input.value.length == 1 && k.keyCode == 78)
        ) {
            chat_result_list.setAttribute("hidden", "");
            return;
        }
        xml.open("POST", "../xmlhttprequest/chat_search.php", true);
        xml.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xml.send(`q=${header_input.value}`);
        xml.onload = () => {
            chat_result_list.removeAttribute("hidden");
            chat_result_list.innerHTML = "";
            if (xml.responseText) {
                response = JSON.parse(xml.responseText);
                chat_result_list.removeAttribute("hidden");
                chat_result_list.innerHTML = "";
                for (let i = 0; i < Object.keys(response).length; i++) {
                    chat_result_list.innerHTML += `<div class="chat_result"><div class="chat_result_pic"><img src="${response[i]["photo"]}"></div><div class="chat_result_name">${response[i]["name"]}</div></div>`;
                }
            } else {
                chat_result_list.innerHTML += `<div class="no_result">Nenhum resultado encontrado.</div>`;
            }
        };
    });
});
