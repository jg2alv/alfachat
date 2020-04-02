$(document).ready(() => {
    const session = JSON.parse($("input[type='hidden']")[0].value);
    const keys = Object.keys(session);
    keys.forEach(key => {
        sessionStorage[btoa(key)] = btoa(session[key]);
    });
    $("input[type='hidden']").remove();
})