const xml = new XMLHttpRequest();

$(document).ready(() => {
    const header_input = document.querySelector("header input");
    const chat_result_list = $(".chat_result_list")[0];
    header_input.value = "";
    header_input.addEventListener("keyup", k => {
        chat_result_list.style.overflowY = "auto";
        if (!header_input.value || (header_input.value.length == 1 && k.keyCode == 78) || header_input.value == " ") {
            chat_result_list.setAttribute("hidden", "");
            document.querySelector(".chat").removeAttribute("hidden");
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
                document.querySelector(".chat").setAttribute("hidden", "");
                const files = document.querySelector(".chat_list").getAttribute("data-files");
                for (let i = 0; i < Object.keys(response).length; i++) {
                    chat_result_list.innerHTML += `<div class="chat_result"><div class="chat_result_pic"><img src="${String(response[i]["photo"]).replace("null","assets/user_avatars/Avatar_" + ('0' + Math.floor((Math.random() * files) + 1)).slice(-2) + ".png")}"></div><div class="chat_result_info"><div>${response[i]["name"]}</div><div>${String(response[i]["description"]).replace(null,"")}</div></div></div>`;
                }
            } else {
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`;
                chat_result_list.style.overflowY = "hidden";
            }
        };
    });
});
