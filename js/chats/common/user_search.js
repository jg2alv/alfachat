$(document).ready(() => {
    const header_input = document.querySelector(".chat_selector header input[type='text']"),
        chat_result_list = $('.chat_result_list')[0],
        chat_list = $('.chat_list')[0];

    header_input.value = '';
    header_input.addEventListener('keyup', k => {
        if (!header_input.value || (header_input.value.length === 1 && k.keyCode === 78) || header_input.value === ' ') {
            chat_result_list.setAttribute('hidden', '');
            chat_list.removeAttribute('hidden');
            return;
        }
        const xml = new XMLHttpRequest();
        xml.open('POST', '../server/chat_search.php', true);
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xml.send(`q=${header_input.value}`);
        xml.onload = () => {
            chat_result_list.innerHTML = '';
            chat_result_list.removeAttribute('hidden');
            if (xml.responseText) {
                const response = JSON.parse(xml.responseText);
                response.forEach(user => {
                    user['bio'] = !isNaN(header_input.value) ? user['ra'] : user['bio'];

                    if (user["members"] && Number(user["id"]) < 13) {
                        user["photo"] = `assets/avatars/groups/class/${user["id"]}.png`;
                        user["bio"] = `Turma do ${user["name"].replace("-", "do")}`;
                    } else if (user["members"])
                        user["photo"] = (user["photo"] === null) ? "assets/icons/group.png" : user["photo"]
                    else
                        user["photo"] = (user["photo"] === null) ? "assets/avatars/users/default.png" : user["photo"];
                        
                    chat_result_list.innerHTML += user["members"] ? `<div class="chat" data-id="${btoa("group:" + user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>` : `<div class="chat" data-id="${btoa(user["id"])}"><div class="pic"><img src="${user["photo"]}"></div><div class="info"><div>${user["name"]}</div><div>${user["bio"]}</div></div></div>`;
                    $(".chat:visible").on("click", openChat);
                });
            }
            else
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
            
            $(chat_list).attr('hidden', '');
        };
    });
});