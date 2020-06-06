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

		$('.choose_chat').css("display", "none"); // Removing "choose chat" balloon
		$(".chats").css("grid-template-rows", "1fr 9fr");
		$('.input_area').css('display', 'flex');
		$('.chats header').css('display', 'flex');
		$('.input_area textarea').focus();
		$(".message_area").html("");

		if (atob(id).indexOf("teacher") === -1) {
			canScroll = canUpdate.chatsUpdater = true;
			$('.chats header img').attr("src", "assets/icons/advanced.png").removeAttr("title").off("click").on('click', () => $("#chats_header_drop_down").html("<span>Desabilitar notifica&ccedil;&otilde;es</span>").css("display", "block").off("mouseout").on("mouseout", hideMenu).append(atob(id).indexOf("group") > -1 ? "<span>Sair do grupo</span>" : "<span>Remover chat</span>").children().on("click", ({ currentTarget }) => {
				const xml = new XMLHttpRequest();
				//modal = new Modal();

				if (currentTarget.innerHTML === "Remover chat" || currentTarget.innerHTML === "Sair do grupo") {
					if (atob(id) === `group:${atob(sessionStorage["Y2xhc3M="])}`) {
						new Toast("Voc&ecirc; n&atilde;o pode sair do grupo da turma!", "background-color: #c80003;").show().destroy(2500);
						hideMenu({ relatedTarget: currentTarget.parentElement }, true)
						return;
					}
					
					// modal
					xml.open("../server/remove_chat.php");
					xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					xml.send(`chat=${id}`);
					xml.onload = chatListUpdater.bind(window, true);
				}
			}));
		} else {
			$('.chats header img').attr("src", "assets/icons/check.png").attr("title", "Começar atendimento");
			$('.chats header img').on("click", sendDoubts);
		}

		id === undefined || atob(id).indexOf("teacher") > -1 ? resolve() : await chatsUpdater(50).then(resolve);
	});
}