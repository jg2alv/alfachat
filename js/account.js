$("span[data-teacher]").on("click", e => {
	$("input").each((index, item) => {
		if ($(item).attr("type") !== "submit")
			item.value = ""
	})
	if (e.target.getAttribute("data-teacher") == 0) {
		$("input[name='ra']").attr("placeholder", "E-mail").removeAttr("minlength maxlength pattern inputmode").attr("type", "email");
		$("select").css("display", "none");
		$("br[data-teacher]").css("display", "none");
		$(e.target).html("Sou um aluno").attr("data-teacher", 1);
	} else {
		$("input[name='ra']").attr("placeholder", "RA").attr({minlength: 8, maxlength: 8, pattern: "[0-9]*", inputmode: "numeric"}).removeAttr("type");
		$("select").css("display", "initial");
		$("br[data-teacher]").css("display", "initial");
		$(e.target).html("Sou um professor").attr("data-teacher", 0);
	}
});

$("form").on("submit", e => {
	e.preventDefault();

	const xml = new XMLHttpRequest(),
		ra = $("input[name='ra']")[0],
		password = $("input[name='password']")[0],
		teacher = $("span[data-teacher]").attr("data-teacher");

	xml.open("POST", "xmlhttprequest/account.php", true);
	xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xml.send(`ra=${ra.value}&password=${password.value}&class=${$("select")[0].value}&city=${$("select")[1].value}&teacher=${teacher}`);

	xml.onload = () => {
		if (!xml.responseText) {
			ra.value = password.value = "";

			const toast = new Toast("Credenciais incorreta(s)!", "background-color: red; font-size: 18px; font-weigth: bold;");
			toast.show();
			toast.destroy(2500);
		} else {
			const response = JSON.parse(xml.responseText);
			Array.from(Object.keys(response)).forEach(key => sessionStorage[btoa(key)] = btoa(unescape(encodeURIComponent(response[key]))))
			location.href = "chats/";
		}
	}
});