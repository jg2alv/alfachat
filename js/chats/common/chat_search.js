$(document).ready(() => {
    const input = $(".chat_selector header input[type='text']"),
        result = $(".chat_result_list")

    $(input).val("");
    $(input).on("keyup", k => {
        if (!$(input).val() || ($(input).val().length === 1 && k.keyCode === 78) || $(input).val() === " ") {
            $(result).attr("hidden", "");
            $(".chat_list").removeAttr("hidden");
            return;
        }

        const xml = new XMLHttpRequest();
        xml.open('POST', '../server/chat_search.php', true);
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xml.send(`q=${$(input).val()}`);

        xml.onload = () => {
            $(result).html("");
            $(result).removeAttr("hidden");

            xml.responseText ? $(result).append(xml.responseText) : $(result).html(`<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`);
            $(".chat:visible").on("click", openChat);
            $(".chat_list").attr("hidden", "");
        }
    });
})