function sendDoubts() {
    if (!$(".message_area").html()) {
        const toast = new Toast("Faça uma pergunta antes de enviar!");
        toast.show();
        toast.destroy(2500);
        return;
    }

    $(".side_menu_visible").css("display", "none");
    $(".side_menu_bg").css("flex", 1);
    $(".side_menu").css("display", "flex");

    $("#doubt_send").css("display", "flex");

    $("#doubt_send button").on("click", () => {
        $("#doubt_send").css("display", "none");
        $(".side_menu").css("display", "none");

        const xml = new XMLHttpRequest();
        
        xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xml.send(`f=${$("#send_to_forum").attr("data-checked")}&m=${JSON.stringify(doubts)}&id=${id}&subject=${$(".chats > header:nth-child(1) > div:nth-child(2) > div:nth-child(1)").html().replace("Suporte de ", "")}`);
        xml.onload = () => {
            const toast = new Toast("Dúvida enviada com sucesso! Assim que possível, será respondida.");
            toast.show();
            toast.destroy(2500);
        }
    });
}