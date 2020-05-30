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
                $bio .= file_info($conn, $file);    
            
            } else $bio .= " " . base64_decode($sql["content"]);

            $time = time() - $sql["time"];
            if ($time < date("G") * 3600)
                $time = date("h:i A", $sql["time"]);
            else if ($time > date("G") * 3600 && $time < (518400 + 3600 * date("G")))
                $time = date("D", $sql["time"]);
            else
                $time = date("d/m/Y");

            $sql1 = !$doubt ? "SELECT doubt FROM `messages` WHERE sender = '$chat' AND receiver = $id AND seen = 0" : "SELECT doubt FROM `messages` WHERE sender = '$chat' AND receiver = $id AND seen = 0 AND doubt <> 0";
            $sql1 = mysqli_query($conn, $sql1);
            $sql1 = mysqli_num_rows($sql1) ? mysqli_num_rows($sql1) : "";
            return [$bio, $time, $sql1, $sql["time"]];
        }
    }
?>