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

            if ($msg["reply"]) {
                strpos($msg["reply"], ".") !== false ? list($chat, $reply) = explode(".", $msg["reply"]) : $reply = $msg["reply"];
                $sql = "SELECT * FROM `messages` WHERE id = $reply";
                $sql = mysqli_query($conn, $sql);
                if (!mysqli_num_rows($sql))
                    $msg["reply"] = "0";
                else {
                    $msg["reply"] = array();
                    $sql = mysqli_fetch_assoc($sql);
                    if ($sql["content"] === NULL) {
                        $file = $sql["file"];
                        $msg["reply"]["content"] = file_info($conn, $file);
                    
                    } else $msg["reply"]["content"] = html_entity_decode(base64_decode($sql["content"]));

                    $msg["reply"]["id"] = $sql["id"];
                    if ($sql["sender"] == $_SESSION["id"])
                        $msg["reply"]["sender"] = $_SESSION["name"];
                    else {
                        $sql = $sql["sender"];
                        $sql = "SELECT * FROM `users` WHERE id = $sql";
                        $sql = mysqli_query($conn, $sql);
                        $msg["reply"]["sender"] = mysqli_fetch_assoc($sql)["name"];
                    }
                    !empty($chat) ? $msg["reply"]["receiver"] = $chat : null;
                }
            }

            $msg["content"] = html_entity_decode(base64_decode($msg["content"]));
            $sender = $msg["sender"]; // User ID
            $sql = "SELECT * FROM `users` WHERE id = $sender"; // Getting user info
            $msg["sender"] = json_encode(formatMessages($conn, $sql));
            $receiver = empty($msg["receiver"]) ? $msg["assignee"] : $msg["receiver"];
            $receiver = strpos($receiver, ":") !== false ? explode(":", $receiver)[1] : $receiver;
            $sql = "SELECT * FROM `users` WHERE id = $receiver";
            $msg["receiver"] = json_encode(formatMessages($conn, $sql));
            array_push($response, $msg);
        }
        return $response;
    }

    function formatMessages($conn, $sql) {
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        unset($sql["password"], $sql["ra"], $sql["chats"], $sql["class"], $sql["city"], $sql["bio"]);
        return $sql;
    }
?>