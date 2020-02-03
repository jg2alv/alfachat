let xml = new XMLHttpRequest();
let rg;
let submit;
let select;

$(document).ready(() => {
    rg = document.querySelector("input[name='rg']");
    submit = document.querySelector("button");
    select = document.querySelector("select");
    colorInputs(0);
    submit.addEventListener("click", checkUser);
});

function checkUser() {
    if (!rg.value) {
        rg.style.boxShadow = "0 0 3pt 2pt red";
    } else {
        xml.addEventListener("load", handleLogin);
        xml.open("POST", "xmlhttprequest/account.php", true);
        xml.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xml.send("rg=" + rg.value + "&class=" + select.value + "&o=check");
    }
}

function colorInputs(method) {
    if (!method) {
        inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            input.addEventListener("focus", () => {
                input.style.boxShadow = "none";
            });
        });
        return;
    } else {
        inputs = document.querySelectorAll("input");
        for (i = 0; i < inputs.length; i++) {
            // forEach is a function by itself. The return statement would only exit **the forEach**, not the whole eventListener
            inputs[i].style.boxShadow = "none";
            if (!inputs[i].value) {
                inputs[i].style.boxShadow = "0 0 3pt 2pt red";
                if (i == inputs.length - 1) {
                    return 0;
                }
            }
        }
        return true;
    }
}

function submitClick() {
    $("span").remove();
    $("br[data-dynamic='true']").remove();
    if (!colorInputs(1)) {
        return;
    }
    let name = document.querySelector("input[name='name']");
    let email = document.querySelector("input[name='email']");
    let password = document.querySelector("input[name='password']");
    xml.open("POST", "xmlhttprequest/account.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (submit.innerHTML == "Criar conta") {
        xml.send(
            "name=" +
                name.value +
                "&rg=" +
                rg.value +
                "&email=" +
                email.value +
                "&password=" +
                password.value +
                "&class=" +
                select.value +
                "&o=create"
        );
    } else if (submit.innerHTML == "Entrar") {
        xml.send(
            "rg=" +
                rg.value +
                "&password=" +
                password.value +
                "&class=" +
                select.value +
                "&o=login"
        );
    }
    xml.addEventListener("load", redirectFromLogin);
}

function handleLogin() {
    xml.removeEventListener("load", handleLogin);
    submit.removeEventListener("click", checkUser);
    rg.style.boxShadow = "none";
    if (Number(xml.responseText) >= 1) {
        password = document.querySelectorAll("input")[3];
        lineBreak = document.querySelectorAll("br");
        lineBreak[3].removeAttribute("hidden");
        password.removeAttribute("hidden");
        lineBreak[6].removeAttribute("hidden");
        lineBreak[7].removeAttribute("hidden");
        submit.innerHTML = "Entrar";
        colorInputs(0);
        submit.addEventListener("click", submitClick);
    } else {
        children = document.querySelector(".form").children;
        for (i = 0; i < children.length; i++) {
            children[i].removeAttribute("hidden");
        }
        submit.innerHTML = "Criar conta";
        colorInputs(0);
        submit.addEventListener("click", submitClick);
    }
}

function redirectFromLogin() {
    if (xml.responseText) {
        window.location.href = "chats/";
    } else {
        password = document.querySelector("input[type='password'");
        submitText = submit.innerHTML;
        submitButton = document.createElement("button");
        submitButton.innerHTML = submitText;
        submitButton.addEventListener("click", submitClick);
        wrongLogin = document.createElement("span");
        wrongLogin.style = "color: red; font-size: small";
        wrongLogin.innerHTML =
            "N&uacute;mero de matr&iacute;cula ou senha inv&aacute;lida(s)!";
        lineBreak = document.createElement("br");
        lineBreak.setAttribute("data-dynamic", "true");
        $("button").remove();
        password.value = "";
        $("div.form").append(wrongLogin);
        $("div.form").append(lineBreak);
        $("div.form").append(submitButton);
    }
}
