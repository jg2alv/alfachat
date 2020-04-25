<?php
    if (empty($_POST["c"])) {
        header("Location: ../"); // Avoid users who tries to access directly
    }

    $c = base64_decode($_POST["c"]);
    require_once "../includes/db.inc.php";
    if (strpos($c, "group") !== false) { // If that's a group
        $sql = "SELECT * FROM `messages` WHERE receiver = '$c' ORDER BY time;";
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
            if (!$sql["photo"]) {
                $response .= substr(json_encode($msg), 0, -1) . ',"photo"' . ":" .  '"assets/avatars/users/default.png","name":"' . $sql["name"] .'"},'; // Default pic
            } else {
                $response .= substr(json_encode($msg), 0, -1) . ',"photo":' . '"' . $sql["photo"] . '","name":"' . $sql["name"] . '"},'; // User's pic
            }
        }
        $response = substr($response, 0, -1);
        $response .= "]"; // Finishing artificial JSON
        echo $response; // Returning it to JS
    } else { // If that's a personal chat
        session_start();
        $user = $_SESSION["id"];
        // Select all messages sent by me to him AND sent by him to me. Order by time.
        $sql = "(SELECT * FROM `messages` WHERE sender = '$user' AND receiver = '$c') UNION (SELECT * FROM `messages` WHERE sender = '$c' AND receiver = '$user') ORDER BY time;";
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
            $response .= json_encode($msg);
            $response .= ",";
        }
        $response = substr($response, 0, -1);
        $response .= "]"; // Finishing artificial JSON
        echo $response; // Returning it to JS
        // Select all messages he sent me and I didn't see yet.
        $sql = "SELECT * FROM `messages` WHERE sender = $c AND seen = 0";
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