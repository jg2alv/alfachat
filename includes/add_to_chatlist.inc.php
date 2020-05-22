<?php
    function addToChatList($receiver) {
        require "db.inc.php";
        $id = $_SESSION["id"];

        if (strpos($receiver, ":") !== false) return;

        $sql = "SELECT * FROM `users` WHERE id = '$receiver'"; // Info on person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"]; // Their chat-list
        if (in_array($id, explode(",", $chats)) === false) { // If I'm not on his chat list.
            $chats .= ",$id"; // Adding me to their chat-list
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $receiver"; // DB update
            mysqli_query($conn, $sql);
        }

        $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Me.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"]; // My chat-list
        if (in_array($receiver, explode(",", $chats)) === false) { // If they're not on my chat-list. It needs to be ',$r' to avoid issues like "searching for an ID of '1' and finding 'group:11'"
            $chats .= ",$receiver"; // Adding them to my chat-list
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $id"; // DB update
            mysqli_query($conn, $sql);
        }

        $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Resetting session data (since I based the chat list on session variable.)
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        foreach($sql as $index => $value) {
            $_SESSION[$index] = $value;
        }

        die();
    }
?>