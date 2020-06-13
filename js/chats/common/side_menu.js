$(document).ready(() => $(".chat_selector header img:nth-of-type(1), #forum header img:nth-of-type(1)").on("click", showSideMenu));

function showSideMenu() {
	setTimeout(() => $(".chat_selector header img, #forum header img, #forum main .subject_list .menu_icon img, #forum .input_area img:first").css("visibility", "hidden"), 50);

	$(document).off("keydown").on("keydown", ({ keyCode }) => keyCode === 27 && ($(".modal:visible").length || $(".side_menu:visible").length) ? hideSideMenu() : null);

	$(".side_menu_bg").css("flex", "4 !important");
	$(".side_menu_visible").css("flex", "4 !important");
	$(".side_menu_visible").css("display", "flex");
	$(".side_menu").css("display", "flex").hide().fadeIn(300, () => {
		$(".side_menu_bg").off("click").on("click", hideSideMenu);
		$(".chats").off("keypress").on("keypress", hideSideMenu);
		$("#new_group").off("click").on("click", newGroupMenu);
		$("#config").off("click").on("click", () => {
			$(".chat_selector header img").css("display", "initial");
    		$(document.querySelector(".side_menu_visible")).fadeOut(100, () => $("#settings_menu").css("display", "flex"));
		});
	});
}

function hideSideMenu() {
	$(".side_menu_bg").off("click", hideSideMenu);
	$(".chats").off("keypress", hideSideMenu);
	$(".modal").hide();
	$(".side_menu_visible").css("flex", "4 !important");
	$(".chat_selector header img").on("click", showSideMenu);

	setTimeout(() => $(".chat_selector header img, #forum header img, #forum main .subject_list .menu_icon img, #forum .input_area img:first").css("visibility", "visible"), 150);

	return new Promise(resolve => {
		$(".side_menu").fadeOut(300, () => {
			$(".side_menu div[id*='menu']").each(function() {
				const img = $("img[src*='play.png']", this);
		
				if (!img.length || $(img).css("transform") === "none") return;
				dropDownMenu(this, $("div", this).eq(3));
			});

			resolve();
		});
	});
}
