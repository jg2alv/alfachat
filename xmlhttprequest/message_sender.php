<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    session_start();

    require "../includes/db.inc.php";
    require "../includes/add_to_chatlist.inc.php";

    $sender = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]); // ID of the person I'm talking to
    $time = time();

    if (strpos($receiver, "teacher") !== false) {
        $receiver = explode(":", $receiver)[1];
        $content = json_decode($_POST["m"]);
        $doubt = "";
        $subject = $_POST["subject"];

        foreach($content as $msg) {
            $msg = base64_encode(filter_var($msg, FILTER_SANITIZE_SPECIAL_CHARS));
            $doubt .= $doubt === "" ? $msg : ",$msg";
        }
        
        $public = $_POST["f"];

        if ($receiver)
            $sql = "INSERT INTO `doubts` (subject, sender, assignee, question, public, time) VALUES ('$subject', $sender, $receiver, '$doubt', $public, $time)";
        else
            $sql = "INSERT INTO `doubts` (subject, sender, question, public, time) VALUES ('$subject', $sender, '$doubt', $public, $time)";
        
        mysqli_query($conn, $sql);

        $id = mysqli_insert_id($conn);

        $sql = "SELECT * FROM `users` WHERE id = $sender";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"] . ",doubt:$id";
        $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $sender";
        mysqli_query($conn, $sql);
        die();
    } else {
        $content = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));
        $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ($sender, $receiver, '$content', $time)";

        $sql = mysqli_query($conn, $sql);
        addToChatList($receiver);
    }
?>