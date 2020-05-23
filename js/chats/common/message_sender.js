function messageSender() {
    const form = $(".input_area")[0],
        input = $(".input_area textarea")[0],
        btn = $(".input_area img"),
        file = $(".input_area input[type='file']")[0];

    $(".input_area img").eq(0).on("click", () => $(file).click());

    file.onchange = e => new Message({ sender: JSON.stringify({ id: atob(sessionStorage["aWQ="]) }), seen: 0, photo: sessionStorage["cGhvdG8="], receiver: atob(id), content: input.value, time: (new Date() / 1000) }).sendFile(e);

    form.onsubmit = e => new Message({ sender: JSON.stringify({ id: atob(sessionStorage["aWQ="]) }), seen: 0, photo: sessionStorage["cGhvdG8="], receiver: atob(id), content: input.value, time: (new Date() / 1000), file: 0 }).sendMessage(e);

    input.oninput = input.onkeypress = k => {
        if (k.charCode === 13 && k.ctrlKey)
            new Message({ sender: JSON.stringify({ id: atob(sessionStorage["aWQ="]) }), seen: 0, photo: sessionStorage["cGhvdG8="], receiver: atob(id), content: input.value, time: (new Date() / 1000), file: 0 }).sendMessage(k);

        if (!input.value || input.value === " ") {
            btn[2].src = "assets/icons/audio.png";
            return;
        } else {
            btn[2].src = "assets/icons/send.png";
        }
    };

    btn[2].onclick = e => {
        if (btn[2].src.indexOf("assets/icons/send.png") > -1)
            new Message({ sender: JSON.stringify({ id: atob(sessionStorage["aWQ="]) }), seen: 0, photo: sessionStorage["cGhvdG8="], receiver: atob(id), content: input.value, time: (new Date() / 1000), file: 0 }).sendMessage(e);
        else if (btn[2].src.indexOf("assets/icons/audio.png") > -1) {
            if (navigator.mediaDevices) {
                let chunks = [],
                    mediaStream,
                    time = 0;

                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                    const countdown = $(".input_area span");
                    countdown.removeAttr("hidden");
                    countdown.css("line-height", `${$(form).height()}px`);

                    $(".input_area div").removeAttr("hidden");
                    $(btn).attr("hidden", "");
                    const countdownTime = setInterval(() => {
                        time++;

                        countdown.html(convertTime(time));
                    }, 1000);

                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start(1);
                    mediaStream = stream.getTracks()[0];

                    mediaRecorder.ondataavailable = e => {
                        chunks.push(e.data);
                    };

                    mediaRecorder.onstop = () => {
                        setTimeout(() => mediaStream.stop(), 1000);

                        $(".input_area div").attr("hidden", "");
                        $(btn).removeAttr("hidden");
                        countdown.attr("hidden", "");

                        countdown.html("00:00");

                        clearInterval(countdownTime);
                    }

                    $(".input_area div")[0].onclick = e => {
                        mediaRecorder.stop();

                        setTimeout(() => {
                            const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
                            new Message().sendFile(e, blob);
                        }, 1000);
                    };

                    $(".input_area div")[1].onclick = () => mediaRecorder.stop();
                });
            }
        }
    };

    btn[1].onclick = () => {
        $(".suggester.emoji:not(#suggester)").css({ "display": "grid", "bottom": `${$(".input_area").height()}px` }).on("mouseout", hideMenu);
    }

    $(".suggester.emoji:not(#suggester) li").on("click", function () {
        const before = input.value.slice(0, input.selectionStart);
        let emoji = $(this).attr("data-value");
        const after = input.value.slice(input.selectionStart);

        if (before && before.slice(-1) !== " ")
            emoji = ` ${emoji}`

        if (after && after[0] !== " ")
            emoji = `${emoji} `

        input.value = before + emoji + after;
    });
}