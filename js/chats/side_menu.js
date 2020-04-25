$(document).ready(() => {
	const side_menu_img = document.querySelector(".chat_selector header img");

	side_menu_img.addEventListener("click", showSideMenu);

	document.addEventListener("keydown", (k) => {
		if (k.keyCode === 27 && ($(".submenu:visible").length || $(".side_menu:visible").length)) {
			hideSideMenu();
		}
	});
});

function showSideMenu() {
	const side_menu = document.querySelector(".side_menu");
	const side_menu_img = document.querySelector(".chat_selector header img");

	setTimeout(() => side_menu_img.style.visibility = "hidden", 50);

	$(".side_menu_bg")[0].style.flex = 4;
	$(".side_menu_visible").css("flex", 1);
	$(".side_menu_visible").css("display", "flex");

	$(side_menu).css("display", "flex").hide().fadeIn(300, () => {
		document.querySelector(".side_menu_bg").addEventListener("click", hideSideMenu);
		document.querySelector(".chats").addEventListener("keypress", hideSideMenu);
		document.querySelector("#new_group").addEventListener("click", newGroupMenu);
		document.querySelector("#config").addEventListener("click", settingsMenu);
	});
}

function hideSideMenu() {
	const side_menu_img = document.querySelector(".chat_selector header img");

	document.querySelector(".side_menu_bg").removeEventListener("click", hideSideMenu);
	document.querySelector(".chats").removeEventListener("keypress", hideSideMenu);
	$(".submenu").css("display", "none");
	document.querySelector(".side_menu_visible").style.flex = 1;
	setTimeout(() => side_menu_img.style.visibility = "", 150);
	$(document.querySelector(".side_menu")).fadeOut(300, () => {
		side_menu_img.addEventListener("click", showSideMenu);
		$("#teachers_menu").removeClass("teachers_menu_active");
		$("#teachers_menu img")[0].style.transform = "";
		$("#teachers_menu div").eq(3).slideUp();
	});
}
