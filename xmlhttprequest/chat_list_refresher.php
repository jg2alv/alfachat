<?php
    if (empty($_POST["cl"])) {
        header("Location: ../");
    }

    session_start();
    $id = $_SESSION["id"];
    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    $chat_list = base64_decode($_POST["cl"]);
    
    $sql = "SELECT * FROM `users` WHERE id = '$id'";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);

    if ($sql["chats"] === $chat_list) {
        die();
    }

    $chats = explode(",", $sql["chats"]);
    echo "[";
    foreach($chats as $user) {
        if (strpos($user, ":") === false) {
            $sql = "SELECT * FROM `users` WHERE id = '$user'";
        } else {
            $user = explode(":", $user)[1];
            $sql = "SELECT * FROM `groups` WHERE id = '$user'";
        }
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        echo json_encode($sql);
        if (end($chats) !== $user) {
            echo ",";
        }
    }
    echo "]";
    die();
?>