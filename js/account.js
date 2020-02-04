let xml = new XMLHttpRequest();
let rg;
let submit;
let form;
let select;

$(document).ready(() => {
    rg = document.querySelector("input[name='rg']");
    submit = document.querySelector("input[type='submit'");
    form = document.querySelector("form");
    select = document.querySelector("select");
    form.addEventListener("submit", checkUser);
});

function checkUser(event) {
    event.preventDefault();
    xml.addEventListener("load", handleLogin);
    xml.open("POST", "xmlhttprequest/account.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send("rg=" + rg.value + "&class=" + select.value + "&o=check");
}

function handleLogin() {
    xml.removeEventListener("load", handleLogin);
    form.removeEventListener("submit", checkUser);
    if (Number(xml.responseText) >= 1) {
        password = document.querySelectorAll("input")[3];
        lineBreak = document.querySelectorAll("br");
        lineBreak[3].removeAttribute("hidden");
        password.removeAttribute("hidden");
        password.setAttribute("required", "");
        lineBreak[6].removeAttribute("hidden");
        lineBreak[7].removeAttribute("hidden");
        submit.value = "Entrar";
        form.addEventListener("submit", handleOperation);
    } else {
        children = document.querySelector("form").children;
        for (i = 0; i < children.length; i++) {
            children[i].removeAttribute("hidden");
            if (children[i].placeholder != "") {
                children[i].setAttribute("required", "");
            }
        }
        submit.value = "Criar conta";
        form.addEventListener("submit", handleOperation);
    }
}

function handleOperation(event) {
    event.preventDefault();
    form.removeEventListener("submit", handleOperation);
    $("span").remove();
    $("br[data-dynamic='true']").remove();
    let name = document.querySelector("input[name='name']");
    let email = document.querySelector("input[name='email']");
    let password = document.querySelector("input[name='password']");
    xml.addEventListener("load", redirectFromLogin);
    xml.open("POST", "xmlhttprequest/account.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (submit.value == "Criar conta") {
        xml.send("name=" + name.value + "&rg=" + rg.value + "&email=" + email.value + "&password=" + password.value + "&class=" + select.value + "&o=create");
    } else if (submit.value == "Entrar") {
        xml.send("rg=" + rg.value + "&password=" + password.value + "&class=" + select.value + "&o=login");
    }
}

function redirectFromLogin() {
    if (xml.responseText) {
        window.location.href = "chats/";
    } else {
        password = document.querySelector("input[type='password'");
        submitText = submit.value;
        submitButton = document.createElement("input");
        submitButton.value = submitText;
        submitButton.type = "submit";
        form.addEventListener("submit", handleOperation);
        wrongLogin = document.createElement("span");
        wrongLogin.style = "color: red; font-size: small";
        wrongLogin.innerHTML =
            "N&uacute;mero de matr&iacute;cula ou senha inv&aacute;lida(s)!";
        lineBreak = document.createElement("br");
        lineBreak.setAttribute("data-dynamic", "true");
        $("input[type='submit']").remove();
        password.value = "";
        $("div.form").append(wrongLogin);
        $("div.form").append(lineBreak);
        $("div.form").append(submitButton);
    }
}