class Modal {
    constructor(innerHTML, style, ...btns) {
        this.modal = document.createElement("div");
        $(this.modal).addClass("modal").html(`<div class="modal_container">${innerHTML}</div>`).attr("style", style || "");
        
        !btns ? $(this.modal).append("<footer class='modal_btns'></footer>") : null;
        btns.forEach((btn, index) => $("footer", this.modal).append(`<div>${btn[0]}</div>`).children().eq(index).on("click", btn[1] || this.destroy));

        return this;
    }

    show() {
        document.body.append(this.modal);
        $(this.modal).css("display", "flex");
        $(".side_menu").css("display", "flex").off("click").on("click", hideSideMenu).children(".side_menu_visible").css("display", "none");

        return this;
    }

    destroy(remove = true) {
        $(this.modal).hide()
        remove ? $(this.modal).remove() : null;
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