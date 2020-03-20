function newGroupMenu() {
    const side_menu_img = document.querySelector(".chat_selector header img");
    const new_group_menu = document.querySelector("#new_group_menu");

    side_menu_img.style.display = "initial";
    $(document.querySelector(".side_menu_visible")).fadeOut(100, () => {
        document.querySelector(".side_menu_bg").style.flex = 1;
        $("#new_group_menu input[type='text']")[0].value = "";
        new_group_menu.style.display = "flex";
    });
}

function settingsMenu() {
    const side_menu_img = document.querySelector(".chat_selector header img");

    side_menu_img.style.display = "initial";
    $(document.querySelector(".side_menu_visible")).fadeOut(100, () => {
        document.querySelector(".side_menu_bg").style.flex = 1;
        document.querySelector("#settings_menu").style.display = "flex";
    });
}