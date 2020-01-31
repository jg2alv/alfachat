let xml = new XMLHttpRequest()
$(document).ready(() => {
    const rg = (document.querySelector("input[name='rg']")).value
    const submit = document.querySelector("button")
    submit.addEventListener("click", () => {
        xml.open("POST", "login.php", true)
        xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xml.send("rg=" + rg)
    })
})

xml.onload = function () {
    if (Number(this.responseText) >= 1) {
        password = document.querySelectorAll("input")[3]
        lineBreak = document.querySelectorAll("br")
        button = document.querySelector("button")
        lineBreak[2].setAttribute("hidden")
        password.removeAttribute("hidden")
        lineBreak[6].removeAttribute("hidden")
        button.innerHTML = "Entrar"
    } else {
        children = document.querySelector(".form").children
        button = document.querySelector("button")
        for (i = 0; i < children.length; i++) {
            children[i].removeAttribute("hidden")
        }
        button.innerHTML = "Criar conta"
        /* button.addEventListener("click", () => {
         ...
        }) */
    }
}