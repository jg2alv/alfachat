window.onload = () => {
    setStatusBack("s=online&o=set"); // Set user status to online
    setTimer(); // Start updater
};

function setTimer() {
    let timer = 0;
    let msg = "o=set&s=Visto%20pela%20última%20vez%20há%20"; // Setting default message
    setInterval(() => {
        timer += 10; // Adding to timer (seconds)
        switch (true) {
            case timer >= 30 && timer < 60:
                setStatusBack(
                    "s=Visto%20pela%20última%20vez%20agora%20mesmo&o=set" // Override default message
                );
                break;
            case timer >= 60 && timer < 120:
                setStatusBack(`${msg}1%20minuto`); // Seen one minute ago
                break;
            case timer >= 120 && timer < 600:
                setStatusBack(`${msg + Math.floor(timer / 60)}%20minutos`); // Seen N minutes ago
                break;
            case timer >= 600:
                setStatusBack("s=offline&o=set"); // Offline if user isn't present for 10 minutes.
                break;
        }
        setStatusFront(id); // Updating page
    }, 10000);
    document.onmousemove = document.onkeypress = document.onclick = () => {
        timer = 0;
        setStatusBack("s=online&o=set"); // If user interacts with page, set status to online and timer to 0
    };
}

function setStatusBack(arg) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/status.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(`i=${arg}&o=set`); // Send request with message
}

function setStatusFront(id) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/status.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(`i=${id}&o=check`); // Returns status (or number of members, if group)
    xml.onload = () => {
        $(".chats header div")[1].innerHTML = xml.responseText; // Sets it on page
    };
}
