$(document).ready(() => $(".chat:visible").on("click", openChat));

function openChat(e, customName = false, customStatus = false) {
	canUpdate.chatsUpdater = false;
	id = $(e.currentTarget).attr("data-id"); // base64 id value. Example: 1; group:11 (in base64)

	if (id === e.currentTarget.children[1].children[0].getAttribute('data-id') && $('.chats:visible').length)
		return;

	statusBackend(`i=${id}&o=get`).then(res => {
		!customName ? $(".chats header div div").eq(0).html(e.currentTarget.children[1].children[0].innerHTML) : $(".chats header div div").eq(0).html("Suporte de " + customName.innerHTML);
		!customStatus ? $(".chats header div div").eq(1).html(res) : $(".chats header div div").eq(1).html(customStatus);
	});

	$('[subject]').attr('style', 'background: #291a46');
	$('.chats header div div')[0].setAttribute('data-id', id);

	$('.chat').attr('style', 'background: #35215a'); // Removing "selected" background from every other div
	e.currentTarget.style.backgroundColor = '#291a46'; // Setting background to a darker one, indicating "selected"

	const chat_result_list = $('.chat_result_list')[0];
	const chat_list = $('.chat_list')[0];
	if (chat_list.attributes['hidden']) {
		const chats = atob(document.querySelector('.chat_list').attributes['data-chats'].value).split(',');
		if (chats.includes(atob(id))) {
			$('.chat_result_list').attr('hidden', ''); // Set hidden attribute
			chat_list.removeAttribute('hidden'); // Removing original list's hidden attribute
			document.querySelector(".chat_selector header input[type='text']").value = '';
			document.querySelector(`.chat_list div[data-id='${e.currentTarget.attributes['data-id'].value}']`).style.background = '#291a46';
		}
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
