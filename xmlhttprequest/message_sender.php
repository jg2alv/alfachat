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
    $content = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));

    if (strpos($receiver, "teacher") !== false) {
        $receiver = explode(":", $receiver)[1];
        $content = json_decode($_POST["m"]);
        $doubts = array();
        $subject = $_POST["subject"];
        $public = $_POST["f"];

        foreach($content as $msg) {
            $msg = base64_encode(filter_var($msg, FILTER_SANITIZE_SPECIAL_CHARS));
            if ($receiver)
                $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ($sender, $receiver, '$msg', $time)";
            else
                $sql = "INSERT INTO `messages` (sender, content, time) VALUES ($sender, '$msg', $time)";
            mysqli_query($conn, $sql);
            array_push($doubts, mysqli_insert_id($conn));
        }

        if ($receiver)
            $sql = "INSERT INTO `doubts` (subject, sender, assignee, public, time) VALUES ('$subject', $sender, $receiver, $public, $time)";
        else 
            $sql = "INSERT INTO `doubts` (subject, sender, public, time) VALUES ('$subject', $sender, $public, $time)";
        
        mysqli_query($conn, $sql);

        $id = mysqli_insert_id($conn);

        foreach($doubts as $doubt) {
            $sql = "UPDATE `messages` SET doubt = $id WHERE id = $doubt";
            mysqli_query($conn, $sql);
        }

        $sql = "SELECT * FROM `users` WHERE id = $sender";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"] . ",doubt:$id";
        $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $sender";
        mysqli_query($conn, $sql);
        die();
    } else if (strpos($receiver, "doubt") !== false) {
        $receiver = explode(":", $receiver)[1];
        $sql = "SELECT * FROM `doubts` WHERE id = $receiver";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $assignee = $sql["assignee"];

        if ($assignee) 
            $sql = "INSERT INTO `messages` (sender, receiver, content, doubt, time) VALUES ($sender, $assignee, '$content', $receiver, $time)";
        else
            $sql = "INSERT INTO `messages` (sender, content, doubt, time) VALUES ($sender, '$content', $receiver, $time)";
        
        mysqli_query($conn, $sql);
    } else {
        $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ($sender, '$receiver', '$content', $time)";

        $sql = mysqli_query($conn, $sql);
        addToChatList($receiver);
    }

    die();
?>