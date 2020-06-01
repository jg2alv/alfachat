function chatsUpdater(limit, force = false) {
	if (id === undefined || atob(id).indexOf("teacher") > -1 || !canUpdate.chatsUpdater) return;
	if (limit === 0) limit = $(".message_area").children().length || 50;

	const xml = new XMLHttpRequest(),
		message_area = $('.message_area')[0],
		t0 = performance.now(),
		chats = document.createElement("div");

	xml.open('POST', '../server/message_receiver.php', true);
	xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xml.send(`id=${id}&limit=${limit}`);
	xml.onload = () => {
		const response = xml.responseText ? JSON.parse(xml.responseText) : [],
			observerOptions = { root: $(".message_area:visible")[0], rootMargin: "500%" },
			observer = new IntersectionObserver(entries => entries.forEach(entry => !entry.isIntersecting ? $(entry.target).attr("data-src", $(entry.target).attr("src")).removeAttr("src") : $(entry.target).attr("src", $(entry.target).attr("data-src")).removeAttr("data-src")), observerOptions),
			prepareMedia = element => {
				$("[data-src]", element).each(function () { observer.observe(this); }).off("click").on("click", MediaModal);

				$("audio", element).off("loadmetadata").on("loadmetadata", e => $(e.target).siblings("span").html(`00:00/${convertTime(Math.floor(e.target.duration))}`)).off("timeupdate").on("timeupdate", e => {
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
				}).each(function () {
					this.volume = 0;
					this.play();
					setTimeout(() => {
						this.pause();
						this.volume = 1.0;
						this.currentTime = 0;
					}, 500);
				});

				$(".audio_btns", element).off("click").on("click", e => {
					const audio = $(e.currentTarget).siblings("audio")[0],
						input = $(e.currentTarget).siblings("input")[0];

					if (audio.paused) {
						$("audio").each(function () {
							this.pause();
							$(this).siblings("img")[0].src = "assets/icons/play.png";
						});
						audio.currentTime = Number(input.value)
						audio.play();
						e.currentTarget.src = "assets/icons/pause.png";
					} else {
						audio.pause();
						e.currentTarget.src = "assets/icons/play.png";
					}
				});

				$("input[type='range']", element).off("input").on("input", e => $(e.currentTarget).siblings('audio')[0].currentTime = Number(e.currentTarget.value));
				$(".reply", element).off("click").on("click", e => scrollToMessage($(`.message_area div[data-id='${$(e.currentTarget).attr("data-reply")}']`)[0]));
				$(element).children().off("contextmenu").on("contextmenu", ContextMenu);
			};

		new Promise(resolve => {
			response.forEach(async message => {
				const msg = await new Message(message).parse();
				chats.innerHTML += msg;
				message === response[response.length - 1] ? resolve() : null;
			});
		}).then(() => {
			$(".message_area").css("display", "block");

			if (message_area.children.length === 0 || force) {
				const messageObserver = new IntersectionObserver((entries, observer) => {
					entries.forEach(entry => {
						if (!entry.isIntersecting)
							return;

						observer.unobserve(entry.target);
						chatsUpdater(limit + 50);
					});
				}, observerOptions);
				messageObserver.observe(chats.firstChild);

				$(message_area).off("scroll").on("scroll", () => canScroll = false).html(chats.innerHTML);
				prepareMedia(message_area);
				message_area.scrollTop = message_area.scrollHeight - message_area.clientHeight;
			} else if (message_area.children.length < chats.children.length) {
				const new_messages = $($(chats).children()).not($(message_area).children()).get();
				prepareMedia(new_messages);
				$(message_area).append(new_messages);
			}

			if (message_area.scrollHeight - message_area.clientHeight <= message_area.scrollTop + 1)
				canScroll = true;

			if (canScroll)
				message_area.scrollTop = message_area.scrollHeight - message_area.clientHeight;

			update(t0, "chatsUpdater", limit);
		});
	}
}