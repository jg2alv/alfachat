$(document).ready(() => $(".chat:visible").on("click", openChat));

function openChat({ currentTarget }, customName = false, customStatus = false) {
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
		$('.chats header img').attr("src", "assets/icons/advanced.png").removeAttr("title");
		$('.chats header img').off("click");
		// $('.chats header img').on('click', () => {
		// 	if ($('#settings_menu_header_drop_down_2').css('display') === 'block') {
		// 		$('#settings_menu_header_drop_down_2').fadeOut(200);
		// 	}
		// 	else {
		// 		$('#settings_menu_header_drop_down_2').fadeIn(200, () => {
		// 			setTimeout(() => {
		// 				$('.chats header').click(() => {
		// 					$('.chats header').off('click');
		// 					$('#settings_menu_header_drop_down_2').fadeOut(200);
		// 				});
		// 			}, 50);
		// 		});
		// 	}
		// });
	} else {
		$('.chats header img').attr("src", "assets/icons/check.png").attr("title", "Começar atendimento");
		$('.chats header img').on("click", sendDoubts);
	}

	chatsUpdater(50);
}
