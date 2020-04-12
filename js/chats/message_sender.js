function messageSender() {
    const form = $(".input_area")[0],
        input = $(".input_area input[type='text']")[0],
        btn = $(".input_area img")[1],
        file = $(".input_area input[type='file']")[0];
    
    $(".input_area img").eq(0).on("click", () => $(file).click());

    file.addEventListener("change", sendFile);

    form.addEventListener("submit", sendMessage);

    input.addEventListener("keydown", k => {
        if (input.value.length > 2 && k.keyCode === 8) {
            btn.src = "assets/icons/audio.png";
            return;
        } else {
            btn.src = "assets/icons/send.png";
        }
        
        setTimeout(() => {
            if (!input.value) {
                btn.src = "assets/icons/audio.png";
            }
        }, 1)
    });

    btn.addEventListener("click", () => {
        if (btn.src.indexOf("assets/icons/send.png") > -1) {
            sendMessage();
        } else if (btn.src.indexOf("assets/icons/audio.png") > -1) {
            if (navigator.mediaDevices) {
                let chunks = [],
                mediaStream
                time = 0;

                navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                    $(".input_area div").removeAttr("hidden");
                    $(btn).attr("hidden", "");

                    const countdown = $(".input_area span");
                    countdown.removeAttr("hidden");
                    countdown.css("line-height", `${form.scrollHeight}px`);

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

                    $(".input_area div")[0].onclick = () => {
                        mediaRecorder.stop();

                        setTimeout(() => {
                            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                            sendFile(false, blob);
                        }, 1000);
                    };

                    $(".input_area div")[1].onclick = () => mediaRecorder.stop();
                });
            }
        }
    })
}

function convertTime(s) {
    const min = Math.floor(s / 60),
        sec = s % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function sendMessage(e) {
    e.preventDefault();

    const input = $(".input_area input[type='text']")[0],
        btn = $(".input_area img")[1],
        xml = new XMLHttpRequest(),
        message_area = $(".message_area")[0];

    if (!input.value) {
        return;
    }

    btn.src = "assets/icons/send.png";

    xml.open("POST", "../xmlhttprequest/message_sender.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(`m=${input.value}&id=${id}`); // XML content is user input

    xml.onload = () => {
        input.value = "";
        scrollState = true;
        message_area.scrollTop = message_area.scrollHeight;
    };
}

function sendFile(e, blob = false) {
    if (e) {
        e.preventDefault();
    }

    const toast = createToast("Enviando arquivo...")

    const file = $(".input_area input[type='file']")[0],
        xml = new XMLHttpRequest(),
        formData = new FormData(),
        d = new Date();

    if (blob) {
        formData.set("file_user_input", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}`);
        formData.set("audio", true);
    } else if (file.files.length) {
        formData.set("file_user_input", file.files[0]);
    } else {
        return;
    }

    formData.set("id", id);
    xml.open("POST", "../xmlhttprequest/chat_file_upload.php", true);
    xml.send(formData);

    xml.onload = () => {
        toast.innerHTML = "Arquivo enviado com sucesso!";
        setTimeout(() => { $(toast).slideUp() }, 2500)
    }
}

function createToast(txt) {
    const toast = document.createElement("div");
    toast.classList = "toast";
    toast.innerHTML = txt;
    $(document.body).append(toast);
    $(toast).slideDown();
    
    return toast;
}