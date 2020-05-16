$(document).ready(() => {
    $(".input_area textarea").on("input", function() {
        if (this.scrollHeight > this.clientHeight)
            $(this).css("height", $(this).height() + Number($(this).css("font-size").slice(0, -2)));
        else if (this.scrollHeight < this.clientHeight)
            $(this).css("height", $(this).height() - Number($(this).css("font-size").slice(0, -2)));
    });
});