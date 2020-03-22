$(document).ready(() => {
    $("#new_group_menu")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const group_name = $(".submenu_container .info input[type='text']")[0]
        if (!group_name.value) {
            group_name.style.borderBottom = "3px solid red";
            $(group_name).siblings().css("color", "red");
            group_name.addEventListener("focus", () => {
                group_name.style.borderBottom = "3px solid #291a46";
                $(group_name).siblings().css("color", "white");
            })
        } else {
            const xml = new XMLHttpRequest();
            xml.open("POST", "../xmlhttprequest/new_group.php", true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            //xml.send(`n=${group_name.value}&a=1`);
            $("#new_group_menu").css("display", "none");
            $("#new_group_menu_advanced").css("display", "flex");
            xml.open("POST", "../xmlhttprequest/new_group.php", true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xml.send("a=1");
            xml.onload = () => {
                const response = JSON.parse(xml.responseText);
                let user_front = "";
                response.forEach(user => {
                    user["photo"] = user["photo"] ? user["photo"] : "assets/avatars/user/default.png";
                    user_front += `<div class='menu_icon' style='padding-left: 7px'><div class='pic'><img style='filter: brightness(100%)' src='${user["photo"]}' alt='Foto do usu&aacute;rio'></div><div class='info'><div style="font-weight: bold;">${user["name"]}</div><div>${user["status"]}</div></div></div>`
                })
                $("#new_group_menu_advanced main").html(user_front);
                let i = 0;
                $("#new_group_menu_advanced main .menu_icon").click(element => {
                    i++;
                    const menu_icon = element.currentTarget;
                    const search_input = $("#new_group_menu_advanced header input")[0];
                    const result_div = $("#new_group_menu_advanced header div")[1];
                    const member_search_container = $("#member_search_container")[0];
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
})