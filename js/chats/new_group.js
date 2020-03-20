$(document).ready(() => {
    $("#new_group_menu")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const group_name = $(".submenu_container .info input[type='text']")[0]
        if (!group_name.value) {
            group_name.style.borderBottom = "3px solid red";
            $(group_name).siblings().css("color", "red");
            group_name.addEventListener("focus", () => {
                group_name.style.borderBottom = "3px solid #291a46";
                $(group_name).siblings().css("color", "white");
            })
        } else {
            
        }
    })
})