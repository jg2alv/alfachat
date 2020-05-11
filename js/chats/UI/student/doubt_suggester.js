(() => {
    const xml = new XMLHttpRequest();

    xml.open("POST", "../xmlhttprequest/doubt_suggester.php", true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send("a=1");
    xml.onload = () => {
        $(document).ready(() => {
            $(".chats .input_area textarea").on("input", e => {
                $("#doubt_suggester").html("");

                if (e.target.value.indexOf("#") === -1) {
                    $("#doubt_suggester").css("display", "none");
                    return;
                }

                const sizeSpan = document.createElement("span"),
                    height = $(".input_area img").eq(0).height();

                $(sizeSpan).css({"visibility": "none", "font-size": "18px", "max-width": `${$(".input_area textarea").width()}px`, "word-wrap": "break-word"}).html(e.target.value.slice(1, e.target.selectionStart));
                document.body.append(sizeSpan);

                const size = $(sizeSpan).width() < getComputedStyle($(".input_area textarea")[0]).width.slice(0, -2) ? $(sizeSpan).width() : ($(sizeSpan).width() - getComputedStyle($(".input_area textarea")[0]).width.slice(0, -2));
                $(sizeSpan).remove();

                $("#doubt_suggester").css({"display": "block", "bottom": height, "left": `calc(40vw + ${height}px + ${$(".input_area textarea").css("padding-left")} + ${size}px)`});
                JSON.parse(xml.responseText).forEach(doubt => {
                    $("#doubt_suggester").append(`<li aria-selected="false" data-value="${doubt.id}"><div style="font-size: 12px; color: #ccc">#${doubt.id}</div><div style="display: flex; justify-content: space-between; box-sizing: border-box; align-items: center"><div style="padding: 10px; white-space: nowrap; overflow-x: hidden">${doubt.name}</div><div style="padding: 10px; color: #ccc; font-size: 14px">${doubt.subject}</div></div></li>`);
                });

                $(document).on("keydown", function(e) {
                    if (e.keyCode === 27) {
                        $(document).off("keydown");
                        $("#doubt_suggester").css("display", "none");
                        return;
                    }

                    if (e.keyCode === 38) {
                        if ($("#doubt_suggester li[aria-selected=true]") !== $("#doubt_suggester li:first"))
                            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false).prev().attr("aria-selected", true)
                        else {
                            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false);
                            $("#doubt_suggester li:last").attr("aria-selected", true);
                        }
                    } // up

                    if (e.keyCode === 40) {
                        if ($("#doubt_suggester li[aria-selected=true]") !== $("#doubt_suggester li:last"))
                            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false).next().attr("aria-selected", true)
                        else {
                            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false);
                            $("#doubt_suggester li:first").attr("aria-selected", true);
                        }
                    } // down
                });

                $("#doubt_suggester li").eq(0).attr("aria-selected", true);
                $("#doubt_suggester li:last").css("border", "none");
            })
        });
    }
})();