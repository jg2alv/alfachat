<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");

    $s = $_COOKIE["rg"];
    $r = base64_decode($_POST["id"]);
    $m = filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS);
    $c = $_COOKIE["class"];
    $t = time();

    $sql = "INSERT INTO `messages` (sender, reciever, content, class, time) VALUES ('$s', '$r', '$m', '$c', '$t');";
    $sql = mysqli_query($conn, $sql);

    echo $m;
    die();
?>