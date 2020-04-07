function messageSender() {
    const form = $("form.input_area")[0],
        input = $(".input_area input[type='text']")[0],
        btn = $(".input_area img")[1],
        file = $(".input_area input[type='file']")[0];
    
    file.addEventListener("click", () => $(".input_area input[type='file']").click());

    file.addEventListener("change", sendFile);

    form.addEventListener("submit", sendMessage);

    input.addEventListener("keydown", k => {
        if (input.value.length === 1 && k.keyCode === 8) {
            btn.src = "assets/icons/audio.png";
            return;
        } else if (input.value.length === 0 && k.keyCode === 8) {
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
                let chunks = [];

                $(".input_area div").addClass("audio_control");

                navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);

                    // $(".input_area div").eq(0).on("click", () => {
                    //     mediaRecorder.stop();
                    //     sendFile();
                    // });

                    $(".input_area div").eq(1).on("click", () => {
                        mediaRecorder.stop();
                    });

                    mediaRecorder.ondataavailable = e => {
                        console.log("data")
                        console.log(e);
                        return;
                        chunks.push(e.data);
                    };

                    mediaRecorder.onstop = () => {
                        console.log("stop")
                        return;
                        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                        chunks = [];
                        console.log(URL.createObjectURL(blob));
                        //send
                    };
                });


                btn.remove();

                const countdown = $(".input_area span");
                countdown.css("line-height", `${form.scrollHeight}px`);
                countdown.removeAttr("hidden");

                let time = 0;
                const countdownTime = setInterval(() => {
                    time++;
                    const min = Math.floor(time / 60);
                    const sec = time % 60;
                    countdown.html(`${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`);
                }, 1000);
            }
        }
        return;
    })
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

function sendFile(file, audio = false) {
    if (audio) {
        return; // =====================================================================================================
    } else {
        const file = $(".input_area input[type='file']")[0];
    }

    const xml = new XMLHttpRequest();

    if (file.files.length < 1) {
        return;
    }

    const formData = new FormData();
    formData.set("file_user_input", file.files[0]);
    formData.set("id", id);

    xml.open("POST", "../xmlhttprequest/chat_file_upload.php", true);
    xml.send(formData);
}