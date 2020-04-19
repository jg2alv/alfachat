$(document).ready(() => {
    $(window).on("offline", () => {
        update = false;

        const toast = new Toast("Conex&atilde;o perdida!", "background-color: #c80003;");
        toast.show();

        $(window).on("online", () => {
            update = true;
            $(window).off("online");

            toast.update("Online novamente!", "background-color: green; display: block;");
            toast.destroy(2500);
        });
    });
});