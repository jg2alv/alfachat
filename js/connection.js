$(document).ready(() => {
    $(window).on("offline", () => {
        const canUpdateBck = canUpdate;
        falsify();

        const toast = new Toast("Conex&atilde;o perdida!", "background-color: #c80003;");
        toast.show();

        $(window).on("online", () => {
            canUpdate = canUpdateBck;
            $(window).off("online");

            toast.update("Online novamente!", "background-color: green; display: block;");
            toast.destroy(2500);
        });
    });
});