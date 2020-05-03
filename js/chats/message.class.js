class Message {
    constructor(message = false, index = false) {
        const d = new Date(Number(message.time) * 1000);

        this.time = `<div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div>`;
        this.message = message;
        this.index = index;
        this.sent = message.sender === atob(sessionStorage["aWQ="]);
        this.xml = new XMLHttpRequest();
        this.btn = $(".input_area img")[1];
    }

    parse(doubt = false) {
        if (JSON.parse(this.message.file)) {
            const img = ["png", "jpg", "jpeg", "gif", "jfif"],
                video = ["mp4", "webm"],
                audio = ["mp3", "wav", "ogg"];

            this.message.file = JSON.parse(this.message.file);

            if (this.sent) {
                if (img.includes(this.message.file.extension))
                    return doubt ? `<img data-src="${atob(this.message.file.location)}">` : `<div data-message=${this.index}><div class="message mine" style="margin-left: 0"><img data-src="${atob(this.message.file.location)}">${this.time}</div></div>`;
                else if (video.includes(this.message.file.extension))
                    return doubt ? `<video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>` : `<div data-message=${this.index}><div class="message mine" style="margin-left: 0;"><video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div></div>`;
                else if (audio.includes(this.message.file.extension))
                    return doubt ? `<div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>` : `<div data-message=${this.index}><div class="message mine" style="margin-left: 0;"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div></div>`;
                else
                    return doubt ? `<div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>` : `<div data-message=${this.index}><div class="message mine" style="margin-left: 0;"><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div></div>`;
            } else {
                if (atob(id).indexOf("group") > -1) {
                    if (img.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message.name}</span><img data-src="${atob(this.message.file.location)}">${this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                    else if (video.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message.name}</span><video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                    else if (audio.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message.name}</span><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                    else
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message.name}</span><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                } else {
                    if (img.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="message their"><img data-src="${atob(this.message.file.location)}">${this.time}</div></div>`;
                    else if (video.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="message their"><video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div></div>`;
                    else if (audio.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="message their"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div></div>`;
                    else
                        return `<div data-message=${this.index}><div class="message their"><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div> ${this.time}</div></div>`;
                }
            }
        } else {
            if (this.sent) {
                return doubt ? `${this.message.content}` : `<div data-message=${this.index}><div class="message mine">${this.message.content + this.time}</div></div>`;
            } else {
                if (atob(id).indexOf("group") > -1) {
                    return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message.name}</span>${this.message.content + this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                } else {
                    return `<div data-message=${this.index}><div class="message their">${this.message.content + this.time}</div></div>`;
                }
            }
        }
    }

    sendMessage(e) {
        e.preventDefault();
        this.index = $("[data-message]").length;
        this.btn.src = "assets/icons/audio.png";
        canScroll = true;

        if (this.message.content === " ")
            return;

        $(".input_area input[type='text']")[0].value = "";
        $(".message_area").css("visibility", "visible").css("display", "block");
        $(".message_area").html($(".message_area").html() + this.parse());
        $(".message_area")[0].scrollTop = $(".message_area")[0].scrollHeight - $(".message_area")[0].clientHeight;

        if (atob(id).indexOf("teacher") > -1) {
            doubts.push(this.parse(true));
            return;
        }

        this.xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        this.xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xml.send(`m=${this.message.content}&id=${id}`); // XML content is user input
    }

    sendFile(e, blob = false) {
        e.preventDefault();

        const file = $(".input_area input[type='file']")[0],
            formData = new FormData(),
            d = new Date();

        this.btn.src = "assets/icons/audio.png";

        let toast = new Toast();

        if (blob) {
            formData.set("file_user_input", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}`);
            formData.set("audio", true);
        } else if (file.files.length) {
            if (file.files.length > 1) {
                toast = new Toast("Enviando arquivos...");
                toast.show();
                for (let i = 0; i < file.files.length; i++) {
                    if (this.renderFile())
                        continue;

                    formData.set(`file_user_input${i}`, file.files[i]);
                    formData.set("id", id);
                    this.xml.open("POST", "../xmlhttprequest/chat_file_upload.php", true);
                    this.xml.send(formData);
                    this.xml.upload.onprogress = e => {
                        const progress = e.loaded / e.total * 100;

                        toast.update(`Enviando arquivo (${progress}%)...`);
                        toast.show();
                        toast.destroy(1250);
                    };

                    this.xml.onload = () => {
                        toast.update(`${i}° arquivo enviado com sucesso!`);
                        toast.show();
                        toast.destroy(1250);
                    };

                    this.xml.onerror = this.xml.onabort = e => {
                        toast.update(`Erro no upload: ${e}`, "background-color: red; font-size: 18px; font-weigth: bold;");
                        toast.show();
                        toast.destroy(1250)
                    };
                }
                return;
            } else {
                formData.set("file_user_input", file.files[0]);
                formData.set("id", id);
                if (this.renderFile())
                    return;
            }
        } else
            return;

        this.xml.open("POST", "../xmlhttprequest/chat_file_upload.php", true);
        this.xml.send(formData);

        this.xml.onload = () => {
            if (file.files.length) {
                (file.files.length > 1) ? toast.update("Arquivos enviados com sucesso!") : toast.update("Arquivo enviado com sucesso!");
                toast.show();
                toast.destroy(2500);
            }
        }
    }

    convertUnits(bytes) {
        if (bytes === 0)
            return '0 bytes';
        const k = 1024,
            sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    renderFile() {
        const file = $(".input_area input[type='file']")[0];

        this.message.file = {};
        this.index = $("[data-message]").length;
        this.message.file.location = btoa(URL.createObjectURL(file.files[0]));
        this.message.file.extension = file.files[0].name.slice((Math.max(0, file.files[0].name.lastIndexOf(".")) || Infinity) + 1);
        this.message.file = JSON.stringify(this.message.file);
        $(".message_area").html($(".message_area").html() + this.parse());
        $(".message_area [data-src*='blob']").each((index, item) => $(item).attr("src", $(item).attr("data-src")));
        if (atob(id).indexOf("teacher") > -1) {
            doubts.push(this.parse(true));
            return true;
        } else
            return false;
    }
}