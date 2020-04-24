$(document).ready(() => {
	$('#settings_menu .settings_header_btns img')[1].addEventListener('click', hideSideMenu);

	$('#settings_menu .settings_header_btns img')[0].addEventListener('click', () => {
		if ($('#settings_menu_header_drop_down').css('display') === 'block') {
			$('#settings_menu_header_drop_down').fadeOut(200);
		}
		else {
			$('#settings_menu_header_drop_down').fadeIn(200, () => {
				setTimeout(() => {
					$('#settings_menu').click(() => {
						$('#settings_menu').off('click');
						$('#settings_menu_header_drop_down').fadeOut(200);
					});
				}, 50);
			});
		}
	});

	$('#settings_menu_header_drop_down span').eq(0).click(() => {
		location.href += '?log_out=1';
	});

	$('.settings_menu_user_area .pic img')[0].src = (atob(sessionStorage['cGhvdG8=']) != 'null') ? atob(sessionStorage['cGhvdG8=']) : $('.settings_menu_user_area .pic img')[0].src = 'assets/avatars/users/default.png';

	$('.settings_menu_user_area .info div').eq(0).html(decodeURIComponent(escape(atob(sessionStorage["bmFtZQ=="]))));
	$('.settings_menu_user_area .info div').eq(1).html(atob(sessionStorage['cmE=']));

	$('.edit_profile').click(() => {
		const edit_profile = $('#settings_menu > *[hidden]');
		const default_settings = $('#settings_menu > *:not([hidden])');
		default_settings.attr('hidden', 1);
		edit_profile.removeAttr('hidden');
		$('#settings_menu_back').click(() => {
			default_settings.removeAttr('hidden');
			edit_profile.attr('hidden', 1);
		});
		$('#settings_menu_close').click(() => {
			hideSideMenu();
			default_settings.removeAttr('hidden');
			edit_profile.attr('hidden', 1);
		});
	});

	$('#settings_menu_advanced_profile_pic')[0].src = (atob(sessionStorage['cGhvdG8=']) != 'null') ? atob(sessionStorage['cGhvdG8=']) : $('#settings_menu_advanced_profile_pic')[0].src = 'assets/avatars/users/default.png';

	// $('#settings_menu_name').html(atob(sessionStorage['bmFtZQ==']));		**REPLACE WITH PHP**
	// $("#settings_menu_ra").html(atob(sessionStorage['cmE=']));			**REPLACE WITH PHP**

	const photo = $("#settings_menu input[type='file']")[0];
	$(photo).on("change", () => {
		if (photo.files.length < 1) {
            return;
		}
		
		$('#settings_menu_advanced_profile_pic')[0].src = URL.createObjectURL(photo.files[0]);

        const formData = new FormData();
		formData.set("user_photo", photo.files[0]);
		formData.set("f", "photo");

		const xml = new XMLHttpRequest();
        xml.open("POST", "../xmlhttprequest/settings_menu.php", true);
		xml.send(formData);
	})
});
