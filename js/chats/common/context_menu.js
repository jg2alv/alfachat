function ContextMenu(e) {
    e.preventDefault();
    $(".context_menu").html("");

    $(e.currentTarget).attr("class").includes("mine") ? $(".context_menu").html("<span>Responder</span><span>Editar</span><span>Selecionar</span><span>Copiar</span><span>Deletar</span>") : $(".context_menu").html("<span>Responder</span><span>Selecionar</span><span>Copiar</span>");
    $(".context_menu").css({ "left": $(window).width() - e.originalEvent.clientX > Number($(".context_menu").css("min-width").slice(0, -2)) ? e.originalEvent.x + 5 : $(window).width() - Number($(".context_menu").css("min-width").slice(0, -2)), "top": e.originalEvent.y + 5 }).fadeIn(250).on("mouseout", hideMenu);
    setTimeout(() => $(".context_menu").is(":hover") ? null : $(".context_menu").fadeOut(), 2500);

    $(".context_menu *").off("mousedown").on("mousedown", function () {
        $(".context_menu").fadeOut();

        if (this.innerHTML === "Selecionar") {
            $(e.currentTarget.parentElement).css("background-color", "rgba(255, 255, 255, 0.2)");
            $(".message_area").children("div[data-message], div[style*='display: grid;']").on("click", ev => {
                $(ev.currentTarget).css("background-color") === "rgba(255, 255, 255, 0.2)" ? $(ev.currentTarget).css("background-color", "") : $(ev.currentTarget).css("background-color", "rgba(255, 255, 255, 0.2)");
                !$(".message_area div[style*='rgba(255, 255, 255, 0.2)']").length ? $(".message_area").children("div[data-message], div[style*='display: grid;']").off("click") : null;
            });
        } else if (this.innerHTML === "Copiar") {
            new ClipboardJS(this).on("success", ev => {
                ev.clearSelection();
                new Toast("Texto copiado com sucesso!").show().destroy(2500);
            }).on("error", ev => {
                ev.clearSelection();
                new Toast("Houve um erro ao tentar copiar o texto.", "background-color: #c80003; font-weight: bold").show().destroy(2500);
            });
            $(this).attr("data-clipboard-text", e.currentTarget.className === "their" ? e.currentTarget.firstChild.children[1].textContent : e.currentTarget.firstChild.textContent);
        } else if (this.innerHTML === "Deletar") {

        }
    });
}