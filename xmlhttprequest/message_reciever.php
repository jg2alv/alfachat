<?php
    if (empty($_POST["c"])) {
        header("Location: ../");
    } else {
        $c = base64_decode($_POST["c"]);
    }

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    // Select all messages sent by me to him AND sent by him to me which 'seen' value is 0. Order by time.
    if (strpos($c, "group") !== false) {
        $sql = "SELECT * FROM `messages` WHERE reciever = '$c' ORDER BY time;";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        $response = "[";
        foreach($sql as $msg) {
            $sender = $msg["sender"];
            $sql = "SELECT * FROM `users` WHERE id = $sender";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            if (!$sql["photo"]) {
                $response .= substr(json_encode($msg), 0, -1) . ',"photo"' . ":" .  '"assets/avatars/user/default.png","name":"' . $sql["name"] .'"},';
            } else {
                $response .= json_encode($msg) . "," . $sql["photo"] . ",";
            }
        }
        $response = substr($response, 0, -1);
        $response .= "]";
        echo $response;
    } else {
        session_start();
        $user = $_SESSION["id"];
        $sql = "(SELECT * FROM `messages` WHERE sender = '$user' AND reciever = '$c') UNION (SELECT * FROM `messages` WHERE sender = '$c' AND reciever = '$user') ORDER BY time;";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        echo json_encode($sql);
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