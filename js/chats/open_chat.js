let id; // Setting global ID
let scrollState = true;
let update = true;

$(document).ready(() => {
	statusTimer(); // Start timer when window (chats) loads
	statusBackend('i=online&o=set'); // Setting MY status to online
	messageSender();
	chatListUpdater();
	const header_input = document.querySelector(".chat_selector header input[type='text']");
	const chat_result_list = $('.chat_result_list')[0];
	const chat_list = $('.chat_list')[0];
	header_input.value = ''; // Removing input's value
	header_input.addEventListener('keyup', (k) => {
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
				response = JSON.parse(xml.responseText); // Parsing JSON's server response text
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
	const clip = $('.input_area label img')[0]; // Clips img
	clip.addEventListener('mouseover', () => {
		// Change img src
		clip.src = 'assets/icons/file_hover.png';
	});
	clip.addEventListener('mouseout', () => {
		clip.src = 'assets/icons/file.png';
	});
});

function openChat(e) {
	update = false;
	id = e.currentTarget.attributes['data-id'].value; // base64 id value. Example: 1; group:11 (in base64)

	if (id === e.currentTarget.children[1].children[0].getAttribute('data-id') && $('.chats:visible').length) {
		// If user clicked on the same chat, don't reload it.
		return;
	}

	statusBackend(`i=${id}&o=get`, e.currentTarget);
	$('.chats header div div')[0].setAttribute('data-id', id);

	$('.chat').attr('style', 'background: #35215a'); // Removing "selected" background from every other div
	e.currentTarget.style.background = '#291a46'; // Setting background to a darker one, indicating "selected"

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
	$('.choose_chat').remove(); // Removing "choose chat" balloon
	$('.input_area').attr('style', 'display: grid');
	$('.chats header').attr('style', 'display: flex');
	$('.input_area input').focus();
	scrollState = update = true;
	updateChats();

	// $('.chats header img')[1].addEventListener('click', () => {
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
}

function addZero(i) {
	if (i < 10) {
		i = '0' + i;
	}
	return i;
}

function closeChat() {
	$('.chat_selector')[0].style.display = 'block';
	$('.chats')[0].style.display = 'none';
	$('.chats')[0].style.width = '';
	$('.chat').attr('style', 'background: #35215a'); // Removing "selected" background from every other div
}
