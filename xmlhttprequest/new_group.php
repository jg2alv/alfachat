<?php

    if (empty($_POST["a"])) { // Safety
        header("Location: ../");
    }

    if (!empty($_POST["n"])) { // If I wanna set the group **name**
        setGroupName();
    } elseif (empty($_POST["n"]) && !empty($_POST["m"])) { // If I wanna add a member to the group
        addMembers();
    } else {
        getUserChatList(); // If POST[a] is filled but both POST[n] AND POST[m] aren't (safety again)
    }

    function setGroupName() {
        require "../includes/db.inc.php"; // Getting connection
        session_start(); // Starting session
        $created = time(); // Creation time
        $name = mysqli_real_escape_string($conn, $_POST["n"]); // Safety on group names
        $id = $_SESSION["id"]; // Getting user ID

        $sql = "INSERT INTO `groups` (`name`, `members`, `created`) VALUES ('$name', '$id', '$created')"; // Insert INTO groups table values: name, members (the user) and creation time
        mysqli_query($conn, $sql); // Querying

        $sql = "SELECT * FROM `groups` WHERE name = '$name' AND members = '$id' AND created = '$created'"; // Getting the new-born group ID
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $group_id = $sql["id"]; // Setting group ID to group_id

        $sql = "SELECT * FROM `users` WHERE id = $id"; // Getting creator's info
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"] . ",group:" . $group_id; // Adding new-born group to his chat-list
        $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $id"; // Updating the database (creator's info)
        mysqli_query($conn, $sql);
        die(); // Ending the connection
    }

    function addMembers() {}

    function getUserChatList() {
        require "../includes/db.inc.php"; // Getting connection
        session_start(); // Starting session
        $id = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE id = $id";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        echo "[";
        $chats = explode(",", $sql["chats"]);
        foreach($chats as $chat) {
            if (strpos($chat, ":") === false) {
                $sql = "SELECT * FROM `users` WHERE id = $chat";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                unset($sql["password"], $sql["id"], $sql["chats"], $sql["class"], $sql["email"], $sql["joined"], $sql["rg"], $sql["bio"]);
                echo json_encode($sql);
                if (end($chats) !== $chat) {
                    echo ",";
                }
            }
        }
        echo "]";
        die();
    }
?>