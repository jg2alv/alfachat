<?php
    if (empty($_POST)) {
        header("Location: ../");
    }

    session_start();

    require "../includes/db.inc.php";
    require "../includes/add_to_chatlist.inc.php";
    require "../includes/parse_receiver.inc.php";
    
    $sender = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]); // ID of the person I'm talking to
    $time = time();
    $content = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));

    /*
        $receiver can be:
            ID
            doubt:ID
            group:ID
    */

    if (strpos($receiver, "doubt") !== false) {
        list($assignee, $doubt) = parseReceiver($conn, $receiver);
        $sql = "INSERT INTO `messages` (sender, receiver, content, doubt, time) VALUES ($sender, $assignee, '$content', $doubt, $time)";
    } else
        $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ($sender, '$receiver', '$content', $time)";

    mysqli_query($conn, $sql);
    addToChatList($receiver);

    die();
?>