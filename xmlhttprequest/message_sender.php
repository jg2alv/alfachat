<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    session_start();

    require_once "../includes/db.inc.php";

    $s = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]); // ID of the person I'm talking to
    $c = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));
    $t = time();

    if (strpos($receiver, "teacher") !== false)
        $sql = "INSERT INTO `doubts` (sender, assiginee, content, time) VALUES ('student:$s', '$receiver', '$c', '$t')";
    else
        $sql = "INSERT INTO `messages` (sender, receiver, content, time) VALUES ('$s', '$receiver', '$c', '$t')";

    $sql = mysqli_query($conn, $sql);

    if (strpos($receiver, "student") !== false)
        require "add_to_chatlist.inc.php";
?>