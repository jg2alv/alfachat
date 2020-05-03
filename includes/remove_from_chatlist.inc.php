<?php
    function removeFromChatList($conn, $sql, $chat) {
        $sql = mysqli_query($conn, $sql);
        if (!mysqli_num_rows($sql)) {
            $id = $_SESSION["id"];
            $sql = "SELECT * FROM `users` WHERE id = $id";
            $sql = mysqli_query($conn, $sql);
            $sql = implode(",", array_diff(explode(",", mysqli_fetch_assoc($sql)["chats"]), array($chat)));
            $sql = "UPDATE `users` SET chats = '$sql' WHERE id = $id";
            $sql = mysqli_query($conn, $sql);
            return true;
        }
        return false;
    }
?>