<?php
    function getLastMessage($conn, $where) {
        $sql = "SELECT sender, content FROM `messages` WHERE $where ORDER BY time DESC LIMIT 1";
        $sql = mysqli_query($conn, $sql);
        if (!mysqli_num_rows($sql)) return "";
        else {
            $sql = mysqli_fetch_assoc($sql);
            if ($sql["sender"] === $_SESSION["id"])
                $bio = "<strong>Voc&ecirc;:</strong>";
            else {
                $sender = $sql["sender"];
                $sql1 = "SELECT name FROM `users` WHERE id = $sender";
                $sql1 = mysqli_query($conn, $sql1);
                $sql1 = mysqli_fetch_assoc($sql1);
                $name = $sql1["name"];
                $bio = "<strong>$name:</strong>";
            }
            if ($sql["content"] === NULL) return "$bio <em>[Arquivo]</em>";
            return "$bio " . base64_decode($sql["content"]);
        }
    }
?>