$(document).ready(() => {
    $("#subjects_menu div").eq(0).on("click", () => dropDownMenu($("#subjects_menu"), $("#subjects_menu div").eq(3)));
    $("#alfascrapbooks_menu div").eq(0).on("click", () => dropDownMenu($("#alfascrapbooks_menu"), $("#alfascrapbooks_menu div").eq(3)));
});