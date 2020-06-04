function fetch_doubts(subject = false) {
    const xml = new XMLHttpRequest();
    xml.open("POST", "../server/forum.php", true);
    xml.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xml.send(subject ? `subject=${encodeURIComponent(atob(subject))}` : null);

    return new Promise(resolve => {
        xml.onload = () => {
            forum_doubts = JSON.parse(xml.responseText);
            resolve();
        }
    });
}