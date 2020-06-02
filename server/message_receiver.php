<?php
    if (empty($_POST["id"])) {
        header("Location: ../"); // Avoid users who tries to access directly
    }

    $chat = base64_decode($_POST["id"]);
    $limit = $_POST["limit"];
    $offset = $limit > 50 ? $limit - 50 : 0;
    
    require "../includes/db.inc.php";
    require "../includes/remove_from_chatlist.inc.php";
    require "../includes/fetch_messages.inc.php";
    require "../includes/file_info.inc.php";

    session_start();

    if (strpos($chat, ":") !== false) {
        if (strpos($chat, "group") !== false) {
            $sql = "(SELECT * FROM `messages` WHERE receiver = '$chat' ORDER BY time DESC LIMIT $limit OFFSET $offset) ORDER BY time;";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
            echo json_encode(fetchMessages($conn, $sql)); // Returning it to JS
        } else if (strpos($chat, "doubt") !== false) {
            $id = explode(":", $chat)[1];
            $sql = "(SELECT * FROM `messages` WHERE doubt = $id ORDER BY time DESC LIMIT $limit OFFSET $offset) ORDER BY time";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
            echo json_encode(fetchMessages($conn, $sql));

            seeMessages($id);
        }
    } else {
        $user = $_SESSION["id"];
        $sql = "((SELECT * FROM `messages` WHERE sender = '$user' AND receiver = '$chat' AND doubt = 0) UNION (SELECT * FROM `messages` WHERE sender = '$chat' AND receiver = '$user' AND doubt = 0) ORDER BY time DESC LIMIT $limit OFFSET $offset) ORDER BY time";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        echo json_encode(fetchMessages($conn, $sql));
        
        seeMessages($chat);
    }

    function seeMessages($chat) {
        global $conn;

        // Select all messages he sent me and I didn't see yet.
        $sql = "SELECT * FROM `messages` WHERE sender = $chat AND seen = 0";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        foreach ($sql as $message) {
            $id = $message["id"];
            // Mark messages as 'seen'.
            $sql = "UPDATE `messages` SET seen = 1 WHERE id = $id";
            mysqli_query($conn, $sql);
        }
    }

    die();
?>