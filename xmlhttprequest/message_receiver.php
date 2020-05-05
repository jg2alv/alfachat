<?php
    if (empty($_POST["id"])) {
        header("Location: ../"); // Avoid users who tries to access directly
    }

    $chat = base64_decode($_POST["id"]);
    $limit = $_POST["limit"];
    require "../includes/db.inc.php";
    require "../includes/remove_from_chatlist.inc.php";

    session_start();

    if (strpos($chat, ":") !== false) {
        if (strpos($chat, "group") !== false) {
            $sql = "(SELECT * FROM `messages` WHERE receiver = '$chat' ORDER BY time DESC LIMIT $limit) ORDER BY time;";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
            $response = "["; // Starting artificial JSON
            foreach($sql as $msg) {
                if ($msg["file"]) {
                    $file = $msg["file"];
                    $sql = "SELECT * FROM `files` WHERE id = $file";
                    $sql = mysqli_query($conn, $sql);
                    $sql = mysqli_fetch_assoc($sql);
                    $msg["file"] = json_encode($sql);
                }
                $msg["content"] = html_entity_decode(base64_decode($msg["content"]));
                $sender = $msg["sender"]; // User ID
                $sql = "SELECT * FROM `users` WHERE id = $sender"; // Getting user info
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                if (!$sql["photo"])
                    $response .= substr(json_encode($msg), 0, -1) . ',"photo"' . ":" .  '"assets/avatars/users/default.png","name":"' . $sql["name"] .'"},'; // Default pic
                else
                    $response .= substr(json_encode($msg), 0, -1) . ',"photo":' . '"' . $sql["photo"] . '","name":"' . $sql["name"] . '"},'; // User's pic
            }
            $response = substr($response, 0, -1);
            $response .= "]"; // Finishing artificial JSON
            echo $response; // Returning it to JS
        } else if (strpos($chat, "doubt") !== false) {
            $id = explode(":", $chat)[1];
            $sql = "SELECT * FROM `messages` WHERE doubt = $id";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
            echo fetchMessages($conn, $sql);
        }
    } else {
        $user = $_SESSION["id"];
        // Select all messages sent by me to him AND sent by him to me. Order by time.
        $sql = "((SELECT * FROM `messages` WHERE sender = '$user' AND receiver = '$chat' AND doubt = 0) UNION (SELECT * FROM `messages` WHERE sender = '$chat' AND receiver = '$user' AND doubt = 0) ORDER BY time DESC LIMIT $limit) ORDER BY time";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        echo fetchMessages($conn, $sql);
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

    function fetchMessages($conn, $sql) {
        $response = "["; // Starting artificial JSON
        foreach($sql as $msg) {
            if ($msg["file"]) {
                $file = $msg["file"];
                $sql = "SELECT * FROM `files` WHERE id = $file";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                $msg["file"] = json_encode($sql);
            }
            $msg["content"] = html_entity_decode(base64_decode($msg["content"]));
            $response .= json_encode($msg);
            $response .= ",";
        }
        $response = substr($response, 0, -1);
        $response .= "]"; // Finishing artificial JSON
        return $response; // Returning it to JS
    }

    die();
?>