<?php
    function getLastMessage($conn, $where, $doubt = false) {
        global $chat;
        $id = $_SESSION["id"];

        date_default_timezone_set('America/Sao_Paulo');
        setlocale(LC_ALL, 'pt_BR');

        $sql = "SELECT sender, content, time, file FROM `messages` WHERE $where ORDER BY time DESC LIMIT 1";
        $sql = mysqli_query($conn, $sql);
        if (!mysqli_num_rows($sql)) return "";
        else {
            $sql = mysqli_fetch_assoc($sql);

            
                if ($sql["sender"] === $_SESSION["id"])
                    $bio = "<strong style='color: white;'>Voc&ecirc;:</strong> ";
                else if (strpos($chat, "group") !== false) {
                    $sender = $sql["sender"];
                    $sql1 = "SELECT name FROM `users` WHERE id = $sender";
                    $sql1 = mysqli_query($conn, $sql1);
                    $sql1 = mysqli_fetch_assoc($sql1);
                    $name = $sql1["name"];
                    $bio = "<strong style='color: white;'>$name:</strong> ";
                } else $bio = "";

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
                    $bio .= "<img src='assets/icons/camera.png' style='width: 15px; vertical-align: bottom; margin-right: 5px'>Foto";
                else if (in_array($sql1["extension"], $video))
                    $bio .= "<img src='assets/icons/play.png' style='width: 20px; vertical-align: text-top; margin: 0 2.5px 0 0'>V&iacute;deo";
                else if (in_array($sql1["extension"], $audio))
                    $bio .= "<img src='assets/icons/audio.png' style='width: 25px; vertical-align: middle; margin: 0 -2.5px'>&Aacute;udio";
                else
                    $bio = "<img src='assets/icons/file.png' style='width: 25px; vertical-align: middle; margin: 0 2.5px 4px 2.5px'>" . $sql1["name"];    
            
            } else $bio .= " " . base64_decode($sql["content"]);

            $pass = time() - $sql["time"];
            $time = $pass > date("G") * 3600 ? date("D", $sql["time"]) : date("h:i A", $sql["time"]);

            $sql1 = !$doubt ? "SELECT doubt FROM `messages` WHERE sender = '$chat' AND receiver = $id AND seen = 0" : "SELECT doubt FROM `messages` WHERE sender = '$chat' AND receiver = $id AND seen = 0 AND doubt <> 0";
            $sql1 = mysqli_query($conn, $sql1);
            $sql1 = mysqli_num_rows($sql1) ? mysqli_num_rows($sql1) : "";
            return [$bio, $time, $sql1, $sql["time"]];
        }
    }
?>