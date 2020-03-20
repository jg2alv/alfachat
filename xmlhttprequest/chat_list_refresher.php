<?php
    if (empty($_POST["cl"])) {
        header("Location: ../");
    }

    session_start();
    $id = $_SESSION["id"];
    require_once "../includes/db.inc.php";
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
        if (strpos(end($chats), ":") !== false) {
            if (explode(":", end($chats))[1] !== $user) {
                echo ",";
            }
        } else {
            if (end($chats) !== $user) {
                echo ",";
            }
        }
    }
    echo "]";
    die();
?>