let group_name,
    group_pic;

$(document).ready(() => {
    const photo = $("#new_group_menu input[type='group_pic']")[0];
    $(photo).on("change", () => {
        if (photo.files.length < 1) {
            return;
        }

        $('#new_group_menu label img')[0].src = URL.createObjectURL(photo.files[0]);
        $('#new_group_menu label img')[0].style.maxWidth = "100%";

        group_pic = photo.files[0];
    })

    $("#new_group_menu")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        group_name = $(".modal_container .info input[type='text']")[0]
        if (!group_name.value) {
            group_name.style.borderBottom = "3px solid red";
            $(group_name).siblings().css("color", "red");
            group_name.addEventListener("focus", () => {
                group_name.style.borderBottom = "3px solid #291a46";
                $(group_name).siblings().css("color", "white");
            })
        } else {
            const xml = new XMLHttpRequest();
            xml.open("POST", "../server/new_group.php", true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xml.send("a=1");
            $("#new_group_menu_advanced header div").eq(1).html("");
            $("#new_group_menu").css("display", "none");
            $("#new_group_menu_advanced").css("display", "flex");
            xml.onload = () => {
                const response = JSON.parse(xml.responseText);
                let member_list = "";
                response.forEach(user => {
                    if (user["photo"] === null) {
                        user["photo"] = "assets/avatars/users/default.png";
                    }
                    member_list += `<div data-id='${user["id"]}' class='menu_icon' style='padding-left: 7px'><div class='pic'><img style='filter: brightness(100%)' src='${user["photo"]}' alt='Foto do usu&aacute;rio'></div><div class='info'><div style="font-weight: bold;">${user["name"]}</div><div>${user["status"]}</div></div></div>`
                })
                $("#new_group_menu_advanced main .members").html(member_list);
                let i = 0;
                $("#new_group_menu_advanced main .menu_icon").click(element => {
                    i++;
                    const menu_icon = element.currentTarget,
                        search_input = $("#new_group_menu_advanced header input")[0],
                        result_div = $("#new_group_menu_advanced header div")[1],
                        member_search_container = $("#member_search_container")[0];
                    if (menu_icon.getAttribute("data-member-id")) {
                        $(menu_icon).find(".pic").find("img")[0].style.border = "";
                        menu_icon.style.backgroundColor = "";
                        $(`span[data-member-id=${menu_icon.getAttribute("data-member-id")}]`).remove();
                        menu_icon.removeAttribute("data-member-id");
                        if ($(member_search_container).find("div")[0].children.length === 0) {
                            $(member_search_container).css("flex-direction", "row");
                            $(result_div).css("flex-wrap", "initial");
                            search_input.style.marginTop = 0;
                        }
                    } else {
                        $(menu_icon).find(".pic").find("img")[0].style.border = "3px solid white";
                        menu_icon.style.backgroundColor = "#291a46";
                        const new_member = document.createElement("span");
                        new_member.classList = "member_selection_balloon";
                        new_member.innerHTML = menu_icon.children[1].children[0].innerHTML.split(" ")[0];
                        menu_icon.setAttribute("data-member-id", i);
                        new_member.setAttribute("data-member-id", i);
                        $(result_div).append(new_member);
                        if (member_search_container.scrollWidth > member_search_container.clientWidth) {
                            $(member_search_container).css("flex-direction", "column");
                            $(result_div).css("flex-wrap", "wrap");
                            search_input.style.marginTop = "10px";
                        }
                        search_input.style.paddingLeft = "15px";
                    }
                })
            }
        }
    })

    const member_search = $("#new_group_menu_advanced input")[0],
        member_result_list = $("#new_group_menu_advanced .members_result")[0],
        member_list = $("#new_group_menu_advanced .members")[0];
    member_search.addEventListener("keyup", k => {
        if (!member_search.value || (member_search.value.length === 1 && k.keyCode === 78) || member_search.value === " ") {
            // If the input has no value OR (it's length is 1 AND user key is backspace) OR is the value is a spacebar
            member_result_list.setAttribute("hidden", ""); // Set hidden attribute
            member_list.removeAttribute("hidden"); // Removing original list's hidden attribute
            return; // Stopping the function
        }
        const xml = new XMLHttpRequest();
        xml.open("POST", "../server/chat_search.php", true);
        xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xml.send(`q=${member_search.value}`); // XML content is user input
        xml.onload = () => {
            member_result_list.innerHTML = ""; // Removing list's HTML to avoid duplicate results
            if (xml.responseText) {
                // If there's a valid response text
                const response = JSON.parse(xml.responseText);
                let result = "";
                response.forEach(user => {
                    if (user["photo"] === null) {
                        user["photo"] = "assets/avatars/users/default.png";
                    }
                    result += `<div data-id='${user["id"]}' class='menu_icon' style='padding-left: 7px'><div class='pic'><img style='filter: brightness(100%)' src='${user["photo"]}' alt='Foto do usu&aacute;rio'></div><div class='info'><div style="font-weight: bold;">${user["name"]}</div><div>${user["status"]}</div></div></div>`
                })
                $(member_result_list).html(result);
            } else {
                member_result_list.innerHTML += '<div class="no_result">Nenhum resultado encontrado.</div>'; // Showing "no result" banner
            }
            $(member_list).attr("hidden", ""); // Setting original list hidden attr
            member_result_list.removeAttribute("hidden");
        };
    })
    $("#new_group_menu_advanced")[0].addEventListener("submit", e => {
        e.preventDefault();

        if (!$(`span[data-member-id]`).length)
            return;

        let id_list = "";
        $(`span[data-member-id]`).each((index, user) => {
            id_list += atob($(`.menu_icon[data-member-id='${user.getAttribute("data-member-id")}']`)[0].getAttribute("data-id"));
            if (user !== $(`span[data-member-id]`)[$(`span[data-member-id]`).length - 1]) {
                id_list += ",";
            }
        });

        const xml = new XMLHttpRequest(),
            toast = new Toast("Criando grupo...");

        toast.show();

        xml.open("POST", "../server/new_group.php", true);

        if (group_pic) {
            const formData = new FormData();
            formData.set("p", group_pic);
            formData.set("m", id_list);
            formData.set("n", group_name.value);
            formData.set("a", "1");
            xml.send(formData);
        } else {
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xml.send(`m=${id_list}&n=${group_name.value}&a=1`);
        }

        xml.onload = () => {
            hideSideMenu();
            toast.update("Grupo criado com sucesso!").show().destroy(2500);
            setTimeout(() => $(`[data-id='${xml.responseText}']`).click(), 300);
        }
    })
})