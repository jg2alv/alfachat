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
                $reply = $msg["reply"];
                $msg["reply"] = array();
                $sql = "SELECT * FROM `messages` WHERE id = $reply";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                if ($sql["content"] === NULL) {
                    $file = $sql["file"];
                    $img = array("png", "jpg", "jpeg", "gif", "jfif");
                    $video = array("mp4", "webm");
                    $audio = array("mp3", "wav", "ogg");
    
                    $sql1 = "SELECT extension, name FROM `files` WHERE id = $file";
                    $sql1 = mysqli_query($conn, $sql1);
                    $sql1 = mysqli_fetch_assoc($sql1);
                    $sql1["extension"] = strtolower($sql1["extension"]);
                    if (in_array($sql1["extension"], $img))
                        $msg["reply"]["content"] = "<img src='assets/icons/camera.png' style='width: 15px; vertical-align: bottom; margin-right: 5px'>Foto";
                    else if (in_array($sql1["extension"], $video))
                        $msg["reply"]["content"] = "<img src='assets/icons/play.png' style='width: 20px; vertical-align: text-top; margin: 0 2.5px 0 0'>V&iacute;deo";
                    else if (in_array($sql1["extension"], $audio))
                        $msg["reply"]["content"] = "<img src='assets/icons/audio.png' style='width: 25px; vertical-align: middle; margin: 0 -2.5px'>&Aacute;udio";
                    else
                        $msg["reply"]["content"] = "<img src='assets/icons/file.png' style='width: 25px; vertical-align: middle; margin: 0 2.5px 4px 2.5px'>" . $sql1["name"];    
                
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