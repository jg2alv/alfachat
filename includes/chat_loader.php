<?php
    if (!defined("CHAT_LOADER")) {
        header("Location: ../");
    }

    require "db.inc.php";

    $files = array_values(array_diff(scandir("../chats/assets/user_avatars"), array(".", "..")));
    echo "<div class='chat_list' data-files='" . sizeof($files) . "'>";

    function getClassChat($class, $conn) {
        $sql = "SELECT * FROM `classes` WHERE id = '$class'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $photo = $sql["photo"];
        $name = $sql["name"];
        $description = "Turma do ". str_replace("-", "do", $name);
        echo "<div class='chat'><div class='chat_pic'><img style='border-radius: 0;' src='../chats/assets/class_avatars/$class.png'></div><div class='chat_info'><div>$name</div><div>$description</div></div></div>";
    }
    $id = $_COOKIE["id"];
    $sql = "SELECT * FROM `users` WHERE id = '$id'";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);
    $class = $sql["class"];
    getClassChat($class, $conn);
    if ($sql["chats"]) {
        $chats = explode(",", $sql["chats"]);
        foreach ($chats as $chat) {
            $sql = "SELECT * FROM `chats` WHERE id = '$chat'";
            $sql = mysqli_query($conn, $sql);
            $chat_info = mysqli_fetch_assoc($sql);
            $photo = $chat_info["photo"];
            if(!$photo) {
                $num = rand(0, (sizeof($files) - 1));
                $photo = "../chats/assets/user_avatars/" . $files[$num] . "'" . "style='border-radius: 0;";
            }
            $name = $chat_info["name"];
            $description = $chat_info["description"];
            echo "<div class='chat'><div class='chat_pic'><img src='$photo'></div><div class='chat_info'><div>$name</div><div>$description</div></div></div>";
        }
    }
    echo "</div>";
?>