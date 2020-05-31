function MediaModal() {
    let img = this;

    const modal = document.createElement("div"),
        navigation = ({keyCode }) => {
            const media = Array.from($(".message_area video, .message_area img:not([class])")),
                index = $(media).index(img);

            if (keyCode === 13)
                $(modal).remove();
            else if (keyCode === 37) {
                $("div", modal).eq(1).css("background-image", `url(${media[index - 1].src || $(media[index - 1]).attr("data-src")})`);
                img = media[index - 1];
            } else if (keyCode === 39) {
                $("div", modal).eq(1).css("background-image", `url(${media[index + 1].src || $(media[index + 1]).attr("data-src")})`);
                img = media[index + 1];
            }

            check();
        },
        check = () => {
            const media = $(".message_area video, .message_area img:not([class])"),
                btns = $(".media_modal_btns", modal);

            if (media.length === 1)
                $(btns).css("visibility", "hidden");
            else if ($(media).last()[0] === img) {
                $(btns).eq(1).css("visibility", "hidden");
                $(btns).eq(0).css("visibility", "");
            } else if ($(media).first()[0] === img) {
                $(btns).eq(0).css("visibility", "hidden");
                $(btns).eq(1).css("visibility", "");
            } else {
                $(btns).css("visibility", "");
                $(btns).css("visibility", "");
            }
        };

    $(modal).html(`<div class="media_modal_btns"></div><div onclick="$(this.parentElement).remove()" style="flex: 10; background: center no-repeat; background-image: url('${this.src}'); background-size: contain;"></div><div class="media_modal_btns"></div>`).css({ "position": "absolute", "display": "flex", "align-items": "center", "justify-content": "center", "width": "100vw", "height": "100vh", "box-sizing": "border-box", "background-color": "#000000" }).on("keydown", navigation).children().css("height", "85%");
    $(".media_modal_btns", modal).eq(0).on("click", navigation.bind(img, { keyCode: 37 }));
    $(".media_modal_btns", modal).eq(1).on("click", navigation.bind(img, { keyCode: 39 }));
    $(document.body).append(modal);
    check();
}