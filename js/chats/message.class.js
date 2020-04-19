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

    parse() {
        if (JSON.parse(this.message.file)) {
            const img = ["png", "jpg", "jpeg", "gif", "jfif"],
                video  = ["mp4", "webm"],
                audio = ["mp3", "wav", "ogg"];

            message.file = JSON.parse(message.file);

            if (this.sent) {
                if (img.includes(this.message.file.extension))
                    return `<div data-message=${this.index}><div class="message mine" style="margin-left: 0"><img src="${atob(this.message.file.location)}">${this.time}</div></div>`;
                else if (video.includes(this.message.file.extension))
                    return `<div data-message=${this.index}><div class="message mine" style="margin-left: 0;"><video controls="" preload=""><source src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div></div>`;
                else if (audio.includes(this.message.file.extension))
                    return `<div data-message=${this.index}><div class="message mine" style="margin-left: 0;"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div></div>`;
                else
                    return `<div data-message=${this.index}><div class="message mine" style="margin-left: 0;"><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(this.message.file.size)}</div></div></a></div> ${this.time}</div></div>`;
            } else {
                if (atob(id).indexOf("group") > -1) {
                    if (img.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message["name"]}</span><img src="${atob(this.message.file.location)}">${this.time}</div><img class="profile_img" src="${this.message["photo"]}"></div></div>`;
                    else if (video.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message["name"]}</span><video controls="" preload=""><source src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div><img class="profile_img" src="${this.message["photo"]}"></div></div>`;
                    else if (audio.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message["name"]}</span><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div><img class="profile_img" src="${this.message["photo"]}"></div></div>`;
                    else
                        return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message["name"]}</span><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div><img class="profile_img" src="${this.message["photo"]}"></div></div>`;
                } else {
                    if (img.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="message their"><img src="${atob(this.message.file.location)}">${this.time}</div></div>`;
                    else if (video.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="message their"><video controls="" preload=""><source src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div></div>`;
                    else if (audio.includes(this.message.file.extension))
                        return `<div data-message=${this.index}><div class="message their"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div></div>`;
                    else
                        return `<div data-message=${this.index}><div class="message their"><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${convertUnits(this.message.file.size)}</div></div></a></div> ${this.time}</div></div>`;
                }
            }
        } else {
            if (this.sent) {
                return `<div data-message=${this.index}><div class="message mine">${this.message.content + this.time}</div></div>`;
            } else {
                if (atob(id).indexOf("group") > -1) {
		    		return `<div data-message=${this.index}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.message["name"]}</span>${this.message.content + this.time}</div><img class="profile_img" src="${this.message["photo"]}"></div></div>`;
                } else {
		    		return `<div data-message=${this.index}><div class="message their">${this.message.content + this.time}</div></div>`;
                }
            }
        }
    }

    sendMessage(e) {
        e.preventDefault();

        this.btn.src = "assets/icons/audio.png";

        this.xml.open("POST", "../xmlhttprequest/message_sender.php", true);
        this.xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xml.send(`m=${this.message}&id=${id}`); // XML content is user input

        this.xml.onload = () => {
            $(".input_area input[type='text']")[0].value = "";
            scrollState = true;
            $(".message_area")[0].scrollTop = $(".message_area")[0].scrollHeight;
        };
    }

    sendFile(e, blob = false) {
        if (e)
            e.preventDefault();
    
        const file = $(".input_area input[type='file']")[0],
            formData = new FormData(),
            d = new Date();
    
        this.btn.src = "assets/icons/audio.png";
    
        if (blob) {
            formData.set("file_user_input", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}`);
            formData.set("audio", true);
        } else if (file.files.length) {
            const toast = new Toast("Enviando arquivo...");
            toast.show();
            formData.set("file_user_input", file.files[0]);
        } else
            return;
    
        formData.set("id", id);
        this.xml.open("POST", "../xmlhttprequest/chat_file_upload.php", true);
        this.xml.send(formData);
    
        this.xml.onload = () => {
            if (file.files.length) {
                toast.update("Arquivo enviado com sucesso!");
                toast.destroy(2500);
            }
        }
    }
}