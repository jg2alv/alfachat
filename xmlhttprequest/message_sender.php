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

    $sql = "INSERT INTO `messages` (sender, reciever, content, time) VALUES ('$s', '$r', '$c', '$t');";
    $sql = mysqli_query($conn, $sql);

    $reciever = $r;
    require "add_to_chatlist.inc.php";
?>