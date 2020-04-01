$(document).ready(() => {
    const side_menu_img = document.querySelector(".chat_selector header img");

    side_menu_img.addEventListener("click", showSideMenu);
    side_menu_img.addEventListener("mouseover", () => {
        side_menu_img.src = "assets/icons/menu_hover.png";
    })
    side_menu_img.addEventListener("mouseout", () => {
        side_menu_img.src = "assets/icons/menu.png";
    })

    if (atob(sessionStorage["cGhvdG8="]) != "null") {
        document.querySelector("#user_img").src = atob(sessionStorage["cGhvdG8="]);
    } else {
        document.querySelector("#user_img").src = "assets/avatars/user/default.png";
    }

    document.querySelector("#user_name").innerHTML = atob(sessionStorage["bmFtZQ=="]);
    document.querySelector("#user_rg").innerHTML = atob(sessionStorage["cmc="]);

    document.addEventListener("keydown", k => {
        if (k.keyCode === 27 && ($(".submenu:visible").length || $(".side_menu:visible").length)) {
            hideSideMenu();
        }
    })
})

function showSideMenu() {
    const side_menu = document.querySelector(".side_menu");
    const side_menu_img = document.querySelector(".chat_selector header img");

    setTimeout(() => {
        side_menu_img.style.display = "none";
    }, 50)

    if (!$(".chats:visible").length) { // Mobile
        $(".side_menu_bg")[0].style.flex = $(".side_menu_visible")[0].style.flex = 1;
    } else {
        $(".side_menu_bg")[0].style.flex = 4
        $(".side_menu_visible").css("flex", 1)
        $(".side_menu_visible").css("display", "flex");
    }

    $(side_menu).css("display", "flex").hide().fadeIn(300, () => {
        document.querySelector(".side_menu_bg").addEventListener("click", hideSideMenu);
        document.querySelector(".chats").addEventListener("keypress", hideSideMenu);
        document.querySelector("#new_group").addEventListener("click", newGroupMenu);
        document.querySelector("#config").addEventListener("click", settingsMenu);
    });
}

function hideSideMenu() {
    const side_menu_img = document.querySelector(".chat_selector header img");

    side_menu_img.style.display = "initial";
    document.querySelector(".side_menu_bg").removeEventListener("click", hideSideMenu);
    document.querySelector(".chats").removeEventListener("keypress", hideSideMenu);
    $(".submenu").css("display", "none");
    document.querySelector(".side_menu_visible").style.flex = 1;
    $(document.querySelector(".side_menu")).fadeOut(300, () => {
        side_menu_img.addEventListener("click", showSideMenu);
    })
}