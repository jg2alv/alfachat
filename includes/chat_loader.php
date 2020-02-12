<?php
    if (!defined("CHAT_LOADER")) {
        header("Location: ../"); // If user tries to access directly
    }

    $conn = mysqli_connect('localhost', 'root', '', 'AlfaChat'); // Database connection

    function getClassChat($class, $conn) {
        $sql = "SELECT * FROM `classes` WHERE id = '$class'"; // Get user's class
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $name = $sql["name"];
        $description = "Turma do ". str_replace("-", "do", $name);
        return "<div class='chat' data-id='" . base64_encode("class") . "'><div class='chat_pic'><img style='border-radius: 0;' src='../chats/assets/class_avatars/$class.png'></div><div class='chat_info'><div>$name</div><div>$description</div></div></div>";
    }

    $id = $_COOKIE["id"]; // Getting user id
    $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Selecting logged user
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);
    $class = $sql["class"];
    echo "<div class='chat_list'>"; // Starts div. **JS will break if this is removed**
    echo getClassChat($class, $conn);
    if ($sql["chats"]) { // 'chats' is either NULL or a specific value. DO NOT USE !empty() because it'll never be empty.
        $chats = explode(",", $sql["chats"]); // Getting all chats
        foreach ($chats as $user) {
            $sql = "SELECT * FROM `users` WHERE id = '$user'"; // 'chats' row will now store user IDs.
            $sql = mysqli_query($conn, $sql);
            $user_info = mysqli_fetch_assoc($sql);
            if (!$user_info["photo"]) {
                $photo = "../chats/assets/user_avatars/default.png"; // If user doesn't have a photo
            } else {
                $photo = $user_info["photo"];
            }
            $name = $user_info["name"];
            $bio = $user_info["bio"]; // Users now have a bio :)
            echo "<div class='chat' data-id='" . base64_encode($user_info["rg"]) . "'><div class='chat_pic'><img src='$photo'></div><div class='chat_info'><div>$name</div><div>$bio</div></div></div>";
        }
    }
    echo "</div>"; // Close chat_list div.
?>