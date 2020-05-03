<?php
    session_start();
    require "../includes/db.inc.php";
    require "../includes/remove_from_chatlist.inc.php";

    $id = $_SESSION["id"];
    $sql = "SELECT * FROM `users` WHERE id = $id";
    $sql = mysqli_query($conn, $sql);

    if ((!empty($_GET["log_out"])) || (empty($_SESSION) || !(mysqli_num_rows($sql)))) {
        session_unset();
        session_destroy();
        header("Location: ../"); // If user isn't logged in
    } else {
        $sql = mysqli_fetch_assoc($sql);
        if (!empty($_POST["s"])) {
            echo json_encode($sql);
            die();
        }
    }

    echo "<!doctype html><html><head><script src='https://code.jquery.com/jquery-3.4.1.min.js' integrity='sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=' crossorigin='anonymous'></script><link rel='stylesheet' type='text/css' href='../css/normalize.css'>";

    if ($_SESSION["type"] === "student") {
        echo "<link rel='stylesheet' type='text/css' href='../css/UI/student/chats.css'>";
        foreach (array_diff(scandir('../js/chats/UI/student'), array('.', '..')) as $file) {
            echo "<script src='../js/chats/UI/student/$file'></script>";   // Load JS files
        }
    } else {
        echo "<link rel='stylesheet' type='text/css' href='../css/UI/teacher/chats.css'>";
        foreach (array_diff(scandir('../js/chats/UI/teacher'), array('.', '..')) as $file) {
            echo "<script src='../js/chats/UI/teacher/$file'></script>";   // Load JS files
        }
    }
    echo "<meta charset='utf-8'><meta name='viewport' content='initial-scale=1, maximum-scale=1'><link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'><link rel='icon' type='image/png' href='../img/logo_short.png'><link rel='stylesheet' type='text/css' href='../css/default.css'><link rel='stylesheet' type='text/css' href='../css/UI/common.css'><script src='../js/connection.js'></script><script src='../js/toast.class.js'></script><title>AlfaChat | Conversas</title></head>";

    require ($_SESSION["type"] === "teacher") ? "../UI/teacher.php" : "../UI/student.php";
?>