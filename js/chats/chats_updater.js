function updateChats() {
	if (!update) {
		return;
	}
	const xml = new XMLHttpRequest(),
		message_area = $('.message_area'),
		t0 = performance.now();
	let chats = document.createElement("div");
	xml.open('POST', '../xmlhttprequest/message_reciever.php', true);
	xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xml.send('c=' + id);
	xml.onload = () => {
		let response; // Try/ Catch has an specific scope. Declaring 'response' inside it doesn't work (since I'm using 'response' outside it as well)
		try {
			response = JSON.parse(xml.responseText);
		} catch (e) {
			message_area.html('');
			if (update)
				timeToUpdate(t0);
			return;
		}
		if (!$('.chats:visible').length) {
			// Mobile
			$('.chat_selector')[0].style.display = 'none';
			$('.chats')[0].style.display = 'grid';
			$('.chats')[0].style.width = '100%';
		}
		response.forEach((message) => {
			// ForEach message
			const d = new Date(Number(message.time) * 1000),
				messageTime = `<div class="message_time">${addZero(d.getDate()) + '/' + addZero(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes())}</div>`,
				img = [ 'png', 'jpg', 'jpeg', 'gif', 'jfif' ],
				video = [ 'mp4', 'webm' ],
				audio = [ 'mp3', 'wav', 'ogg' ];
			if (message.sender !== atob(sessionStorage[btoa('id')])) {
				// If user didn't send the message
				if (atob(id).indexOf('group') > -1) {
					// If this chat is a group chat
					if (message.file !== '0') {
						message.file = JSON.parse(message.file);
						if (img.includes(message.file.extension)) {
							chats.innerHTML += `<div style="display: grid"><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${message["name"]}</span><img src="${atob(message.file.location)}">${messageTime}</div><img class="profile_img" src="${message['photo']}"></div></div>`;
						}
						else if (video.includes(message.file.extension)) {
							chats.innerHTML += `<div style="display: grid"><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${message["name"]}</span><video controls="" preload=""><source src="${atob(message.file.location)}" type="video/${message.file.extension}"></video>${messageTime}</div><img class="profile_img" src="${message['photo']}"></div></div>`;
						} else if (audio.includes(message.file.extension)) {
							chats.innerHTML += `<div style="display: grid"><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${message["name"]}</span><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio><source src="${atob(message.file.location)}" type="audio/${message.file.extension}"></audio><span class="audio_time"></span></div>${messageTime}</div><img class="profile_img" src="${message['photo']}"></div></div>`;
						} else {
							chats.innerHTML += `<div style="display: grid"><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${message["name"]}</span><div><a style="display: flex" href="${atob(message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(message.file.size)}</div></div></a></div>${messageTime}</div><img class="profile_img" src="${message['photo']}"></div></div>`;
						}
					} else {
						chats.innerHTML += `<div style="display: grid"><div class="their"><div class="message" style="border-bottom-left-radius: 0;">${'<span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">' + message['name'] + '</span>' + message.content + messageTime}</div><img class="profile_img" src="${message['photo']}"></div></div>`;
					}
				}
				else {
					// If chat isn't a group chat
					if (message.file !== '0') {
						message.file = JSON.parse(message.file);
						if (img.includes(message.file.extension)) {
							chats.innerHTML += `<div style="display: grid"><div class="message their"><img src="${atob(message.file.location)}">${messageTime}</div></div>`;
						}
						else if (video.includes(message.file.extension)) {
							chats.innerHTML += `<div style="display: grid"><div class="message their"><video controls="" preload=""><source src="${atob(message.file.location)}" type="video/${message.file.extension}"></video>${messageTime}</div></div>`;
						} else if (audio.includes(message.file.extension)) {
							chats.innerHTML += `<div style="display: grid"><div class="message their"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio><source src="${atob(message.file.location)}" type="audio/${message.file.extension}"></audio><span class="audio_time"></span></div>${messageTime}</div></div>`;
						} else {
							chats.innerHTML += `<div style="display: grid"><div class="message their"><div><a style="display: flex" href="${atob(message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(message.file.size)}</div></div></a></div> ${messageTime}</div></div>`;
						}
					}
					else {
						chats.innerHTML += `<div style="display: grid"><div class="message their">${message.content + messageTime}</div></div>`;
					}
				}
			}
			else {
				// If user sent the message
				if (message.file !== '0') {
					message.file = JSON.parse(message.file);
					if (img.includes(message.file.extension)) {
						chats.innerHTML += `<div style="display: grid"><div class="message mine" style="margin-left: 0"><img src="${atob(message.file.location)}">${messageTime}</div></div>`;
					}
					else if (video.includes(message.file.extension)) {
						chats.innerHTML += `<div style="display: grid"><div class="message mine" style="margin-left: 0;"><video controls="" preload=""><source src="${atob(message.file.location)}" type="video/${message.file.extension}"></video>${messageTime}</div></div>`;
					} else if (audio.includes(message.file.extension)) {
						chats.innerHTML += `<div style="display: grid"><div class="message mine" style="margin-left: 0;"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio><source src="${atob(message.file.location)}" type="audio/${message.file.extension}"></audio><span class="audio_time"></span></div>${messageTime}</div></div>`;
					} else {
						chats.innerHTML += `<div style="display: grid"><div class="message mine" style="margin-left: 0;"><div><a style="display: flex" href="${atob(message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(message.file.size)}</div></div></a></div> ${messageTime}</div></div>`;
					}
				}
				else {
					chats.innerHTML += `<div style="display: grid"><div class="message mine">${message.content + messageTime}</div></div>`;
				}
			}
		});

		switch(true) {
			case $(message_area).css('display') === 'none':
				$(message_area).css('display', 'block');
			

			case message_area[0].children.length !== chats.children.length:
				$(message_area).html(chats.innerHTML);

				$(message_area).off("scroll");
				$(message_area).on('scroll', () => {
					scrollState = false;
				});

				$(message_area).css('visibility', 'visible');

				$(".audio_btns").off("click");
				$(".audio_btns").on("click", e => {
					const audio = $(e.currentTarget).siblings("audio")[0],
						input = $(e.currentTarget).siblings("input")[0];

					if (audio.paused) {
						Array.from($("audio")).forEach((audio) => {
							audio.pause();
							$(audio).siblings("img")[0].src = "assets/icons/play.png";
						})
						audio.currentTime = Number(input.value)
						audio.play();
						e.currentTarget.src = "assets/icons/pause.png";
					} else {
						audio.pause();
						e.currentTarget.src = "assets/icons/play.png";
					}
				});

				$("audio").off("timeupdate");
				$("audio").on("timeupdate", e => {
					const input = $(e.target).siblings("input[type='range']")[0],
						duration = Math.floor(e.target.duration);

					input.max = e.target.duration;
					input.value = e.target.currentTime;

					$(input).siblings("span").html(`${convertTime(Math.floor(e.target.currentTime))}/${convertTime(duration)}`);

					if (Math.floor(input.value) === duration) {
						e.target.pause();
						$(input).siblings("img")[0].src = "assets/icons/play.png";
						e.target.currentTime = 0;
					}
				});

				$("input[type='range']").off("input");
				$("input[type='range']").on("input", e => {
					const input = e.currentTarget;
					$(input).siblings('audio')[0].currentTime = Number(input.value)
				});
				
			
			case message_area[0].scrollTop === message_area[0].scrollHeight:
				scrollState = true;


			case scrollState:
				message_area[0].scrollTop = message_area[0].scrollHeight
		}

		if (update)
			timeToUpdate(t0);
	};
	return;
}

function convertUnits(bytes) {
	if (bytes === 0) {
		return '0 Bytes';
	}
	const k = 1024,
		sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function timeToUpdate(t0) {
	const t1 = performance.now(),
		diff = t1 - t0;
	if (diff < 200) {
		setTimeout(updateChats, 200 - diff);
		return;
	}
	else {
		updateChats();
		return;
	}
}
