$(document).ready(() => $(".chat:visible").on("click", openChat));

function openChat({ currentTarget }, customName = false, customStatus = false) {
	return new Promise(async resolve => {
		$('.chats header').attr("data-id", id);
		$('.chat').removeAttr("aria-selected");
		$(currentTarget).attr("aria-selected", true);

		if (id === $(currentTarget).attr("data-id")) return;

		canUpdate.chatsUpdater = false;

		id = $(currentTarget).attr("data-id"); // base64 id value. Example: 1; group:11 (in base64)
		statusBackend(`i=${id}&o=get`).then(res => {
			customName === false ? $(".chats header div div").eq(0).html(currentTarget.children[1].children[0].children[0].innerHTML) : $(".chats header div div").eq(0).html("Suporte de " + customName.innerHTML);
			customStatus === false ? $(".chats header div div").eq(1).html(res) : $(".chats header div div").eq(1).html(customStatus);
		});

		if ($('.chat_list').attr("hidden")) {
			$(".chat_list").removeAttr("hidden");
			$(".chat_result_list").attr("hidden", "");
			$(`.chat_list .chat[data-id='${id}']`).attr("aria-selected", true);
		}

		const deleteChat = () => {
			const xml = new XMLHttpRequest();

			xml.open("POST", "../server/remove_chat.php", true);
			xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xml.send(`chat=${id}`);
			xml.onload = chatListUpdater.bind(window, true);
			modal.destroy();
		};

		$('.choose_chat').css("display", "none"); // Removing "choose chat" balloon
		$(".chats").css("grid-template-rows", "1fr 9fr");
		$('.input_area').css('display', 'flex');
		$('.chats header').css('display', 'flex').off("click").on("click", () => {
			if (atob(id).indexOf("group") > -1) {
				const members = $(".chat[aria-selected='true']").data("members"),
					modal = new Modal("", "width: 30vw; height: 90vh");

				$(modal.modal).prepend(`<header style='display: flex; flex-direction: column; padding: 15px 0'><div style='display: flex;'><div class='modal_header_title' style='flex: 4'>Informações sobre o grupo:</div><div class='settings_header_btns'><img src='assets/icons/advanced.png'><div id='settings_menu_header_drop_down' class='drop_down' style='right: 50px'></div><img onclick='hideSideMenu()' src='assets/icons/x.png' style='width: 18%; margin-bottom: 3.5px'></div></div><div class='user_area'><div class='pic'><img src='${$(".chat[aria-selected='true'] .pic img")[0].src}'></div><div class='info'><div style='font-weight: bold;'>${$(".chats header div div").eq(0).html()}</div><div style='font-size: 16px; color: #cccccc'>${$(".chats header div div").eq(1).html()}</div></div></div></header><main style="display: flex; flex-direction: column"><div class="menu_icon"><div class="pic"><img></div><div class="info">${media.photos || 0} fotos</div></div><div class="menu_icon"><div class="pic"><img></div><div class="info">${media.videos || 0} v&iacute;deos</div></div><div class="menu_icon"><div class="pic"><img></div><div class="info">${media.links || 0} links</div></div><div class="menu_icon"><div class="pic"><img></div><div class="info">${media.files || 0} arquivos</div></div><div class="menu_icon"><div class="pic"><img></div><div class="info">${media.audios || 0} &aacute;udios</div></div></main>`).css("flex-direction", "column");
				let member_list = "";
				for (let member of members)
					member_list += `<div class="menu_icon" style="display: flex; padding: 15px"><div class="pic"><img src="${member.photo}"></div><div class="info"><div>${member.name}</div><div>${member.status}</div></div></div>`;

				$(".modal_container", modal.modal).addClass("member_list");
				modal.update(true, member_list).show();
			} else {

			}
		});
		$('.input_area textarea').focus();
		$(".message_area").html("");

		if (atob(id).indexOf("teacher") === -1) {
			canScroll = canUpdate.chatsUpdater = true;
			$('.chats header img').attr("src", "assets/icons/advanced.png").removeAttr("title").off("click").on('click', () => $("#chats_header_drop_down").html("<span>Desabilitar notifica&ccedil;&otilde;es</span>").css("display", "block").off("mouseout").on("mouseout", hideMenu).append(atob(id).indexOf("group") > -1 ? "<span>Sair do grupo</span>" : "<span>Remover chat</span>").children().on("click", ({ currentTarget }) => {
				if (currentTarget.innerHTML === "Remover chat" || currentTarget.innerHTML === "Sair do grupo") {
					if (atob(id) === `group:${atob(sessionStorage["Y2xhc3M="])}`) {
						new Toast("Voc&ecirc; n&atilde;o pode sair do grupo da turma!", "background-color: #c80003;").show().destroy(2500);
						hideMenu({ relatedTarget: currentTarget.parentElement }, true);
						return;
					}

					const modal = new Modal("Tem certeza que deseja deletar este chat?<br>Esta a&ccedil;&atilde;o pode ser desfeita.", "width: 17vw; height: 20vh", ["CANCELAR"], ["DELETAR", deleteChat]);
					$(modal.modal).css("flex-direction", "column").children(".modal_container").css({"flex": 4, "display": "flex", "text-align": "center", "justify-content": "center", "align-items": "center"});
					hideMenu({ relatedTarget: currentTarget.parentElement }, true);
					modal.show();
				}
			}));
		} else {
			$('.chats header img').attr("src", "assets/icons/check.png").attr("title", "Começar atendimento");
			$('.chats header img').on("click", sendDoubts);
		}

		id === undefined || atob(id).indexOf("teacher") > -1 ? resolve() : await chatsUpdater(50).then(resolve);
	});
}