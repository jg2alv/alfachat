function sendDoubts() {
    $("#doubt_name")[0].value = "";

    if (!doubts.length) {
        const toast = new Toast("Faça uma pergunta antes de enviar!");
        toast.show();
        toast.destroy(2500);
        return;
    }

    $(".side_menu_visible").css("display", "none");
    $(".side_menu").css("display", "flex");

    $("#doubt_send").css("display", "flex");

    $("#doubt_send button").on("click", () => {
        const name = $("#doubt_name")[0].value;

        if (!name || name === " ") {
            $("#doubt_name").css({"border": "1px solid red", "color": "red"});
            $("#doubt_name").on("keypress", function() {$(this).css({"border": "", "color": ""})});
            return;
        }

        doubts.set("public", $("#send_to_forum").attr("data-checked") || 1);
        doubts.set("receiver", id);
        doubts.set("subject", btoa($(".chats header div div").eq(0).html().replace("Suporte de ", "")));
        doubts.set("name", btoa(name));

        $("#doubt_send").css("display", "none");
        $(".side_menu").css("display", "none");

        const xml = new XMLHttpRequest();
        
        xml.open("POST", "../server/doubts_sender.php", true);
        xml.send(doubts);
        doubts = new FormData();
        xml.onload = () => {
            const toast = new Toast("Dúvida enviada com sucesso! Assim que possível, será respondida.");
            toast.show();
            toast.destroy(2500);
            closeChat();
        }
    });
}