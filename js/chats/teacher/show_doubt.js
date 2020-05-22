function showDoubt(doubts) {
    if (!doubts.length) closeChat();
    else {
        id = btoa(`doubt:${doubts[0][1][0]}`);
        $(".chats .message_area").css({ "display": "block", "visibility": "visible" }).html("");
        doubts[0][0].forEach(msg => $(".chats .message_area").append(new Message(msg).parse()));
        $(".chats header div div").eq(0).html(doubts[0][1][1]);
        $(".chats header div div").eq(1).html(doubts[0][1][2]);
        chatListUpdater().then(() => {
            $(`.chat[data-id='${id}`).css("background-color", "#291a46");
            doubts.shift();
            $("#chats_header_drop_down div").eq(0).off("click").on("click", () => showDoubt(doubts));
        });
    }
}