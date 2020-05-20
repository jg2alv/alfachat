(() => {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/get_doubt.php", true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send(`cred=${JSON.stringify([atob(sessionStorage["aWQ="]), atob(sessionStorage["cGFzc3dvcmQ="])])}`);

    xml.onload = () => {
        $(".chats").css("grid-template-rows", "1fr 9fr");
        $('.input_area').css('display', 'flex');
        $('.chats header').css('display', 'flex');
        $('.input_area textarea').focus();
        teacher_doubts = JSON.parse(xml.responseText);
    };
})()