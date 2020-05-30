function ContextMenu(e) {
    e.preventDefault();
    $(".context_menu").html("");

    $("audio, video, img, a[download]", e.currentTarget).length ? $(".context_menu").html("<span>Responder</span><span>Selecionar</span>") : $(e.currentTarget.firstChild).attr("class").includes("mine") && !$("#forum main .message_area").length ? $(".context_menu").html("<span>Responder</span><span>Editar</span><span>Selecionar</span><span>Copiar</span><span>Deletar</span>") : $(".context_menu").html("<span>Responder</span><span>Selecionar</span><span>Copiar</span>");

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
            if (atob(id).indexOf("teacher") === -1) {
                const xml = new XMLHttpRequest();
                xml.open("POST", "../server/delete_message.php", true);
                xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xml.send(`m=${atob($(e.currentTarget).attr("data-id"))}`);
                xml.onload = () => new Toast("Mensagem deletada com sucesso!").show().destroy(2500);
            } else {
                const doubt_list = new FormData();
                let count = 0;
                doubts.forEach(doubt => {
                    count != atob($(e.currentTarget).attr("data-id")) ? doubt_list.append("messages[]", doubt) : null;
                    count++;
                });
                doubts = doubt_list;
            }
            $(e.currentTarget).remove();
        } else if (this.innerHTML === "Responder" || this.innerHTML === "Editar") {
            const modal = new Object();
            modal.content = (() => {
                if ($("a .pic", e.currentTarget).length)
                    return "<img src='assets/icons/file.png' style='width: 25px; margin: 0 2.5px -2px -5px'>Arquivo";
                else if ($(".audio_btns", e.currentTarget).length)
                    return "<img src='assets/icons/audio.png' style='width: 25px; margin: 0 -2.5px'>&Aacute;udio";
                else if ($("img", e.currentTarget).length)
                    return "<img src='assets/icons/camera.png' style='width: 15px; margin-right: 5px'>Foto";
                else if ($("video", e.currentTarget).length)
                    return "<img src='assets/icons/play.png' style='width: 20px; margin: 0 2.5px 0 0'>V&iacute;deo";
                else if (e.currentTarget.firstChild.className === "their")
                    return e.currentTarget.firstChild.firstChild.children[1].textContent;
                else if (e.currentTarget.firstChild.firstChild.className === "reply")
                    return e.currentTarget.firstChild.children[1].innerHTML;
                else
                    return e.currentTarget.firstChild.firstChild.textContent;
            })();

            $(".message_modal").css("display", "flex").children("div").off("click").eq(1).on("click", scrollToMessage.bind(window, e.currentTarget));
            $(".message_modal img:last").off("click").on("click", () => {
                this.innerHTML === "Responder" ? reply = 0 : edit = 0;
                $(".message_modal").css("display", "");
            });

            if (this.innerHTML === "Responder") {
                reply = modal;

                reply.sender = (() => {
                    if (e.currentTarget.firstChild.className === "message mine")
                        return decodeURIComponent(escape(atob(sessionStorage["bmFtZQ=="])));
                    else if (id === undefined || atob(id).indexOf("doubt") > -1 || atob(id).indexOf("teacher") > -1)
                        return "Professor(a)";
                    else if (atob(id).indexOf("group") === -1)
                        return $(".chat[style*='background-color: rgb(41, 26, 70);'] .info div div").html();
                    else
                        return e.currentTarget.firstChild.firstChild.firstChild.innerHTML;
                })()

                $(".message_modal div div").eq(0).html(reply.sender);
                $(".message_modal div div").eq(1).html(reply.content);
                reply.id = atob($(e.currentTarget).attr("data-id"));
            } else {
                modal.sender = decodeURIComponent(escape(atob(sessionStorage["bmFtZQ=="])));
                modal.id = atob($(e.currentTarget).attr("data-id"));
                $(".message_modal div div").eq(0).html(modal.sender);
                $(".message_modal div div").eq(1).html(modal.content);
                edit = modal;
                $(".input_area textarea").val(edit.content);
            }
        }
    });
}