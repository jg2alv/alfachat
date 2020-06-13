$(document).ready(() => $(".input_area textarea").on("input", Suggester));
fetch_doubts();

function Suggester(e) {
    let members = $(".chat[aria-selected='true']").data("members");

    const position = () => {
        const sizeSpan = document.createElement("span");

        $(sizeSpan).css({ "visibility": "hidden", "font-size": "18px", "position": "absolute" }).html(this.value.slice(0, this.selectionStart).replace(/\n\g/, "<br>"));
        document.body.append(sizeSpan);

        let size = $(sizeSpan).width();
        $(sizeSpan).remove();

        while (size > $(this).width())
            size -= $(this).width();

        return size;
    };

    const addSpaces = (before, after) => {
        if (before && before.slice(-1) !== " ")
            before = `${before} `;

        if (after[0] !== " ")
            after = ` ${after}`

        return [before, after];
    };

    const navigation = e => {
        e.type === "click" || e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 27 ? e.preventDefault() : null;
        const sel = $("#suggester li[aria-selected=true]");

        if (e.type === "click" || e.keyCode === 13) { // Enter or Click
            $(".input_area").off("keydown");
            $("#suggester li, #suggester .menu_icon").off("click");

            $("#suggester").css("display", "none");
            $(".input_area:visible textarea").focus();

            const result = (() => {
                let sel = this.selectionStart,
                    before = this.value.slice(0, sel).split(""),
                    middle = e.type === "click" ? $(e.target).closest("li").attr("data-value") || $(e.currentTarget).attr("data-value") : $("#suggester li[aria-selected=true]").attr("data-value") || $("#suggester div[aria-selected=true]").attr("data-value"),
                    after = this.value.slice(sel);
                sel--;

                while (before[sel] !== " " && before[sel] !== undefined) {
                    before.splice(sel, 1);
                    sel--;
                }

                before = before.join("");
                const result = addSpaces(before, after);
                return [result[0], middle, result[1]];
            })();
            $(this).val(new String(result[0] + result[1] + result[2]));
        } else if (e.keyCode === 38) { // Up
            if ($("#suggester").attr("data-suggester") === ":") {
                if ($(sel).index() >= 3) {
                    $(sel).removeAttr("aria-selected").prev().prev().prev().attr("aria-selected", true);
                    if (Math.ceil(((1 + $(sel).index()) / 3)) * $(sel).outerHeight(false) > $("#suggester").height())
                        $("#suggester").scrollTop($("#suggester").scrollTop() - $(sel).outerHeight(false) * 2);
                } else {
                    $(sel).removeAttr("aria-selected");
                    $("#suggester li:last").attr("aria-selected", true);
                    $("#suggester").scrollTop($("#suggester")[0].scrollHeight - $("#suggester").height());
                }
            } else if ($("#suggester").attr("data-suggester") === "#" || $("#suggester").attr("data-suggester") === "@") {
                if (sel[0] !== $("#suggester li:first")[0])
                    $(sel).removeAttr("aria-selected").prev().attr("aria-selected", true);
                else {
                    $(sel).removeAttr("aria-selected");
                    $("#suggester li:last").attr("aria-selected", true);
                }
            }
        } else if (e.keyCode === 37) { // Left
            if (sel[0] !== $("#suggester li:first")[0]) {
                $(sel).attr("aria-selected", false).prev().attr("aria-selected", true);
            } else {
                $(sel).attr("aria-selected", false);
                $("#suggester li:last").attr("aria-selected", true);
            }
        } else if (e.keyCode === 40) { // Down
            if ($("#suggester").attr("data-suggester") === ":") {
                if ($("#suggester li").length - $(sel).index() - 1 >= 3) {
                    $(sel).removeAttr("aria-selected").next().next().next().attr("aria-selected", true);
                    if (Math.ceil(((1 + $(sel).index()) / 3)) * $(sel).outerHeight(false) > $("#suggester").height())
                        $("#suggester").scrollTop($("#suggester").scrollTop() + $(sel).outerHeight(false) * 2);
                } else {
                    $(sel).removeAttr("aria-selected");
                    $("#suggester li:first").attr("aria-selected", true);
                    $("#suggester").scrollTop(0);
                }
            } else if ($("#suggester").attr("data-suggester") === "#" || $("#suggester").attr("data-suggester") === "@") {
                if (sel[0] !== $("#suggester li:last")[0])
                    $(sel).removeAttr("aria-selected").next().attr("aria-selected", true);
                else {
                    $(sel).removeAttr("aria-selected");
                    $("#suggester li:first").attr("aria-selected", true);
                }
            }
        } else if (e.keyCode === 39) { // Right
            if (sel[0] !== $("#suggester li:last")[0]) {
                $(sel).removeAttr("aria-selected").next().attr("aria-selected", true);
            } else {
                $(sel).removeAttr("aria-selected");
                $("#suggester li:first").attr("aria-selected", true);
            }
        } else if (e.keyCode === 27) { // Esc
            $("#suggester").css("display", "none");
            $(".input_area").off("keydown");
        }
    };

    if (e.originalEvent.data === "#" || e.originalEvent.data === ":" || e.originalEvent.data === "@") {
        const size = position(),
            height = $(".input_area").height(),
            left = $("#forum .input_area:visible").length ? `calc(${height}px + ${$(this).css("padding-left")} + ${size}px)` : `calc(40vw + ${height}px + ${$(this).css("padding-left")} + ${size}px)`;

        if (e.originalEvent.data === "#") {
            forum_doubts.slice(Math.max(forum_doubts.length - 5, 0)).forEach(doubt => $("#suggester").append(`<li aria-selected="false" data-value="${doubt[1][3]}"><div style="font-size: 12px; color: #ccc">#${doubt[1][3]}</div><div style="display: flex; justify-content: space-between; box-sizing: border-box; align-items: center"><div style="padding: 5px 10px; white-space: nowrap; overflow-x: hidden">${doubt[1][0]}</div><div style="padding: 5px 10px; color: #ccc; font-size: 14px">${doubt[1][2]}</div></div></li>`));
            $("#suggester").html("").removeClass("emoji").show().attr("data-suggester", "#");
        } else if (e.originalEvent.data === ":")
            $("#suggester").html($(".suggester.emoji:not(#suggester)").html()).addClass("emoji").css("display", "grid").attr("data-suggester", ":");
        else if (e.originalEvent.data === "@") {
            let ats = "";

            members.slice(Math.max(members.length - 5, 0)).forEach(member => ats += `<div data-value="@${member.name}" class="menu_icon"><div class="pic"><img src="${member.photo}"></div><div class="info"><div>${member.name}</div><div>${member.status}</div></div></div>`);
            $("#suggester").html(members).show().attr("data-suggester", "@");
        }

        $("#suggester").css({ "bottom": `${height}px`, "left": left });

        $("#suggester li").eq(0).attr("aria-selected", true);
        $(".input_area").on("keydown", navigation);
        $("#suggester li, #suggester .menu_icon").on("click", navigation);
    } else if ($("#suggester:visible").length) {
        if ($("#suggester").attr("data-suggester") === ":") {
            const content = this.value.split("");

            let emoji = new Array(),
                num = this.selectionStart - 1;

            while (content[num] !== " " && content[num] !== undefined) {
                emoji.push(content[num]);
                num--;
            }

            emoji = (emoji.reverse()).join("");
            $("#suggester").html("");
            $(".input_area").off("keydown");
            $("#suggester li, #suggester .menu_icon").off("click");

            if (!emoji || !JSON.stringify(emojies).includes(emoji)) {
                $("#suggester").css("display", "none");
                return;
            }

            for (emote in emojies) {
                if (!emote.includes(emoji))
                    continue;
                let code;
                try {
                    code = String.fromCodePoint(`0x${emojies[emote]}`);
                } catch (e) {
                    continue;
                }
                $("#suggester").append(`<li data-value="${emote}">${code}</li>`)
            }
        } else if ($("#suggester").attr("data-suggester") === "#" || $("#suggester").attr("data-suggester") === "@") {
            const content = this.value.split("");

            let result = new Array()
            num = this.selectionStart - 1;

            while (content[num] !== " " && content[num] !== undefined) {
                result.push(content[num]);
                num--;
            }

            result = (result.reverse()).join("").replace("#", "").replace("@", "");
            $("#suggester").html("");
            $(".input_area").off("keydown");
            $("#suggester li, #suggester .menu_icon").off("click");

            if (!result) {
                $("#suggester").css("display", "none");
                return;
            }

            if ($("#suggester").attr("data-suggester") === "#") {
                for (let doubt of forum_doubts)
                    doubt[1][3].includes(result) || doubt[1][0].includes(result) || doubt[1][2].includes(result) ? $("#suggester").append(`<li data-value="#${doubt[1][3]}"><div style="font-size: 12px; color: #ccc">#${doubt[1][3]}</div><div style="display: flex; justify-content: space-between; box-sizing: border-box; align-items: center"><div style="padding: 5px 10px; white-space: nowrap; overflow-x: hidden">${doubt[1][0]}</div><div style="padding: 5px 10px; color: #ccc; font-size: 14px">${doubt[1][2]}</div></div></li>`) : null;
            } else {
                let res = "";
                for (let member of members)
                    member.name.includes(result) ? res += `<div data-value="@${member.name}" class="menu_icon"><div class="pic"><img src="${member.photo}"></div><div class="info"><div>${member.name}</div><div>${member.status}</div></div></div>` : null;
                $("#suggester").append(res);
            }
        }

        $("#suggester li").eq(0).attr("aria-selected", true);
        $("#suggester li:last").css("border", "none");
        $("#suggester li, #suggester .menu_icon").on("click", navigation);
        $(".input_area").on("keydown", navigation);
    } else {
        $("#suggester").css("display", "none");
        $(".input_area").off("keydown");
        $("#suggester li, #suggester .menu_icon").off("click");
        return;
    }
}