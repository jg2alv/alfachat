const xml = new XMLHttpRequest(); // Setting constant

$(document).ready(() => {
    const header_input = document.querySelector("header input");
    const chat_result_list = $(".chat_result_list")[0];
    const chat_list = $(".chat_list")[0];
    header_input.value = ""; // Removing input's value
    header_input.addEventListener("keyup", k => {
        chat_result_list.removeAttribute("style"); // When user press any key, the result list will appear
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
                for (let i = 0; i < Object.keys(response).length; i++) {
                    // Looping on response
                    let user = response[i];
                    if (user["photo"] == "0") {
                        // If user don't have a profile pic
                        user["photo"] = "assets/user_avatars/default.png";
                    } else {
                        user["photo"] = user["photo"].substr(9); // Removing extra path
                    }
                    chat_result_list.innerHTML += `<div class="chat_result"><div class="chat_result_pic"><img src="${
                        user["photo"]
                    }"></div><div class="chat_result_info"><div>${
                        user["name"]
                    }</div><div>${String(user["bio"]).replace(
                        "null",
                        ""
                    )}</div></div></div>`;
                }
            } else {
                chat_result_list.innerHTML += `<div style="height: calc(93vh - 20px)"><div class="no_result">Nenhum resultado encontrado.</div></div>`; // Showing "no result" banner
                chat_result_list.style.overflowY = "hidden";
            }
        };
    });
});
