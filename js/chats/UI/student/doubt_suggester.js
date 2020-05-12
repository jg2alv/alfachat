
$(document).ready(() => {
    fetch_doubts();

    $(".chats .input_area textarea").on("input", function() {
        if (this.scrollHeight > this.clientHeight)
            $(this).css("height", $(this).height() + Number($(this).css("font-size").slice(0, -2)));
        else if (this.scrollHeight < this.clientHeight)
            $(this).css("height", $(this).height() - Number($(this).css("font-size").slice(0, -2)));

        $("#doubt_suggester").html("");

        if (this.value.indexOf("#") === -1) {
            $("#doubt_suggester").css("display", "none");
            return;
        }

        const sizeSpan = document.createElement("span"),
            height = $(".input_area").height();

        $(sizeSpan).css({ "visibility": "hidden", "font-size": "18px", "position": "absolute" }).html(this.value);
        document.body.append(sizeSpan);

        let size = $(sizeSpan).width();
        $(sizeSpan).remove();

        while (size > $(this).width())
            size -= $(this).width();

        $("#doubt_suggester").css({ "display": "block", "bottom": `${height}px`, "left": `calc(40vw + ${height}px + ${$(this).css("padding-left")} + ${size}px)` });

        forum_doubts.forEach(doubt => {
            $("#doubt_suggester").append(`<li aria-selected="false" data-value="${doubt[1][3]}"><div style="font-size: 12px; color: #ccc">#${doubt[1][3]}</div><div style="display: flex; justify-content: space-between; box-sizing: border-box; align-items: center"><div style="padding: 10px; white-space: nowrap; overflow-x: hidden">${doubt[1][0]}</div><div style="padding: 10px; color: #ccc; font-size: 14px">${doubt[1][2]}</div></div></li>`);
        });

        $(document).on("keydown click", e => {
            if (e.type === "click" || e.keyCode === 13) {
                $(document).off("keydown click");
                $(this).focus();
            } else if (e.keyCode === 27) {
                $(document).off("keydown click");
                $("#doubt_suggester").css("display", "none");
                $(this).focus();
            } else if (e.keyCode === 38 || e.keyCode === 87) { // up
                if ($("#doubt_suggester li[aria-selected=true]") !== $("#doubt_suggester li:first"))
                    $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false).prev().attr("aria-selected", true)
                else {
                    $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false);
                    $("#doubt_suggester li:last").attr("aria-selected", true);
                }
            } else if (e.keyCode === 40 || e.keyCode === 83) { // down
                if ($("#doubt_suggester li[aria-selected=true]") !== $("#doubt_suggester li:last"))
                    $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false).next().attr("aria-selected", true)
                else {
                    $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false);
                    $("#doubt_suggester li:first").attr("aria-selected", true);
                }
            }
        });

        $("#doubt_suggester li").eq(0).attr("aria-selected", true);
        $("#doubt_suggester li:last").css("border", "none");
    });
});