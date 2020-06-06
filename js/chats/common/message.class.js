class Message {
    constructor(message = false, group = false) {
        this.message = message;
        this.xml = new XMLHttpRequest();

        this.xml.onload = () => {
            const canUpdateBck = canUpdate;
            canUpdate.chatListUpdater = canUpdate.chatsUpdater = true;
            (async () => {
                await chatListUpdater(true);
                await chatsUpdater(0, true);
            })().then(() => canUpdate = canUpdateBck);
        }

        this.btn = $(".input_area img")[2];
        this.group = group;
        this.message.sender = typeof this.message.sender !== "object" ? JSON.parse(this.message.sender) : this.message.sender;

        const d = new Date(Number(message.time) * 1000);
        this.time = `<div style="display: grid; margin: 10px 10px 10px 20px;"><div class="message_time">${Number(message.edited) ? "<span style='margin: 0 5px'>editado</span>" : ""}${d.getHours() > 12 ? addZero(d.getHours() - 12) + ":" + addZero(d.getMinutes()) + " PM" : addZero(d.getHours()) + ":" + addZero(d.getMinutes()) + " AM"}${message.sender.id === atob(sessionStorage["aWQ="]) ? Number(message.seen) === 1 ? "<div class='message_status' style='background-image: url(assets/icons/seen.png)'></div>" : Number(message.seen) === 0 ? "<div class='message_status' style='background-image: url(assets/icons/sent.png)'></div>" : Number(message.seen) === -1 ? "<div class='message_status' style='background-image: url(assets/icons/sending.png)'></div>" : "" : ""}</div></div>`;

    }

    parse() {
        if (this.message.file !== "0" && this.message.file != null) {
            const img = ["png", "jpg", "jpeg", "gif", "jfif"],
                video = ["mp4", "webm"],
                audio = ["mp3", "wav", "ogg"];
            this.message.file = typeof this.message.file !== "object" ? JSON.parse(this.message.file) : this.message.file;            

            const parseFile = () => {
                if (this.message.sender.id === atob(sessionStorage["aWQ="])) {
                    if (img.includes(this.message.file.extension.toLowerCase()))
                        return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message mine" style="margin-left: 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><img data-src="${atob(this.message.file.location)}"></div>${this.time}</div></div>`;
                    else if (video.includes(this.message.file.extension.toLowerCase()))
                        return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message mine" style="margin-left: 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><video controls="" preload=""><source src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video></div>${this.time}</div></div>`;
                    else if (audio.includes(this.message.file.extension.toLowerCase()))
                        return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message mine" style="margin-left: 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div></div>${this.time}</div></div>`;
                    else
                        return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message mine" style="margin-left: 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46; border-radius: 50%"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div></div>`;
                } else {
                    if (this.group || (id && atob(id).indexOf("group") > -1)) {
                        if (img.includes(this.message.file.extension.toLowerCase()))
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><script id="s_${this.message.time}">$(".message_area div script#s_${this.message.time}").parent().data("sender", JSON.parse('${JSON.stringify(this.message.sender)}')).children("script").remove()</script><div class="their"><div class="message" style="border-bottom-left-radius: 0; padding: 5px 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="color: blueviolet; font-size: 18px; margin-bottom: 5px; font-weight: bold">${this.message.sender.name}</div><img data-src="${atob(this.message.file.location)}"></div>${this.time}</div><img class="profile_img" src="${this.message.sender.photo}"></div></div>`;
                        else if (video.includes(this.message.file.extension.toLowerCase()))
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><script id="s_${this.message.time}">$(".message_area div script#s_${this.message.time}").parent().data("sender", JSON.parse('${JSON.stringify(this.message.sender)}')).children("script").remove()</script><div class="their"><div class="message" style="border-bottom-left-radius: 0; padding: 5px 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="color: blueviolet; font-size: 18px; margin-bottom: 5px; font-weight: bold">${this.message.sender.name}</div><video controls="" preload=""><source src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video></div>${this.time}</div><img class="profile_img" src="${this.message.sender.photo}"></div></div>`;
                        else if (audio.includes(this.message.file.extension.toLowerCase()))
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><script id="s_${this.message.time}">$(".message_area div script#s_${this.message.time}").parent().data("sender", JSON.parse('${JSON.stringify(this.message.sender)}')).children("script").remove()</script><div class="their"><div class="message" style="border-bottom-left-radius: 0; padding: 5px 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="color: blueviolet; font-size: 18px; margin-bottom: 5px; font-weight: bold">${this.message.sender.name}</div><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div></div>${this.time}</div><img class="profile_img" src="${this.message.photo}"></div></div>`;
                        else
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><script id="s_${this.message.time}">$(".message_area div script#s_${this.message.time}").parent().data("sender", JSON.parse('${JSON.stringify(this.message.sender)}')).children("script").remove()</script><div class="their"><div class="message" style="border-bottom-left-radius: 0; padding: 5px 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="color: blueviolet; font-size: 18px; margin-bottom: 5px; font-weight: bold">${this.message.sender.name}</div><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46; border-radius: 50%"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div>${this.time}</div><img class="profile_img" src="${this.message.sender.photo}"></div></div>`;
                    } else {
                        if (img.includes(this.message.file.extension.toLowerCase()))
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message their">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><img data-src="${atob(this.message.file.location)}"></div>${this.time}</div></div>`;
                        else if (video.includes(this.message.file.extension.toLowerCase()))
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message their">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><video controls="" preload=""><source src="${atob(this.message.file.location)}" type="video/${this.message.file.extension}"></video></div>${this.time}</div></div>`;
                        else if (audio.includes(this.message.file.extension.toLowerCase()))
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message their">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="display: flex;"><img class="audio_btns" src="assets/icons/play.png"><input type="range" value="0" max=""><audio preload="metadata"><source src="${atob(this.message.file.location)}" type="audio/${this.message.file.extension}"></audio><span class="audio_time"></span></div></div>${this.time}</div></div>`;
                        else
                            return `<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message their">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><a style="display: flex" href="${atob(this.message.file.location)}" download=""><div class="pic" style="justify-content: start; margin-bottom: -2vh;"><img src="assets/icons/arrow.png" style="max-width: 60%; background-color: #291a46; border-radius: 50%"></div><div style="flex: 2;" class="info"><div>${this.message.file.name}</div><div style="color: #cccccc; font-size: 16px">${this.convertUnits(this.message.file.size)}</div></div></a></div></div>${this.time}</div></div>`;
                    }
                }
            }

            return new Promise(resolve => {
                fetch(atob(this.message.file.location)).then(res => {
                    if (res.redirected) resolve(parseFile());

                    res.blob().then(blob => {
                        this.message.file.location = btoa(URL.createObjectURL(new File([blob], this.message.file.name, { type: blob.type })));
                        resolve(parseFile());
                    });
                });
            });
        } else {
            (() => { // #hashtag
                const hashtags = this.message.content.match(/(?!>)(^|\B)#([a-zA-Z0-9_]+)(\b|\r)(?!<)(?!;)/g) || [];
                hashtags.forEach(hashtag => {
                    const value = hashtag.slice(1),
                        subject = {
                            "qui": "Química",
                            "quí": "Química",
                            "quimica": "Química",
                            "química": "Química",

                            "fis": "Física",
                            "fís": "Física",
                            "fisica": "Física",
                            "física": "Física",

                            "bio": "Biologia",
                            "biologia": "Biologia",

                            "mat": "Matemática",
                            "matemática": "Matemática",
                            "matematica": "Matemática",

                            "pt": "Português",
                            "português": "Português",
                            "portugues": "Português",

                            "ing": "Inglês",
                            "inglês": "Inglês",
                            "ingles": "Inglês",

                            "geo": "Geografia",
                            "geografia": "Geografia",

                            "hist": "História",
                            "história": "História",
                            "historia": "História",

                            "fil": "Filosofia",
                            "filo": "Filosofia",
                            "filosofia": "Filosofia",

                            "soc": "Sociologia",
                            "socio": "Sociologia",
                            "sociologia": "Sociologia",

                            "red": "Redação",
                            "redação": "Redação",
                            "redacão": "Redação",
                            "redaçao": "Redação",
                            "redacao": "Redação",

                            "lit": "Literatura",
                            "literatura": "Literatura"
                        };

                    if (forum_doubts[value - 1])
                        this.message.content = this.message.content.replace(hashtag, `<span style="color: rgb(51, 122, 183); cursor: pointer" data-doubt="${btoa(forum_doubts[value - 1][1][2] + ":" + value)}">${hashtag}</span>`);
                    else if (subject.hasOwnProperty(value.toLowerCase()))
                        this.message.content = this.message.content.replace(hashtag, `<span style="color: rgb(51, 122, 183); cursor: pointer" data-subject-name="${subject[value]}">${hashtag}</span>`);
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
                const emoji = this.message.content.match(/:(\w+):/g) || [];
                emoji.forEach(emote => emojies[emote] ? this.message.content = this.message.content.replace(emote, `&#x${emojies[emote]};`) : null);
            })();

            (() => { // https://wwww.url.com
                const urls = this.message.content.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) || [];
                urls.forEach(url => {
                    this.message.content = this.message.content[this.message.content.indexOf(url) - 1] !== "(" && this.message.content[this.message.content.indexOf(url) + url.length] !== ")" && this.message.content[this.message.content.indexOf(url) - 1] !== "\"" && this.message.content[this.message.content.indexOf(url) + url.length] !== "\"" ? this.message.content.replace(url, `<a style="color: rgb(51, 122, 183);" href="${url}">${url}</a>`) : this.message.content
                });

                const markdown_urls = this.message.content.match(/\[([^\[]+)\](\(.*\))/gm) || [];
                markdown_urls.forEach(matches => {
                    matches = typeof matches == "object" ? matches : [matches];
                    for (let i = 0; i < matches.length; i++) {
                        const markdown = /\[([^\[]+)\]\((.*)\)/.exec(matches[i]);
                        this.message.content = this.message.content.replace(markdown[0], `<a style="color: rgb(51, 122, 183);" href="${markdown[2]}">${markdown[1]}</a>`);
                    };
                });
            })();

            return this.message.sender.id === atob(sessionStorage["aWQ="]) ? new Promise(resolve => resolve(`<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message mine">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px">${this.message.content}</div>${this.time}</div></div>`)) : this.group || (id && atob(id).indexOf("group") > -1) ? new Promise(resolve => resolve(`<div style="display: grid;" data-id="${btoa(this.message.id)}"><script id="s_${this.message.time}">$(".message_area div script#s_${this.message.time}").parent().data("sender", JSON.parse('${JSON.stringify(this.message.sender)}')).children("script").remove()</script><div class="their"><div class="message" style="border-bottom-left-radius: 0; padding: 5px 0;">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px"><div style="color: blueviolet; font-size: 18px; margin-bottom: 5px; font-weight: bold">${this.message.sender.name}</div>${this.message.content}</div>${this.time}</div><img class="profile_img" src="${this.message.sender.photo}"></div></div>`)) : new Promise(resolve => resolve(`<div style="display: grid;" data-id="${btoa(this.message.id)}"><div class="message their">${(() => this.message.reply != 0 ? "<div class='reply' data-reply='" + btoa(this.message.reply.id + "." + this.message.reply.receiver) + "'><div>" + this.message.reply.sender + "</div><div>" + this.message.reply.content + "</div></div>" : "")()}<div style="margin: 10px 35px 10px 20px">${this.message.content}</div>${this.time}</div></div>`));
        }
    }

    sendMessage(e) {
        e.preventDefault();
        if (this.message.content === " ") return;
        $(".message_modal").css("display", "");

        const content = document.createElement("p");
        content.innerText = this.message.content;
        this.message.content = content.innerHTML;
        $(content).remove();

        if (atob(id).indexOf("teacher") > -1) {
            this.message.id = doubts.getAll("messages[]") !== null ? doubts.getAll("messages[]").length : 0;
            doubts.append("messages[]", JSON.stringify([this.message.content, reply]));
        }

        this.btn.src = "assets/icons/audio.png";
        canScroll = true;
        $(".input_area textarea")[0].value = "";
        $(".message_area").css("display", "block");
        const response = reply.id && reply.receiver !== undefined ? JSON.stringify([reply.receiver, reply.id]) : 0;

        if (edit) {
            const msg = $(`.message_area div[data-id="${btoa(edit.id)}"]`);
            msg.html(msg.html().replace(edit.content, this.message.content));
            $(".message_time", msg).prepend("<span style='margin: 0 5px'>editado</span>");
            this.xml.open("POST", "../server/message_sender.php", true);
            this.xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.xml.send(`edit=${edit.id}&m=${encodeURIComponent(this.message.content)}`);
            edit = 0;
            return;
        }

        if (atob(id).indexOf("teacher") > -1) return;

        this.xml.open("POST", "../server/message_sender.php", true);
        this.xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xml.send(`m=${encodeURIComponent(this.message.content)}&id=${id}&r=${response}`); // XML content is user input

        $(".message_area").scrollTop($(".message_area")[0].scrollHeight - $(".message_area")[0].clientHeight);
        this.message.sender.id = atob(sessionStorage["aWQ="]);
        this.message.reply = reply;
        $(".message_area").append(this.parse()).children(":last").off("contextmenu").on("contextmenu", ContextMenu);
    }

    sendFile(e, blob = false) {
        e.preventDefault();
        $(".message_modal").css("display", "");

        const file = $(".input_area input[type='file']")[0],
            formData = new FormData(),
            d = new Date();

        this.btn.src = "assets/icons/audio.png";
        this.message.reply = reply;

        if (blob) {
            if (atob(id).indexOf("teacher") > -1) {
                doubts.append("files[]", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}.ogg`);
                doubts.append("reply[]", reply);
                return;
            }

            formData.set("file_user_input", blob, `AUD_${d.getFullYear() + (addZero(d.getMonth() + 1)) + addZero(d.getDate()) + addZero(d.getMilliseconds())}.ogg`);
            formData.set("audio", true);
            formData.set("reply", reply)
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
                this.message.file = JSON.stringify({
                    "name": file.files[i].name,
                    "size": file.files[i].size,
                    "location": btoa(URL.createObjectURL(file.files[i])),
                    "extension": file.files[i].name.slice((Math.max(0, file.files[i].name.lastIndexOf(".")) || Infinity) + 1)
                });

                $(".message_area").append(this.parse());

                if (atob(id).indexOf("teacher") > -1) {
                    doubts.append("files[]", file.files[i]);
                    doubts.append("reply[]", reply);
                    continue;
                }

                formData.append("files[]", file.files[i]);
                formData.set("id", id);
                formData.set("reply", reply)
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
}