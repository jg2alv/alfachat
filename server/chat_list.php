<?php
    if (empty($_SESSION))
        session_start();

    require_once "../includes/remove_from_chatlist.inc.php";
    require "../includes/db.inc.php";

    $id = $_SESSION["id"]; // Getting user id
    $sql = "SELECT chats FROM `users` WHERE id = $id"; // Selecting logged user
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);

    if (!empty($_POST["chats"])) {
        echo base64_encode($sql["chats"]);
        return;
    }

    $sql = explode(",", $sql["chats"]);
    foreach ($sql as $chat) {
        if (strpos($chat, ":") !== false) {
            $id = explode(":", $chat)[1];

            if (strpos($chat, "group") !== false) {
                $type = "group:$id";
                
                if ($id < 13) { // If it's a class group (group:1 to group:12)
                    $name = ($id > 9) ? ($id-9) . "° Ano - Ensino M&eacute;dio" : $id . "° Ano - Ensino Fundamental";
                    $photo = "assets/avatars/groups/class/$id.png' style='border-radius: 0";
                    $bio = "Turma do " . str_replace("-", "do", $name);
                } else { // If that's not a class group
                    $sql = "SELECT * FROM `groups` WHERE id = $id";
                    if (removeFromChatList($conn, $sql, $chat))
                        continue;
                    $sql = mysqli_query($sql);
                    $sql = mysqli_fetch_assoc($sql);

                    $name = $sql["name"];
                    $photo = $sql["photo"];
                    $bio = $sql["bio"];
                }
            } else if (strpos($chat, "doubt") !== false) {
                $sql = "SELECT * FROM `doubts` WHERE id = $id AND solved = 0";
                if (removeFromChatList($conn, $sql, $chat))
                    continue;
                $sql = mysqli_query($conn, $sql);
                $name = mysqli_fetch_assoc($sql)["name"];

                $sql = "SELECT sender, content FROM `messages` WHERE doubt = $id ORDER BY time DESC LIMIT 1";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);

                $bio = $sql["sender"] === $_SESSION["id"] ? "Voc&ecirc;: " : mysqli_fetch_assoc(mysqli_query($conn, "SELECT name FROM `users` WHERE id =" . $sql["sender"]))["name"] . ": ";
                $bio .= $sql["content"] ? base64_decode($sql["content"]) : "<Arquivo>";

                $photo = "assets/icons/doubt.png' style='border-radius: 0";
                $type = "doubt:$id";
            }
        } else {
            $sql = "SELECT * FROM `users` WHERE id = $chat";
            if (removeFromChatList($conn, $sql, $chat))
                continue;
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);

            $name = $sql["name"];
            $photo = $sql["photo"];
            $bio = $sql["bio"];
            $type = $chat;
        }

        echo "<div class='chat' data-id='" . base64_encode($type) . "'><div class='pic'><img src='$photo'></div><div class='info'><div>$name</div><div>$bio</div></div></div>";
    }
?>