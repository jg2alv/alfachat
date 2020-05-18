$(document).ready(() => $(".input_area textarea").on("input paste cut", resize));

function resize() {
    $(this).height(0).height(this.scrollHeight);
    if ($(this).height() == $(this).css("max-height").slice(0, -2))
        $(this).css("overflow-y", "auto");
    else
        $(this).css("overflow-y", "hidden");
}