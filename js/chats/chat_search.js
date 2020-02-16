$(document).ready(() => {
    const xml = new XMLHttpRequest(); // Setting constant
    const header_input = document.querySelector(".chat_selector header input[type='text']");
    const chat_result_list = $(".chat_result_list")[0];
    const chat_list = $(".chat_list")[0];
    header_input.value = ""; // Removing input's value
    header_input.addEventListener("keyup", k => {
        // When user press any key, the result list will appear
        if (
            !header_input.value ||
            (header_input.value.length == 1 && k.keyCode == 78) ||
            header_input.value == " "
        ) {
            // If the header has no value OR (it's length is 1 AND user key is backspace) OR is the value is a spacebar
            chat_result_list.setAttribute("hidden", ""); // Set hidden attribute
            chat_list.removeAttribute("hidden"); // Removing original list's hidden attribute
            return; // Stopping the function
        }
        $(chat_list).attr("hidden", ""); // Setting original list hidden attr
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
                    if (!isNaN(header_input.value)) {
                        user["bio"] = user["rg"]; // If user is searching other user's RG
                    }

                    if (user["photo"] == "0") {
                        // If user don't have a profile pic
                        user["photo"] = "assets/avatars/user/default.png";
                    }

                    if (!user["bio"]) {
                        user["bio"] = "";
                    }

                    chat_result_list.innerHTML += `<div class="chat" data-id="${btoa(
                        user["id"]
                    )}"><div class="chat_pic"><img src="${
                        user["photo"]
                    }"></div><div class="chat_info"><div>${
                        user["name"]
                    }</div><div>${user["bio"]}</div></div></div>`;
                    addChatsEventListeners();
                });
            } else {
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
                chat_result_list.style = "overflow-y: hidden !important";
            }
        };
    });
});
