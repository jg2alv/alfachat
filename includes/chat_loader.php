<?php
    function getClassChat($class, $conn) {
        $sql = "SELECT * FROM `classes` WHERE id = '$class'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $photo = $sql["photo"];
        $name = $sql["name"];
        $description = "Turma do ". str_replace("-", "do", $name);
        echo "<div class='chat'><div class='chat_pic'><img src='". str_replace($photo, "null", "/chats/assets/avatar.png") ."'></div><div class='chat_info'><div>$name</div><div>$description</div></div></div>";
    }

    require "db.inc.php";
    $id = $_COOKIE["id"];
    $sql = "SELECT * FROM `users` WHERE id = '$id'";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);
    $class = $sql["class"];
    getClassChat($class, $conn);
    if ($sql["chats"]) {
        echo "<div class='chat_selector'>";
        $chats = explode(",", $sql["chats"]);
        foreach ($chats as $chat) {
            $sql = "SELECT * FROM `chats` WHERE id = '$chat'";
            $sql = mysqli_query($conn, $sql);
            $chat_info = mysqli_fetch_assoc($sql);
            $photo = $chat_info["photo"];
            $name = $chat_info["name"];
            $description = $chat_info["description"];
            echo "<div class='chat'><div class='chat_pic'><img src='". str_replace($photo, "null", "/chats/assets/avatar.png") ."'></div><div class='chat_info'><div>$name</div><div>$description</div></div></div>";
        }
        echo "</div>";
    }
?>