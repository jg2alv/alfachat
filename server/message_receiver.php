<?php
    if (empty($_POST)) header("Location: ../");

    session_start();

    $chat = base64_decode($_POST["id"]);
    $limit = $_POST["limit"];
    $offset = $limit > 50 ? $limit - 50 : 0;
    $user = $_SESSION["id"];
    
    require "../includes/db.inc.php";
    require "../includes/remove_from_chatlist.inc.php";
    require "../includes/fetch_messages.inc.php";
    require "../includes/file_info.inc.php";

    if (strpos($chat, ":") !== false) {
        if (strpos($chat, "group") !== false) {
            mysqli_query($conn, "UPDATE `messages` SET seen = 1 WHERE receiver = '$chat' AND sender <> $user AND seen = 0");

            $sql = "(SELECT * FROM `messages` WHERE receiver = '$chat' ORDER BY time DESC LIMIT $limit OFFSET $offset) ORDER BY time;";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
            echo json_encode(fetchMessages($conn, $sql)); // Returning it to JS
        } else if (strpos($chat, "doubt") !== false) {
            mysqli_query($conn, "UPDATE `messages` SET seen = 1 WHERE receiver = '$user' AND doubt = $id AND seen = 0");

            $id = explode(":", $chat)[1];
            $sql = "(SELECT * FROM `messages` WHERE doubt = $id ORDER BY time DESC LIMIT $limit OFFSET $offset) ORDER BY time";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
            echo json_encode(fetchMessages($conn, $sql));
        }
    } else {
        mysqli_query($conn, "UPDATE `messages` SET seen = 1 WHERE sender = '$chat' AND receiver = '$user' AND doubt = 0 AND seen = 0");

        $sql = "((SELECT * FROM `messages` WHERE sender = '$user' AND receiver = '$chat' AND doubt = 0) UNION (SELECT * FROM `messages` WHERE sender = '$chat' AND receiver = '$user' AND doubt = 0) ORDER BY time DESC LIMIT $limit OFFSET $offset) ORDER BY time";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        echo json_encode(fetchMessages($conn, $sql));
    }

    die();
?>