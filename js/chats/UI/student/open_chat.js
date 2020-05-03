$(document).ready(() => {
	statusTimer(); // Start timer when window (chats) loads
	statusBackend('i=online&o=set'); // Setting MY status to online
	messageSender();
	chatListUpdater();
	
	const header_input = document.querySelector(".chat_selector header input[type='text']"),
		chat_result_list = $('.chat_result_list')[0],
		chat_list = $('.chat_list')[0];
		
	header_input.value = ''; // Removing input's value
	header_input.addEventListener('keyup', k => {
		// When user press any key, the result list will appear
		if (!header_input.value || (header_input.value.length === 1 && k.keyCode === 78) || header_input.value === ' ') {
			// If the header has no value OR (it's length is 1 AND user key is backspace) OR is the value is a spacebar
			chat_result_list.setAttribute('hidden', ''); // Set hidden attribute
			chat_list.removeAttribute('hidden'); // Removing original list's hidden attribute
			return; // Stopping the function
		}
		const xml = new XMLHttpRequest();
		xml.open('POST', '../xmlhttprequest/chat_search.php', true);
		xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xml.send(`q=${header_input.value}`); // XML content is user input
		xml.onload = () => {
			chat_result_list.innerHTML = ''; // Removing list's HTML to avoid duplicate results
			chat_result_list.removeAttribute('hidden'); // Removing just to be sure
			if (xml.responseText) {
				// If there's a valid response text
				const response = JSON.parse(xml.responseText); // Parsing JSON's server response text
				response.forEach(user => {
					user['bio'] = !isNaN(header_input.value) ? user['ra'] : user['bio'];
					addChat(user, chat_result_list);
				});
			}
			else {
				chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
			}
			$(chat_list).attr('hidden', ''); // Setting original list hidden attr
		};
	});

	$(".chat:visible").on("click", openChat);
});

function openChat(e, customName = false, customStatus = false) {
	canUpdate = false;
	id = $(e.currentTarget).attr("data-id"); // base64 id value. Example: 1; group:11 (in base64)

	if (id === e.currentTarget.children[1].children[0].getAttribute('data-id') && $('.chats:visible').length)
		return;

	statusBackend(`i=${id}&o=get`).then(res => {
		if (!customName)
			$(".chats header div div").eq(0).html(e.currentTarget.children[1].children[0].innerHTML);
		else
			$(".chats header div div").eq(0).html("Suporte de " + customName.innerHTML);

		if (!customStatus)
			$(".chats header div div").eq(1).html(res);
		else
			$(".chats header div div").eq(1).html(customStatus);
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
			chat_result_list.setAttribute('hidden', ''); // Set hidden attribute
			chat_list.removeAttribute('hidden'); // Removing original list's hidden attribute
			document.querySelector(".chat_selector header input[type='text']").value = '';
			document.querySelector(`.chat_list div[data-id='${e.currentTarget.attributes['data-id'].value}']`).style.background = '#291a46';
		}
	}
	$('.choose_chat').css("display", "none"); // Removing "choose chat" balloon
	$('.input_area').css('display', 'flex');
	$('.chats header').css('display', 'flex');
	$('.input_area input').focus();
	canScroll = canUpdate = true;
	chatsUpdater(100);

	if (atob(id).indexOf("teacher") === -1) {
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
}

function addZero(i) {
	if (i < 10) {
		i = '0' + i;
	}
	return i;
}
