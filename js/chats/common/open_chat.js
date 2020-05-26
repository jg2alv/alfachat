$(document).ready(() => $(".chat:visible").on("click", openChat));

function openChat(e, customName = false, customStatus = false) {
	statusTimer();
	canUpdate.chatsUpdater = false;

	if (id === $(e.currentTarget).data("id")) return;

	id = $(e.currentTarget).data("id"); // base64 id value. Example: 1; group:11 (in base64)
	statusBackend(`i=${id}&o=get`).then(res => {
		customName === false ? $(".chats header div div").eq(0).html(e.currentTarget.children[1].children[0].children[0].innerHTML) : $(".chats header div div").eq(0).html("Suporte de " + customName.innerHTML);
		customStatus === false ? $(".chats header div div").eq(1).html(res) : $(".chats header div div").eq(1).html(customStatus);
	});

	$('[subject]').attr('style', 'background: #291a46');
	$('.chats header div div').eq(0).data("id", id);

	$('.chat').css('background-color: #35215a'); // Removing "selected" background from every other div
	$(e.currentTarget).css("background-color", '#291a46'); // Setting background to a darker one, indicating "selected"

	if ($('.chat_list').attr("hidden")) {
		$(".chat").each(function() {
			if ($(this).data("id") === id) {
				$('.chat_result_list').attr('hidden', ''); // Set hidden attribute
				$('.chat_list').removeAttr('hidden'); // Removing original list's hidden attribute
				$(".chat_selector header input[type='text']").val("");
				$(`.chat_list .chat:contains(${this.textContent})`).css("background-color", "#291a46");
				$(this).css("background-color", "#291a46");
				return false;
			}
		});
	}

	$('.choose_chat').css("display", "none"); // Removing "choose chat" balloon
	$(".chats").css("grid-template-rows", "1fr 9fr");
	$('.input_area').css('display', 'flex');
	$('.chats header').css('display', 'flex');
	$('.input_area textarea').focus();

	if (atob(id).indexOf("teacher") === -1) {
		canScroll = canUpdate.chatsUpdater = true;
		chatsUpdater(100);
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
		$(".message_area").html("");
	}
}
