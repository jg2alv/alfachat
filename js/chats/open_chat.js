let id; // Setting global ID
let chats_updater;

$(document).ready(() => {
    statusTimer(); // Start timer when window (chats) loads
    statusBackend("i=online&o=set"); // Setting MY status to online
    messageSender();
    chatListUpdater();
    const header_input = document.querySelector(".chat_selector header input[type='text']");
    const chat_result_list = $(".chat_result_list")[0];
    const chat_list = $(".chat_list")[0];
    header_input.value = ""; // Removing input's value
    header_input.addEventListener("keyup", k => {
        // When user press any key, the result list will appear
        if (!header_input.value || (header_input.value.length === 1 && k.keyCode === 78) || header_input.value === " ") {
            // If the header has no value OR (it's length is 1 AND user key is backspace) OR is the value is a spacebar
            chat_result_list.setAttribute("hidden", ""); // Set hidden attribute
            chat_list.removeAttribute("hidden"); // Removing original list's hidden attribute
            return; // Stopping the function
        }
        $(chat_list).attr("hidden", ""); // Setting original list hidden attr
        const xml = new XMLHttpRequest();
        xml.open("POST", "../xmlhttprequest/chat_search.php", true);
        xml.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xml.send(`q=${header_input.value}`); // XML content is user input
        xml.onload = () => {
            chat_result_list.removeAttribute("hidden"); // Removing just to be sure
            chat_result_list.innerHTML = ""; // Removing list's HTML to avoid duplicate results
            if (xml.responseText) {
                // If there's a valid response text
                response = JSON.parse(xml.responseText); // Parsing JSON's server response text
                response.forEach(user => {
                    user["bio"] = !isNaN(header_input.value) ? user["rg"] : user["bio"];
                    addChat(user, chat_result_list)
                });
            } else {
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
                chat_result_list.style = "overflow-y: hidden !important";
            }
        };
    });
    const clip = $(".input_area label img")[0]; // Clips img
    clip.addEventListener("mouseover", () => { // Change img src
        clip.src = "assets/icons/file_hover.png";
    });
    clip.addEventListener("mouseout", () => {
        clip.src = "assets/icons/file.png";
    });
});

function openChat(e) {
    clearInterval(chats_updater);
    id = e.currentTarget.attributes["data-id"].value; // base64 id value. Example: 1; group:11 (in base64)

    if (id === e.currentTarget.children[1].children[0].getAttribute("data-id") && $(".chats:visible").length) { // If user clicked on the same chat, don't reload it.
        return;
    }

    statusBackend(`i=${id}&o=get`, e.currentTarget);
    $(".chats header div div")[0].setAttribute("data-id", id)

    $(".chat").attr("style", "background: #35215a"); // Removing "selected" background from every other div
    e.currentTarget.style.background = "#291a46"; // Setting background to a darker one, indicating "selected"

    const chat_result_list = $(".chat_result_list")[0];
    const chat_list = $(".chat_list")[0];
    if (chat_list.attributes["hidden"]) {
        const chats = atob(document.querySelector(".chat_list").attributes["data-chats"].value).split(",");
        if (chats.includes(atob(id))) {
            chat_result_list.setAttribute("hidden", ""); // Set hidden attribute
            chat_list.removeAttribute("hidden"); // Removing original list's hidden attribute
            document.querySelector(".chat_selector header input[type='text']").value = "";
            document.querySelector(`.chat_list div[data-id='${e.currentTarget.attributes["data-id"].value}']`).style.background = "#291a46";
        }
    }
    $(".choose_chat").remove(); // Removing "choose chat" balloon
    $(".input_area").attr("style", "display: grid");
    $(".chats header").attr("style", "display: flex");
    updateChats(true);
    $(".input_area input").focus();
    chats_updater = setInterval(updateChats, 300);
}