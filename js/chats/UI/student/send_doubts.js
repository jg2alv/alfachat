function sendDoubts() {
    if (doubts == false) {
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
        doubts.set("public", $("#send_to_forum").attr("data-checked") || 1);
        doubts.set("receiver", id);
        doubts.set("subject", $(".chats header div div").eq(0).html().replace("Suporte de ", ""));

        $("#doubt_send").css("display", "none");
        $(".side_menu").css("display", "none");

        const xml = new XMLHttpRequest();
        
        xml.open("POST", "../xmlhttprequest/doubts_sender.php", true);
        xml.send(doubts);
        doubts = new FormData();
        xml.onload = () => {
            const toast = new Toast("Dúvida enviada com sucesso! Assim que possível, será respondida.");
            toast.show();
            toast.destroy(2500);
            $('.choose_chat').css("display", "flex");
	        $('.input_area').css('display', 'none');
            $('.chats header').css('display', 'none');
            $(".message_area").html("").css({display: "none", visibility: "none"});
            canUpdate = false;
        }
    });
}