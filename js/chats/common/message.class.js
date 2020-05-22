class Message {
    constructor(message = false, index = false, group = false) {
        const d = new Date(Number(message.time) * 1000);

        this.time = `<div style="display: grid"><div class="message_time">${addZero(d.getDate()) + "/" + addZero(d.getMonth() + 1) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes())}</div></div>`;
        this.message = message;
        this.index = index;
        this.sender = JSON.parse(message.sender);
        this.xml = new XMLHttpRequest();
        this.btn = $(".input_area img")[2];
        this.group = group;
    }

    parse() {
        if (this.message.file != 0) {
            const img = ["png", "jpg", "jpeg", "gif", "jfif"],
                video = ["mp4", "webm"],
                audio = ["mp3", "wav", "ogg"];

            try {
                this.message.file = JSON.parse(this.message.file);
            } catch (e) { }

            if (this.sender.id === atob(sessionStorage["aWQ="])) {
                if (img.includes(this.message.file.extension))
                    return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message mine" style="margin-left: 0"><img data-src="${atob(this.message.file.location)}">${this.time}</div></div>`;
                else if (video.includes(this.message.file.extension))
                    return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message mine" style="margin-left: 0;"><video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div></div>`;
                else if (audio.includes(this.message.file.extension))
                    return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message mine" style="margin-left: 0;"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div></div>`;
                else
                    return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message mine" style="margin-left: 0;"><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div></div>`;
            } else {
                if (this.group || atob(id).indexOf("group") > -1) {
                    if (img.includes(this.message.file.extension))
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.sender.name}</span><img data-src="${atob(this.message.file.location)}">${this.time}</div><img class="profile_img" src="${this.sender.photo}"></div></div>`;
                    else if (video.includes(this.message.file.extension))
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.sender.name}</span><video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div><img class="profile_img" src="${this.sender.photo}"></div></div>`;
                    else if (audio.includes(this.message.file.extension))
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.sender.name}</span><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                    else
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.sender.name}</span><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div><img class="profile_img" src="${this.sender.photo}"></div></div>`;
                } else {
                    if (img.includes(this.message.file.extension))
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message their"><img data-src="${atob(this.message.file.location)}">${this.time}</div></div>`;
                    else if (video.includes(this.message.file.extension))
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message their"><video controls="" preload=""><source data-src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video>${this.time}</div></div>`;
                    else if (audio.includes(this.message.file.extension))
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message their"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source data-src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div>${this.time}</div></div>`;
                    else
                        return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message their"><div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div> ${this.time}</div></div>`;
                }
            }
        } else {
            this.format();

            if (this.sender.id === atob(sessionStorage["aWQ="])) {
                return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message mine">${this.message.content + this.time}</div></div>`;
            } else {
                if (this.group || atob(id).indexOf("group") > -1) {
                    return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="their"><div class="message" style="border-bottom-left-radius: 0;"><span style="color: blueviolet; font-size: 18px; display: inline-block; margin-bottom: 5px; font-weight: bold">${this.sender.name}</span><div>${this.message.content}</div>${this.time}</div><img class="profile_img" src="${this.sender.photo}"></div></div>`;
                } else {
                    return `<div ${this.index !== false ? "data-message='" + this.index + "'" : "style='display: grid;'"}><div class="message their">${this.message.content + this.time}</div></div>`;
                }
            }
        }
    }

    sendMessage(e) {
        e.preventDefault();
        if (this.message.content === " ")
            return;

        const content = document.createElement("p");
        content.innerText = this.message.content;
        this.message.content = content.innerHTML;
        $(content).remove();

        this.index = $("[data-message]").length;
        this.btn.src = "assets/icons/audio.png";
        this.sender.id = atob(sessionStorage["aWQ="]);
        canScroll = true;
        $(".input_area textarea")[0].value = "";
        $(".message_area").css("visibility", "visible").css("display", "block");
        $(".message_area").append(this.parse());
        $(".message_area")[0].scrollTop = $(".message_area")[0].scrollHeight - $(".message_area")[0].clientHeight;

        if (atob(id).indexOf("teacher") > -1) {
            doubts.append("messages[]", this.message.content);
            return;
        }

        this.xml.open("POST", "../server/message_sender.php", true);
        this.xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xml.send(`m=${encodeURIComponent(this.message.content)}&id=${id}`); // XML content is user input
        chatListUpdater(true);
    }

    sendFile(e, blob = false) {
        e.preventDefault();

        const file = $(".input_area input[type='file']")[0],
            formData = new FormData(),
            d = new Date();

        this.btn.src = "assets/icons/audio.png";

        if (blob) {
            if (atob(id).indexOf("teacher") > -1) {
                doubts.append("files[]", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}.ogg`);
                return;
            }
            formData.set("file_user_input", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}.ogg`);
            formData.set("audio", true);
            this.xml.open("POST", "../server/file_sender.php", true);
            this.xml.send(formData);
            chatListUpdater(true);
        } else if (file.files.length) {
            let toast;
            if (atob(id).indexOf("teacher") === -1) {
                toast = file.files.length > 1 ? new Toast("Enviando arquivos...") : new Toast("Enviando arquivo...");
                toast.show();
            }

            for (let i = 0; i < file.files.length; i++) {
                this.message.file = {};
                this.index = $("[data-message]").length;
                this.message.file.location = btoa(URL.createObjectURL(file.files[i]));
                this.message.file.extension = file.files[i].name.slice((Math.max(0, file.files[i].name.lastIndexOf(".")) || Infinity) + 1);
                this.message.file = JSON.stringify(this.message.file);

                $(".message_area").append(this.parse());
                $(".message_area [data-src*='blob']").each((index, item) => $(item).attr("src", $(item).attr("data-src")).removeAttr("data-src"));

                if (atob(id).indexOf("teacher") > -1) {
                    doubts.append("files[]", file.files[i]);
                    continue;
                }

                formData.append("files[]", file.files[i]);
                formData.set("id", id);
                this.xml.open("POST", "../server/file_sender.php", true);
                this.xml.send(formData);

                if (i === file.files.length - 1) {
                    this.xml.onload = () => {
                        if (i === 0)
                            toast.update("Arquivo enviado com sucesso!");
                        else
                            toast.update("Arquivos enviados com sucesso!");
                        toast.show();
                        toast.destroy(2500);
                    }
                }
            }
            chatListUpdater(true);
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

    format() {
        (() => { // #hashtag
            const hashtags = this.message.content.match(/(^|\B)#([a-zA-Z0-9_]{1,})(\b|\r)/g) || [];
            hashtags.forEach(hashtag => {
                const doubt = hashtag.replace("#", "");
                this.message.content = !forum_doubts[doubt - 1] ? this.message.content : this.message.content.replace(hashtag, `<span style="color: #337ab7; cursor: pointer" data-hashtag="${doubt}">${hashtag}</span>`);
            });
        })();

        (() => {
            const replace = [{ "pattern": /(\*{2})(.+)(\*{2})/g, "tag": "strong", "search": /\*/g }, { "pattern": /(\_{2})(.+)(\_{2})/g, "tag": "em", "search": /\_/g }, { "pattern": /(\~{2})(.+)(\~{2})/g, "tag": "del", "search": /\~/g }, { "pattern": /(\`{2})(.+)(\`{2})/g, "tag": "code", "search": /\`/g }];
            replace.forEach(format => {
                const regex = this.message.content.match(format.pattern) || [];
                regex.forEach(match => this.message.content = this.message.content.replace(match, `<${format.tag}>${match.replace(format.search, "")}</${format.tag}>`))
            });

            const spoilers = this.message.content.match(/(\|{2})(.+)(\|{2})/g) || [];
            spoilers.forEach(spoiler => this.message.content = this.message.content.replace(spoiler, `<span class="spoiler">${spoiler.replace(/\|/g, "")}</span>`));
        })();

        (() => { // :emojies:
            const emoji = this.message.content.match(/\:([^)]+)\:/g) || [];
            emoji.forEach(emote => emojies[emote] ? this.message.content = this.message.content.replace(emote, `&#x${emojies[emote]};`) : null);
        })();

        (() => { // https://wwww.url.com
            const urls = this.message.content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || [];
            urls.forEach(url => {
                this.message.content = this.message.content[this.message.content.indexOf(url) - 1] !== "(" && this.message.content[this.message.content.indexOf(url) + url.length] !== ")" && this.message.content[this.message.content.indexOf(url) - 1] !== "\"" && this.message.content[this.message.content.indexOf(url) + url.length] !== "\"" ? this.message.content.replace(url, `<a style="color: #337ab7;" href="${url}">${url}</a>`) : this.message.content
            });

            const markdown_urls = this.message.content.match(/\[([^\[]+)\](\(.*\))/gm) || [];
            markdown_urls.forEach(matches => {
                matches = typeof matches == "object" ? matches : [matches];
                for (let i = 0; i < matches.length; i++) {
                    const markdown = /\[([^\[]+)\]\((.*)\)/.exec(matches[i]);
                    this.message.content = this.message.content.replace(markdown[0], `<a style="color: #337ab7;" href="${markdown[2]}">${markdown[1]}</a>`);
                };
            });
        })();
    }
}