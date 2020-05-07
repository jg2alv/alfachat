$(document).ready(() => {
	$(".chat_selector header img, #forum header img").on("click", showSideMenu);

	document.addEventListener("keydown", (k) => {
		if (k.keyCode === 27 && ($(".modal:visible").length || $(".side_menu:visible").length)) {
			hideSideMenu();
		}
	});
});

function showSideMenu() {
	setTimeout(() => $(".chat_selector header img, #forum header img").css("visibility", "hidden"), 50);

	$(".side_menu_bg").css("flex", "4 !important");
	$(".side_menu_visible").css("flex", "4 !important");
	$(".side_menu_visible").css("display", "flex");

	$(".side_menu").css("display", "flex").hide().fadeIn(300, () => {
		$(".side_menu_bg").on("click", hideSideMenu);
		$(".chats").on("keypress", hideSideMenu);
		$("#new_group").on("click", newGroupMenu);
		$("#config").on("click", settingsMenu);
	});
}

function hideSideMenu() {
	$(".side_menu_bg").off("click", hideSideMenu);
	$(".chats").off("keypress", hideSideMenu);
	$(".modal").css("display", "none");
	$(".side_menu_visible").css("flex", "4 !important");
	setTimeout(() => $(".chat_selector header img").css("visibility", ""), 150);
	$(".side_menu").fadeOut(300, () => {
		$(".chat_selector header img").on("click", showSideMenu);
		$("#subjects_menu").removeClass("subjects_menu_active");
		$("#subjects_menu img").css("transform", "");
		$("#subjects_menu div").eq(3).slideUp();
	});
}
