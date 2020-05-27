function ContextMenu(e) {
    e.preventDefault();
    $(".context_menu").html("");

    $(e.currentTarget.firstChild).attr("class").includes("mine") ? $(".context_menu").html("<span>Responder</span><span>Editar</span><span>Selecionar</span><span>Copiar</span><span>Deletar</span>") : $(".context_menu").html("<span>Responder</span><span>Selecionar</span><span>Copiar</span>");
    $(".context_menu").css({ "left": $(window).width() - e.originalEvent.clientX > Number($(".context_menu").css("min-width").slice(0, -2)) ? e.originalEvent.x + 5 : $(window).width() - Number($(".context_menu").css("min-width").slice(0, -2)), "top": e.originalEvent.y + 5 }).fadeIn(250).on("mouseout", hideMenu);
    setTimeout(() => $(".context_menu:hover").length ? null : $(".context_menu").fadeOut(), 2500);

    $(".context_menu *").off("mousedown").on("mousedown", function () {
        $(".context_menu").fadeOut();

        if (this.innerHTML === "Selecionar") {
            $(e.currentTarget).css("background-color", "rgba(255, 255, 255, 0.2)");
            $(".message_area").children("div[style*='display: grid;']").css("cursor", "pointer").on("click", ev => {
                $(ev.currentTarget).css("background-color") === "rgba(255, 255, 255, 0.2)" ? $(ev.currentTarget).css("background-color", "") : $(ev.currentTarget).css("background-color", "rgba(255, 255, 255, 0.2)");
                !$(".message_area div[style*='rgba(255, 255, 255, 0.2)']").length ? $(".message_area").children("div[data-message], div[style*='display: grid;']").off("click").css("cursor", "") : null;
            });
        } else if (this.innerHTML === "Copiar") {
            new ClipboardJS(this).on("success", ev => {
                ev.clearSelection();
                new Toast("Texto copiado com sucesso!").show().destroy(2500);
            }).on("error", ev => {
                ev.clearSelection();
                new Toast("Houve um erro ao tentar copiar o texto.", "background-color: #c80003; font-weight: bold").show().destroy(2500);
            });
            $(this).attr("data-clipboard-text", e.currentTarget.firstChild.className === "their" ? e.currentTarget.firstChild.firstChild.children[1].textContent : e.currentTarget.firstChild.firstChild.textContent);
        } else if (this.innerHTML === "Deletar") {

        } else if (this.innerHTML === "Responder") {
            const sender = (() => {
                if (e.currentTarget.firstChild.className === "message mine")
                    return decodeURIComponent(escape(atob(sessionStorage["bmFtZQ=="])));
                else if (id === undefined || atob(id).indexOf("doubt") > -1 || atob(id).indexOf("teacher") > -1)
                    return "Professor(a)";
                else if (atob(id).indexOf("group") === -1)
                    return $(".chat[style*='background-color: rgb(41, 26, 70);'] .info div div").html();
                else
                    return e.currentTarget.firstChild.firstChild.firstChild.innerHTML;
            })()

            const message = (() => {
                if ($("a .pic", e.currentTarget).length)
                    return "<img src='assets/icons/file.png' style='width: 25px; margin: 0 2.5px -2px 2.5px'>Arquivo";
                else if ($(".audio_btns", e.currentTarget).length)
                    return "<img src='assets/icons/audio.png' style='width: 25px; margin: 0 -2.5px'>&Aacute;udio";
                else if ($("img", e.currentTarget).length)
                    return "<img src='assets/icons/camera.png' style='width: 15px; margin-right: 5px'>Foto";
                else if ($("video", e.currentTarget).length)
                    return "<img src='assets/icons/play.png' style='width: 20px; margin: 0 2.5px 0 0'>V&iacute;deo";
                else if (e.currentTarget.firstChild.className === "their")
                    return e.currentTarget.firstChild.firstChild.children[1].textContent;
                else
                    return e.currentTarget.firstChild.firstChild.textContent;
            })()

            $(".message_reply div div").eq(0).html(sender);
            $(".message_reply div div").eq(1).html(message);
            $(".message_reply").css("display", "flex").children("div").off("click").eq(1).on("click", () => {
                Math.abs($(e.currentTarget).offset().top) !== $(e.currentTarget).offset().top || $(e.currentTarget).offset().top < $(e.currentTarget).outerHeight() ? e.currentTarget.scrollIntoView() : null;
                $(e.currentTarget).fadeOut(100).fadeIn(100, function() { $(this).css("background-color", "rgba(255, 255, 255, 0.2)") }).fadeOut(100).fadeIn(100, function() { $(this).css("background-color", "rgba(255, 255, 255, 0.2)"); setTimeout(() => $(this).css("background-color", ""), 100); });
            });
            reply = $(e.currentTarget).data("id");

            $(".message_reply img:last").off("click").on("click", () => {
                reply = 0;

                $(".message_reply").css("display", "");
                $(".message_reply div div").eq(0).html("");
                $(".message_reply div div").eq(1).html("");
            });
        }
    });
}