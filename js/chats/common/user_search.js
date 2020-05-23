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
                chat_result_list.innerHTML += xml.responseText;
                $(".chat:visible").on("click", openChat);
            }
            else
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
            
            $(chat_list).attr('hidden', '');
        };
    });
});