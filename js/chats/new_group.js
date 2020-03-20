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
                    user_front += `<div class='menu_icon' style='padding-left: 0'><div class='pic'><img style='filter: brightness(100%)' src='${user["photo"]}' alt='Foto do usu&aacute;rio'></div><div class='info'><div>${user["name"]}</div><div>${user["status"]}</div></div></div>`
                })
                $("#new_group_menu_advanced main").html(user_front);
                $("#new_group_menu_advanced main .menu_icon").click((element) => {
                    $(element.currentTarget).find("img").css("border", "3px solid blue");
                })
            }
        }
    })
})