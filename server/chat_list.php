<?php
    if (empty($_SESSION))
        session_start();

    require "../includes/remove_from_chatlist.inc.php";
    require "../includes/db.inc.php";
    require "../includes/get_last_message.inc.php";
    require "../includes/file_info.inc.php";

    $id = $_SESSION["id"]; // Getting user id
    $chats = array();
    $sql = "SELECT chats FROM `users` WHERE id = $id"; // Selecting logged user
    $sql = mysqli_query($conn, $sql);
    $sql = $chatlist = mysqli_fetch_assoc($sql)["chats"];

    $sql = explode(",", $sql);
    foreach ($sql as $index => $chat) {
        if (strpos($chat, ":") !== false) {
            $id = explode(":", $chat)[1];

            if (strpos($chat, "group") !== false) {
                $type = "group:$id";
                list($bio, $date, $unseen, $time) = getLastMessage($conn, "receiver = '$type'");
                $sql = "SELECT members FROM `groups` WHERE id = $id";
                $sql = explode(",", mysqli_fetch_assoc(mysqli_query($conn, $sql))["members"]);
                $response = array();
                foreach($sql as $member) {
                    $sql = "SELECT name, photo, bio, status FROM `users` WHERE id = $member";
                    $sql = mysqli_fetch_assoc(mysqli_query($conn, $sql));
                    array_push($response, $sql);
                }
                $response = json_encode($response);
                $member = "<script id='$id'>$('script#$id').parent().data('members', $response).children('script').remove()</script>";
                
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
                list($bio, $date, $unseen, $time) = getLastMessage($conn, "doubt = $id");
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
        $member = $member ? $member : "";
        $chats[$time] = "<div class='chat' data-id='$type'>$member<div class='pic'><img src='$photo'></div><div class='info'><div style='display: flex; justify-content: space-between'><div>$name</div><div class='unseen_count' style='background: none; min-width: 30px; width: auto;'>$date</div></div><div style='display: flex; justify-content: space-between'><div>$bio</div>$unseen</div></div></div>";
    }

    krsort($chats);
    echo json_encode(array(implode("", $chats), base64_encode($chatlist)));
?>