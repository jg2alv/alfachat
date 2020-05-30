<?php
    if (empty($_SESSION))
        session_start();

    require_once "../includes/remove_from_chatlist.inc.php";
    require "../includes/db.inc.php";
    require "../includes/get_last_message.inc.php";
    require "../includes/file_info.inc.php";

    $id = $_SESSION["id"]; // Getting user id
    $chats = array();
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
                list($bio, $date, $unseen, $time) = getLastMessage($conn, "receiver = '$type'");
                
                if ($id < 13) { // If it's a class group (group:1 to group:12)
                    $name = ($id > 9) ? ($id-9) . "° Ano - Ensino M&eacute;dio" : $id . "° Ano - Ensino Fundamental";
                    $photo = "assets/avatars/groups/class/$id.png' style='border-radius: 0";
                } else { // If that's not a class group
                    $sql = "SELECT name, photo FROM `groups` WHERE id = $id";
                    if (removeFromChatList($conn, $sql, $chat))
                        continue;

                    $sql = mysqli_query($sql);
                    $sql = mysqli_fetch_assoc($sql);

                    $name = $sql["name"];
                    $photo = $sql["photo"]; 
                }
            } else if (strpos($chat, "doubt") !== false) {
                $sql = "SELECT * FROM `doubts` WHERE id = $id AND solved = 0";
                if (removeFromChatList($conn, $sql, $chat))
                    continue;

                $sql = mysqli_query($conn, $sql);
                $name = mysqli_fetch_assoc($sql)["name"];
                list($bio, $date, $unseen, $time) = getLastMessage($conn, "doubt = $id", true);
                $photo = "assets/icons/doubt.png' style='border-radius: 0";
                $type = "doubt:$id";
            }
        } else {
            $sql = "SELECT name, photo FROM `users` WHERE id = $chat";
            if (removeFromChatList($conn, $sql, $chat))
                continue;

            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);

            $name = $sql["name"];
            $photo = $sql["photo"];
            $me = $_SESSION["id"];
            list($bio, $date, $unseen, $time) = getLastMessage($conn, "((receiver = $chat AND sender = $me) OR (receiver = $me AND sender = $chat))");
            $type = $chat;
        }

        $unseen = $unseen ? "<div class='unseen_count'>$unseen</div>" : "";
        $type = base64_encode($type);
        $chats[$time] = "<div class='chat' data-id='$type'><div class='pic'><img src='$photo'></div><div class='info'><div style='display: flex; justify-content: space-between'><div>$name</div><div class='unseen_count' style='background: none; min-width: 30px; width: auto;'>$date</div></div><div style='display: flex; justify-content: space-between'><div>$bio</div>$unseen</div></div></div>";
    }

    krsort($chats);
    echo implode("", $chats);
?>