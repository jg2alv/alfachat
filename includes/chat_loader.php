<?php
    require "db.inc.php";
    $id = $_COOKIE["id"];
    $sql = "SELECT * FROM `users` WHERE id = '$id'";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);
    if ($sql["chats"]) {
        echo "<div class='chat_list'>";
        $chats = explode(",", $sql["chats"]);
        foreach ($chats as $chat) {
            $sql = "SELECT * FROM `chats` WHERE id = '$chat'";
            $sql = mysqli_query($conn, $sql);
            $chat_info = mysqli_fetch_assoc($sql);
            $photo = $chat_info["photo"];
            if (!$photo) {
                $photo = "/AlfaChat/chats/assets/avatar.png";
            }
            $name = $chat_info["name"];
            $description = $chat_info["description"];
            echo "<div class='chat'><div class='chat_pic'><img src='$photo'></div><div class='chat_info'><div class='chat_info_name'>$name</div><div class='chat_info_desc'>$description</div></div></div>";
        }
        echo "</div>";
    }
?>