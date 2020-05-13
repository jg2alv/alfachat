
$(document).ready(() => {
    fetch_doubts();

    $(".chats .input_area textarea").on("input", function (e) {
        if (this.scrollHeight > this.clientHeight)
            $(this).css("height", $(this).height() + Number($(this).css("font-size").slice(0, -2)));
        else if (this.scrollHeight < this.clientHeight)
            $(this).css("height", $(this).height() - Number($(this).css("font-size").slice(0, -2)));

        if (e.originalEvent.data === null || e.originalEvent.data === " " || !this.value) {
            $("#doubt_suggester").css("display", "none");
            $("#doubt_suggester li").css("display", "flex");
            $(".input_area").off("keydown").on("keydown", hashAutoComplete).find("#doubt_suggester li").off("click").on("click", hashAutoComplete);
            return;
        }

        if ($("#doubt_suggester:visible").length) {
            const doubt_suggester_items = $("#doubt_suggester li");
            const input = this.value.split("");

            let hashtag = new Array();
            let num = this.selectionStart - 1;
            while (input[num] !== " ") {
                if (input[num] === undefined)
                    break;
                hashtag.push(input[num]);
                num--;
            }
            hashtag = (hashtag.reverse()).join("").replace("#", "");

            for (let doubt of doubt_suggester_items) {
                if (!doubt.innerText.includes(hashtag))
                    $(doubt).remove();
            }

            if (!$("#doubt_suggester li:visible").length) {
                $(".input_area").off("keydown").find("#doubt_suggester li").off("click");
                return;
            }

            $(doubt_suggester_items).attr("aria-selected", false);
            $("#doubt_suggester li:visible:first").attr("aria-selected", true);
            $("#doubt_suggester li:visible:last").css("border", "none");
            $(".input_area").off("keydown").on("keydown", hashAutoComplete).find("#doubt_suggester li").off("click").on("click", hashAutoComplete);
            return;
        }

        $("#doubt_suggester").html("");

        if (this.value.indexOf("#") === -1) {
            $("#doubt_suggester").css("display", "none");
            return;
        }

        const sizeSpan = document.createElement("span"),
            height = $(".input_area").height();

        $(sizeSpan).css({ "visibility": "hidden", "font-size": "18px", "position": "absolute" }).html(this.value.slice(0, this.selectionStart));
        document.body.append(sizeSpan);

        let size = $(sizeSpan).width();
        $(sizeSpan).remove();

        while (size > $(this).width())
            size -= $(this).width();

        $("#doubt_suggester").css({ "display": "block", "bottom": `${height}px`, "left": `calc(40vw + ${height}px + ${$(this).css("padding-left")} + ${size}px)` });

        forum_doubts.forEach(doubt => $("#doubt_suggester").append(`<li aria-selected="false" data-value="${doubt[1][3]}"><div style="font-size: 12px; color: #ccc">#${doubt[1][3]}</div><div style="display: flex; justify-content: space-between; box-sizing: border-box; align-items: center"><div style="padding: 5px 10px; white-space: nowrap; overflow-x: hidden">${doubt[1][0]}</div><div style="padding: 5px 10px; color: #ccc; font-size: 14px">${doubt[1][2]}</div></div></li>`));

        $("#doubt_suggester li").eq(0).attr("aria-selected", true);

        $(".input_area").off("keydown").on("keydown", hashAutoComplete).find("#doubt_suggester li").off("click").on("click", hashAutoComplete);
    });
});

function hashAutoComplete(e) {
    if (!$("#doubt_suggester li:visible").length) {
        $(".input_area").off("keydown").find("#doubt_suggester li").off("click");
        return;
    }

    if (e.type === "click" || e.keyCode === 13) {
        e.keyCode === 13 ? e.preventDefault() : null;

        let before = $(".input_area textarea")[0].value.slice(0, $(".input_area textarea")[0].selectionStart - 1);
        let hash = (e.type === "click") ? `#${$(e.target).closest("li").attr("data-value")} ` : `#${$("#doubt_suggester li[aria-selected=true]").attr("data-value")} `;
        let after = $(".input_area textarea")[0].value.slice($(".input_area textarea")[0].selectionStart);

        let count = 2;
        while (before.indexOf("#") > -1) {
            before = $(".input_area textarea")[0].value.slice(0, $(".input_area textarea")[0].selectionStart - count);
            count++;
        }

        if (before.slice(-1) !== " " && before.slice(-1) !== "")
            before += " ";

        $(".input_area textarea")[0].value = `${before + hash + after}`;
        $("#doubt_suggester").css("display", "none");
        $(".input_area textarea").focus();
        $(".input_area").off("keydown");
    } else if (e.keyCode === 38 || e.keyCode === 87) {
        if ($("#doubt_suggester li[aria-selected=true]")[0] !== $("#doubt_suggester li:first")[0]) {
            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false).prev().attr("aria-selected", true);
            //$("#doubt_suggester")[0].scrollTop -= $("#doubt_suggester li[aria-selected=true]").height();
        } else {
            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false);
            $("#doubt_suggester li:last").attr("aria-selected", true);
            $("#doubt_suggester")[0].scrollTop = $("#doubt_suggester")[0].scrollHeight - $("#doubt_suggester")[0].clientHeight
        }
    } else if (e.keyCode === 40 || e.keyCode === 83) {
        if ($("#doubt_suggester li[aria-selected=true]")[0] !== $("#doubt_suggester li:last")[0]) {
            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false).next().attr("aria-selected", true);
            //$("#doubt_suggester")[0].scrollTop += $("#doubt_suggester li[aria-selected=true]").height();
        } else {
            $("#doubt_suggester li[aria-selected=true]").attr("aria-selected", false);
            $("#doubt_suggester li:first").attr("aria-selected", true);
            $("#doubt_suggester")[0].scrollTop = 0;
        }
    } else if (e.keyCode === 27) {
        $("#doubt_suggester").css("display", "none");
        $(".input_area").off("keydown");
    }
}