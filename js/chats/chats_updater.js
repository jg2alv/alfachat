function updateChats() {
	if (!update) {
		return;
	}

	const xml = new XMLHttpRequest(),
		message_area = $('.message_area'),
		t0 = performance.now();

	let chats = document.createElement("div");
	
	xml.open('POST', '../xmlhttprequest/message_receiver.php', true);
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

		response.forEach((message, index) => chats.innerHTML += new Message(message, index).parse());

		switch(true) {
			case $(message_area).css('display') === 'none':
				$(message_area).css('display', 'block');
			

			case message_area[0].children.length !== chats.children.length:
				$(message_area).html(chats.innerHTML);

				$(message_area).off("scroll");
				$(message_area).on('scroll', () => {
					scrollState = false;
				});

				if (!$(".audio").length)
					$(message_area).css('visibility', 'visible');

				$("audio").off("loadedmetadata");
				$("audio").on("loadedmetadata", e => {
					$(e.target).siblings("span").html(`00:00/${convertTime(Math.floor(e.target.duration))}`);
					$(message_area).css('visibility', 'visible');
				});

				$(".audio_btns").off("click");
				$(".audio_btns").on("click", e => {
					const audio = $(e.currentTarget).siblings("audio")[0],
						input = $(e.currentTarget).siblings("input")[0];

					if (audio.paused) {
						$("audio").each((index, audio) => {
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
	if (bytes === 0)
		return '0 bytes';
	const k = 1024,
		sizes = [ 'bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function timeToUpdate(t0) {
	const diff = performance.now() - t0;

	if (diff < UPDATE_TIME) {
		setTimeout(updateChats, UPDATE_TIME - diff);
		return;
	} else {
		updateChats();
		return;
	}
}