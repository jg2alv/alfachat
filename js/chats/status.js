function statusTimer() {
    let timer = 0;
    const msg = "o=set&i=Visto%20pela%20última%20vez%20há%20"; // Setting default message
    setInterval(() => {
        statusBackend(`i=${id}&o=get`); // Getting user's classes status & setting on frontend.
        timer += 1; // Adding to timer (seconds)
        switch (true) {
            case timer >= 1 && timer < 6: // If timer is between 1 and 5 (both included) seconds
                statusBackend("i=Visto%20pela%20última%20vez%20agora%20mesmo&o=set"); // Override default message
                break;
            case timer >= 60 && timer < 120: // If timer is more than a minute and less than two
                statusBackend(`${msg}1%20minuto`); // Seen one minute ago
                break;
            case timer >= 120 && timer < 600: // If timer if more than two minutes but less than 10
                statusBackend(`${msg + Math.floor(timer / 60)}%20minutos`); // Seen N minutes ago
                break;
            case timer >= 600: // If timer marks more than 10 mintutes
                statusBackend("i=offline&o=set"); // Offline if user isn't present for 10 minutes.
                break;
        }
    }, 1000);
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
    if (arg.indexOf("get") > -1) // If this is a GET operation
        return new Promise(resolve => xml.onload = () => resolve(xml.responseText));
}