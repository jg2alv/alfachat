<?php
    function parseReceiver($conn, $receiver) {
        $doubt = explode(":", $receiver)[1];
        $sql = "SELECT * FROM `doubts` WHERE id = $doubt";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $assignee = $_SESSION["class"] > 0 ? $sql["assignee"] : $sql["sender"];
        $answered = 0;

        if ($_SESSION["class"] == 0) { // Add student to teacher chat list and vice-versa
            $sender = $sql["sender"];
            $sql = "SELECT chats FROM `users` WHERE id = $sender";
            $chats = updateChatlist($conn, $sql, $doubt);
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $sender";
            mysqli_query($conn, $sql);

            $id = $_SESSION["id"];
            $sql = "SELECT chats FROM `users` WHERE id = $id";
            $chats = updateChatlist($conn, $sql, $doubt);
            $sql = "UPDATE `users` SET chats = '$chats' WHERE id = $id";
            mysqli_query($conn, $sql);
            $answered = 1;
        }

        $sql = "UPDATE `doubts` SET answered = $answered WHERE id = $doubt";
        mysqli_query($conn, $sql);

        return array($assignee, $doubt);
    }

    function updateChatlist($conn, $sql, $doubt) {
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = explode(",", $sql["chats"]);

        if (!in_array("doubt:$doubt", $chats))
            array_push($chats, "doubt:$doubt");

        return implode(",", $chats);
    }
?>