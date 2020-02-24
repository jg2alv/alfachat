window.onload = () => {
    statusTimer(); // Start timer when window (chats) loads
    statusBackend("i=online&o=set"); // Setting MY status to online
};

function statusTimer() {
    let timer = 0;
    const msg = "o=set&i=Visto%20pela%20última%20vez%20há%20"; // Setting default message
    setInterval(() => {
        statusBackend(`i=${id}&o=get`); // Getting user's/ classe's status & setting on frontend.
        timer += 10; // Adding to timer (seconds)
        switch (true) {
            case timer >= 30 && timer < 60:
                statusBackend(
                    "i=Visto%20pela%20última%20vez%20agora%20mesmo&o=set" // Override default message
                );
                break;
            case timer >= 60 && timer < 120:
                statusBackend(`${msg}1%20minuto`); // Seen one minute ago
                break;
            case timer >= 120 && timer < 600:
                statusBackend(`${msg + Math.floor(timer / 60)}%20minutos`); // Seen N minutes ago
                break;
            case timer >= 600:
                statusBackend("i=offline&o=set"); // Offline if user isn't present for 10 minutes.
                break;
        }
    }, 10000);
    document.onmousemove = document.onkeypress = document.onclick = () => {
        timer = 0;
        statusBackend("i=online&o=set"); // Setting MY status to online
        statusBackend(`i=${id}&o=get`); // Refreshing frontend
    };
}

function statusBackend(arg) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../xmlhttprequest/status.php", true);
    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xml.send(arg); // Sending request with given args
    if (arg.indexOf("get") > -1) { // If this is a GET operation
        xml.onload = () => {
            document.querySelectorAll(".chats header div")[1].innerHTML = xml.responseText; // Setting result on frontend
        };
    }
}