<?php
    if (empty($_POST)) {
        header("Location: ../");
    }

    session_start();

    require "../includes/db.inc.php";
    require "../includes/add_to_chatlist.inc.php";
    
    $sender = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]); // ID of the person I'm talking to
    $time = time();
    $content = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));

    if (strpos($receiver, ":") !== false) {
        $doubt = explode(":", $receiver)[1];
        $sql = "SELECT * FROM `doubts` WHERE id = $doubt";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $assignee = $sql["assignee"];
        $sql = "INSERT INTO `messages` (sender, receiver, content, doubt, time) VALUES ($sender, $assignee, '$content', $doubt, $time)";
        mysqli_query($conn, $sql);
    } else {
        $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ($sender, '$receiver', '$content', $time)";
        $sql = mysqli_query($conn, $sql);
        addToChatList($receiver);
    }

    die();
?>