<?php
    if (strpos($reciever, "group") === false) {
        $sql = "SELECT * FROM `users` WHERE id = '$reciever'"; // Info on person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"]; // Their chat-list
        if (in_array($id, explode(",", $chats)) === false) { // If I'm not on his chat list.
            $chats .= ",$id"; // Adding me to their chat-list
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $reciever"; // DB update
            mysqli_query($conn, $sql);
        }
        
        $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Me.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"]; // My chat-list
        if (in_array($reciever, explode(",", $chats)) === false) { // If they're not on my chat-list. It needs to be ',$r' to avoid issues like "searching for an ID of '1' and finding 'group:11'"
            $chats .= ",$reciever"; // Adding them to my chat-list
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $id"; // DB update
            mysqli_query($conn, $sql);
        }
    
        $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Resetting session data (since I based the chat list on session variable.)
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        foreach($sql as $index => $value) {
            $_SESSION[$index] = $value;
        }
    }
    
    die();
?>