$(document).ready(() => {
    $("#alfascrapbooks_menu .menu_icon").on("click", function () {
        const alfascrapbook_actions = $("#alfascrapbooks_menu .menu_icon"),
            xml = new XMLHttpRequest();

        if (this === alfascrapbook_actions[0]) { // New

        } else if (this === alfascrapbook_actions[1]) { // View
            const modal = new Modal("<form style='flex: 15; margin: 10px'><input placeholder='URI do AlfaScrapBook' type='text' style='width: 100%;'></form><div style='margin: 10px; flex: 1;'><img src='assets/icons/check.png' style='vertical-align: middle; max-width: 100%; cursor: pointer'></div>", "padding: 25px;");
            $(modal.modal).children().eq(0).css("display", "flex");
            modal.show();

            $("form", modal.modal)[0].onsubmit = $("img", modal.modal)[0].onclick = ({ preventDefault }) => {
                try {
                    preventDefault();
                } catch (exc) { }

                const showScrapBook = ({ target: { responseText } }) => {
                    modal.destroy();
                    if (!responseText) {
                        $("form", modal.modal)[0].reset();
                        $("input", modal.modal).css({ "border": "3px solid red", "color": "red" }).on("focus", ({ currentTarget }) => $(currentTarget).off("focus").css("border", ""));
                        new Toast("O URI inserido n&atilde;o corresponde a nenhum AlfaScrapBook", "background-color: #c80003;").show().destroy(2500);
                        return;
                    }

                    let response,
                        globalBlob;
                    try {
                        response = JSON.parse(responseText);
                    } catch (exc) {
                        new Toast("Algo deu errado no processo de convers&atilde;o para JSON!<br>Por favor, tente novamente mais tarde e reporte &agrave; nossa Equipe!", "background-color: #c80003;").show().destroy(2500);
                        return;
                    }
                    advMenu("#alfascrapbook", "grid");
                    falsify();
                    canUpdate.alfascrapbook = true;

                    const d = new Date(Number(response.time) * 1000),
                        day = addZero(d.getDate()),
                        month = addZero(d.getMonth() + 1),
                        year = addZero(d.getFullYear()),
                        diff = (Math.ceil(Math.abs(new Date() - new Date(`${month}/${day}/${year}`)) / (1000 * 60 * 60 * 24))) - 1,
                        canvas = $("#alfascrapbook canvas")[0],
                        ctx = canvas.getContext("2d"),
                        passSlide = function () {
                            $("#alfascrapbook div[aria-selected='true']").removeAttr("aria-selected");
                            $(this).attr("aria-selected", true);
                            const img = new Image();

                            return new Promise(resolve => {
                                img.onload = () => {
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
                                    resolve();
                                };

                                img.src = $(".alfascrapbook_slide > div", this).css("background-image").slice(4, -1).replace(/"/g, "");
                            });
                        },
                        canvasResize = () => {
                            const img = new Image();

                            canvas.toBlob(blob => {
                                img.onload = () => {
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
                                };

                                img.src = URL.createObjectURL(blob);
                                ctx.canvas.width = window.innerWidth;
                                ctx.canvas.height = window.innerHeight;
                            });
                        },
                        cloneScrapBook = () => {
                            const modal = new Modal("Para conseguir editar este AlfaScrapBook, &eacute; preciso clon&aacute;-lo.", "z-index: 2; flex-direction: column; width: 25vw; height: 15vh; padding-top: 35px; text-align: center", ["CANCELAR"], ["CLONAR", () => {
                                new Toast(`Clonando AlfaScrapBook "${response.name}"...`).show().destroy(2500);
                                xml.open("POST", "../server/alfascrapbook.php", true);
                                xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                                xml.send(`uri=${$("#alfascrapbook").attr("data-uri")}&name=${encodeURIComponent(response.name)}&op=duplicate`);
                                xml.onload = showScrapBook;
                            }]);
                            $(".side_menu_bg").css("z-index", 1);
                            $(".modal_container", modal.modal).css({ "flex": "5", "padding": "0 20px 20px 20px" });
                            modal.show();
                        },
                        buildPreview = () => {
                            canvas.toBlob(blob => {
                                $("#alfascrapbook div[aria-selected='true'] .alfascrapbook_slide div").css("background-image", `url("${URL.createObjectURL(blob)}")`);
                                save();
                            });
                        },
                        save = () => {
                            const xml = new XMLHttpRequest();

                            const formData = new FormData();
                            formData.append("slide", globalBlob, $("#alfascrapbook div[aria-selected='true']").data("path").split("/").slice(-1)[0]);
                            formData.append("uri", $("#alfascrapbook").attr("data-uri"));
                            formData.append("op", "update");

                            xml.open("POST", "../server/alfascrapbook.php", true);
                            xml.send(formData);

                            return null;
                        },
                        setGlobalBlob = () => {
                            return new Promise(resolve => {
                                canvas.toBlob(blob => {
                                    globalBlob = blob;
                                    resolve();
                                });
                            })
                        },
                        pointerModiff = () => {
                            ctx.strokeStyle = $("#pointer_color").val();
                            ctx.lineWidth = $("#pointer_width").val();
                        };

                    new Toast(`AlfaScrapBook "${response.name}" criado por ${response.mine === "true" ? "voc&ecirc;" : response.owner} na data ${day}/${month}/${year} (${diff === 0 ? "hoje" : diff === 1 ? "h&aacute; 1 dia" : "h&aacute; " + diff + "dias"})`).show().destroy(2500);
                    let res = "";
                    response.files.forEach((file, index) => res += `<div><script id="s_${index}">$("#alfascrapbook .alfascrapbook_btn_left script#s_${index}").parent().data("path", "${file[0]}").children("script#s_${index}").remove();</script><div class="alfascrapbook_slide_count">${index + 1}</div><div class="alfascrapbook_slide"><div style="background-image: url('${file[1]}')"></div></div></div>`);
                    $("#alfascrapbook").attr("data-uri", response.uri).children(".alfascrapbook_btn_left").html(res).children().on("click", passSlide);
                    passSlide.bind($("#alfascrapbook .alfascrapbook_btn_left").children().eq(0)[0])().then(() => {
                        canvasResize();
                        $(window).on("resize", canvasResize);
                    });

                    if (response.mine !== true) {
                        $(canvas).on("click", cloneScrapBook);
                        return;
                    }

                    $(canvas).on("mousedown", function({ originalEvent }) {
                        pointerModiff();
                        ctx.beginPath();
                        ctx.moveTo(originalEvent.x, originalEvent.y);

                        $(this).on("mousemove", ({ originalEvent }) => {
                            pointerModiff();
                            ctx.lineTo(originalEvent.x, originalEvent.y);
                            ctx.stroke();
                        });

                        $(canvas).on("mouseleave", () => {
                            $(canvas).off("mousemove");
                            buildPreview();
                        });
                    });

                    $(canvas).on("mouseup", () => {
                        $(canvas).off("mousemove mouseleave");
                        buildPreview();
                    });

                    window.addEventListener("beforeunload", save);

                    setInterval(() => setGlobalBlob().then(save), 5000);
                    setInterval(setGlobalBlob, UPDATE_TIME);
                }

                xml.open("POST", "../server/alfascrapbook.php", true);
                xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xml.send(`uri=${$("input", modal.modal).val()}&op=load`);
                xml.onload = showScrapBook;
            }
        } else if (this === alfascrapbook_actions[2]) { // My AlfaScrapBooks

        }
    });
});