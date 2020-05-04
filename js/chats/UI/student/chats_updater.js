function chatsUpdater(limit) {
	if (!canUpdate)
		return;

	const xml = new XMLHttpRequest(),
		message_area = $('.message_area'),
		t0 = performance.now(),
		chats = document.createElement("div");

	xml.open('POST', '../xmlhttprequest/message_receiver.php', true);
	xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xml.send(`id=${id}&limit=${limit}`);
	xml.onload = () => {
		let response; // Try/ Catch has an specific scope. Declaring 'response' inside it doesn't work (since I'm using 'response' outside it as well)
		try {
			response = JSON.parse(xml.responseText);
		} catch (e) {
			if (!(message_area[0].children.length > chats.children.length && atob(id).indexOf("teacher") > -1))
				message_area.html('');
				
			if (canUpdate)
				update(t0, "chatsUpdater", limit);
			return;
		}
		
		response.forEach((message, index) => chats.innerHTML += new Message(message, index).parse());

		switch (true) {
			case $(message_area).css('display') === 'none':
				$(message_area).css('display', 'block');


			case message_area[0].children.length !== chats.children.length:
				if (message_area[0].children.length > chats.children.length && atob(id).indexOf("teacher") > -1) {
					update(t0, "chatsUpdater", limit);
					return;
				}

				$(message_area).html(chats.innerHTML);
				$(document).remove(chats);

				$(message_area).off("scroll");
				$(message_area).on('scroll', () => canScroll = false);

				if (!$(".message_area audio").length)
					$(message_area).css('visibility', 'visible');

				$("audio").reverse().off("loadedmetadata");
				$("audio").reverse().on("loadedmetadata", e => {
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
						$(input).siblings("img").attr("src", "assets/icons/play.png");
						e.target.currentTime = 0;
					}
				});

				$("input[type='range']").off("input");
				$("input[type='range']").on("input", e => $(e.currentTarget).siblings('audio')[0].currentTime = Number(e.currentTarget.value));

				const observerOptions = { root: $(".message_area")[0], rootMargin: "100%" }; // Global options for both Intersection Observers

				const mediaObserver = new IntersectionObserver(entries => { // Observer to lazy-load images/ videos
					entries.forEach(entry => {
						if (entry.target instanceof HTMLVideoElement) {
							if (!entry.isIntersecting) {
								$(entry.target.firstChild).attr("data-src", $(entry.target.firstChild).attr("src"));
								$(entry.target.firstChild).removeAttr("src");
							} else {
								$(entry.target.firstChild).attr("src", $(entry.target.firstChild).attr("data-src"));
								$(entry.target.firstChild).removeAttr("data-src");
								entry.target.load();
							}
							return;
						} else {
							if (!entry.isIntersecting) {
								$(entry.target).attr("data-src", $(entry.target).attr("src"));
								$(entry.target).removeAttr("src");
							} else {
								$(entry.target).attr("src", $(entry.target).attr("data-src"));
								$(entry.target).removeAttr("data-src");
							}
						}
					})
				}, observerOptions); // Getting global options

				const messageObserver = new IntersectionObserver((entries, observer) => { // Observer to lazy-load messages
					entries.forEach(entry => {
						if (!entry.isIntersecting)
							return;

						observer.unobserve(entry.target);

						//chatsUpdater(limit + 100);
						return;
					});
				}, observerOptions); // Getting global options

				$("[data-src]").each((index, item) => { // For every image with data-src attr (images to be lazy loaded)
					if (item instanceof HTMLSourceElement)
						mediaObserver.observe(item.parentElement);
					else
						mediaObserver.observe(item)
				});

				messageObserver.observe($("[data-message=0]").get(0)); // Observe the first message


			case message_area[0].scrollHeight - message_area[0].clientHeight <= message_area[0].scrollTop + 1:
				canScroll = true;


			case canScroll:
				message_area[0].scrollTop = message_area[0].scrollHeight - message_area[0].clientHeight;
		}

		if (canUpdate)
			update(t0, "chatsUpdater", limit);
	};
	return;
}

function update(t0, callback, limit = false) {
	const diff = performance.now() - t0;

	if (diff < UPDATE_TIME)
		setTimeout(() => limit ? window[callback](limit) : window[callback](), UPDATE_TIME - diff);
	else
		limit ? window[callback](limit) : window[callback]();

	return;
}