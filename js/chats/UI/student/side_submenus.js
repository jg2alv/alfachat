function newGroupMenu() {
    const side_menu_img = document.querySelector(".chat_selector header img");
    const new_group_menu = document.querySelector("#new_group_menu");

    side_menu_img.style.display = "initial";
    $(document.querySelector(".side_menu_visible")).fadeOut(100, () => {
        $("#new_group_menu input[type='text']")[0].value = "";
        new_group_menu.style.display = "flex";
        $('#new_group_menu label img')[0].src = "assets/icons/camera.png";
        $('#new_group_menu label img')[0].style.maxWidth = "";
    });
}