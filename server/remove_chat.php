<?php
    if (empty($_POST)) header("Location: ../");

    session_start();
    require "../includes/db.inc.php";
    $id = $_SESSION["id"];
    $chat = base64_decode($_POST["chat"]);

    if ($chat === "group:" . $_SESSION["class"]) die();

    $chats = array_flip(explode(",", mysqli_fetch_assoc(mysqli_query($conn, "SELECT chats FROM `users` WHERE id = $id"))["chats"]));
    unset($chats[$chat]);
    $chats = array_flip($chats);
    $chats = implode(",", $chats);
    mysqli_query($conn, "UPDATE `users` SET chats = '$chats' WHERE id = $id");

    if (strpos($chat, "group") !== false) {
        $chat = explode(":", $chat);

        $chats = explode(",", mysqli_fetch_assoc(mysqli_query($conn, "SELECT members FROM `groups` WHERE id = $chat"))["chats"]);
        array_flip($chats);
        unset($chats[$id]);
        array_flip($chats);
        $chats = implode(",", $chats);
        mysqli_query($conn, "UPDATE `groups` SET members = '$chats' WHERE id = $chat");
    }

    die();
?>