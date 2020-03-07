<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    session_start();

    require_once "../includes/db.inc.php";

    $s = $_SESSION["id"];
    $r = base64_decode($_POST["id"]); // ID of the person I'm talking to
    $c = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));
    $t = time();

    $sql = "INSERT INTO `messages` (sender, reciever, content, seen, time) VALUES ('$s', '$r', '$c', 0, '$t');";
    $sql = mysqli_query($conn, $sql);

    echo base64_decode($c);


    if (strpos($r, "group") === false) {
        $id = $_SESSION["id"]; // My ID
        $sql = "SELECT * FROM `users` WHERE id = '$r'"; // Info on person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"]; // Their chat-list
        if (in_array($id, explode(",", $chats)) === false) { // If I'm not on his chat list.
            $chats .= ",$id"; // Adding me to their chat-list
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $r"; // DB update
            mysqli_query($conn, $sql);
        }
        
        $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Me.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"]; // My chat-list
        if (in_array($r, explode(",", $chats)) === false) { // If they're not on my chat-list. It needs to be ',$r' to avoid issues like "searching for an ID of '1' and finding 'group:11'"
            $chats .= ",$r"; // Adding them to my chat-list
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