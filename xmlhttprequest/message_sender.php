<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    session_start();

    require_once "../includes/db.inc.php";

    $sender = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]); // ID of the person I'm talking to
    $content = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));
    $time = time();

    if ($receiver === "0")
        $sql = "INSERT INTO `doubts` (sender, assignee, content, time) VALUES ('$sender', '$receiver', '$content', '$time')";
    else
        $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ('$sender', '$receiver', '$content', '$time')";

    $sql = mysqli_query($conn, $sql);

    if (strpos($receiver, "student") !== false)
        require "add_to_chatlist.inc.php";
?>