class Toast {
    constructor(txt, style = false) {
        this.toast = document.createElement("div");

        this.toast.classList.add("toast");
        this.toast.setAttribute("style", style || "");

        this.toast.innerHTML = txt;

        return this;
    }

    show() {
        document.body.append(this.toast);
        $(this.toast).slideDown();
        return this;
    }

    destroy(ms = false) {
        setTimeout(() => $(this.toast).slideUp(400, () => $(this.toast).remove()), ms || 1);
    }

    update(txt, style = false) {
        $(this.toast).html(txt);
        this.toast.setAttribute("style", style || "");

        return this;
    }
}