$("form").on("submit", e => {
	e.preventDefault();

	const xml = new XMLHttpRequest(),
		ra = $("input[name='ra']")[0],
		password = $("input[name='password']")[0];

	xml.open("POST", "xmlhttprequest/account.php", true);
	xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xml.send(`ra=${ra.value}&password=${password.value}&class=${$("select")[0].value}&city=${$("select")[1].value}`);

	xml.onload = () => {
		if (!xml.responseText) {
			ra.value = password.value = "";

			const toast = new Toast("RA ou senha incorreta(s)!", "background-color: red; font-size: 18px; font-weigth: bold;");
			toast.show();
			toast.destroy(2500);
		} else {
			const response = JSON.parse(xml.responseText);
			$(response).each((index, value) => {
				sessionStorage[btoa(index)] = btoa(value);
			});
			location.href = "chats/";
		}
	}
});