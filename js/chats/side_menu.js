$(document).ready(() => $(".chat_selector header img:nth-of-type(1), #forum header img:nth-of-type(1)").on("click", showSideMenu));

function showSideMenu() {
	setTimeout(() => $(".chat_selector header img, #forum header img, #forum main .subject_list .menu_icon img, #forum .input_area img:first").css("visibility", "hidden"), 50);

	$(document).on("keydown", k => k.keyCode === 27 && ($(".modal:visible").length || $(".side_menu:visible").length) ? hideSideMenu() : null);

	$(".side_menu_bg").css("flex", "4 !important");
	$(".side_menu_visible").css("flex", "4 !important");
	$(".side_menu_visible").css("display", "flex");
	$(".side_menu").css("display", "flex").hide().fadeIn(300, () => {
		$(".side_menu_bg").on("click", hideSideMenu);
		$(".chats").on("keypress", hideSideMenu);
		$("#new_group").on("click", newGroupMenu);
		$("#config").on("click", () => {
			$(".chat_selector header img").css("display", "initial");
    		$(document.querySelector(".side_menu_visible")).fadeOut(100, () => $("#settings_menu").css("display", "flex"));
		});
	});
}

function hideSideMenu() {
	$(".side_menu_bg").off("click", hideSideMenu);
	$(".chats").off("keypress", hideSideMenu);
	$(".modal").css("display", "none");
	$(".side_menu_visible").css("flex", "4 !important");

	setTimeout(() => $(".chat_selector header img, #forum header img, #forum main .subject_list .menu_icon img, #forum .input_area img:first").css("visibility", "visible"), 150);

	return new Promise(resolve => {
		$(".side_menu").fadeOut(300, () => {
			$(".chat_selector header img").on("click", showSideMenu);
			$("#subjects_menu").removeClass("subjects_menu_active");
			$("#subjects_menu img").css("transform", "");
			$("#subjects_menu div").eq(3).slideUp();
			resolve();
		});
	});
}
