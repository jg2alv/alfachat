<?php
    function fetchMessages($conn, $sql) {
        $response = array();
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
            unset($sql["password"], $sql["ra"], $sql["chats"], $sql["class"], $sql["city"], $sql["bio"]);
            $msg["sender"] = json_encode($sql);
            array_push($response, $msg);
        }
        return json_encode($response);
    }
?>