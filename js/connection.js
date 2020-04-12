$(document).ready(() => {
    $(window).on("offline", () => {
        update = false;

        $(".connection_status").html("Conex&atilde;o perdida!");
        $(".connection_status").css("background-color", "#c80003").slideDown();

        $(window).on("online", () => {
            $(window).off("online");

            $(".connection_status").html("Online novamente!");
            $(".connection_status").css("background-color", "green").slideDown();

            update = true;
            setTimeout(() => { $(".connection_status").slideUp() }, 2500);
        });
    });
});