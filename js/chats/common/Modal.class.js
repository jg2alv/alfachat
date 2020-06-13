class Modal {
    constructor(innerHTML, style, ...btns) {
        this.modal = document.createElement("div");
        $(this.modal).addClass("modal").html(`<div class="modal_container">${innerHTML}</div>`).attr("style", style || "");

        btns.length ? $(this.modal).append("<footer class='modal_btns'></footer>") : null;
        btns.forEach((btn, index) => $("footer", this.modal).append(`<div>${btn[0]}</div>`).children().eq(index).on("click", btn[1] || this.destroy));

        document.body.append(this.modal);

        return this;
    }

    show() {
        $(".side_menu_bg").on("click", this.destroy);
        hideSideMenu().then(() => {
            $(this.modal).css("display", "flex");
            $(".side_menu").css("display", "flex").children(".side_menu_visible").css("display", "none");
        });

        return this;
    }

    destroy() {
        $(".side_menu_bg").css("z-index", "");
        $(this.modal).hide()
        $(this.modal).remove();
        hideSideMenu();

        return this;
    }

    update(append, innerHTML = false, ...btns) {
        append ? innerHTML ? $(".modal_container", this.modal).append(innerHTML) : btns.forEach((btn, index) => $("footer", this.modal).children().eq(index).append(btn)) : innerHTML ? $(".modal_container", this.modal).html(innerHTML) : btns.forEach((btn, index) => $("footer", this.modal).children().eq(index).html(btn));

        return this;
    }

    setCallback(...callbacks) {
        callbacks.forEach((callback, index) => $("footer", this.modal).children().eq(index).off("click").on("click", callback));

        return this;
    }
}