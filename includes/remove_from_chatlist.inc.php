<?php
function removeFromChatList($conn, $sql, $chat) {
    $sql = mysqli_query($conn, $sql);
    if (!mysqli_num_rows($sql)) {
        $id = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE id = $id";
        $sql = mysqli_query($conn, $sql);
        $sql = explode(",", mysqli_fetch_assoc($sql)["chats"]);
        $sql = implode(",", array_diff($sql, array($chat)));
        $sql = "UPDATE `users` SET chats = '$sql' WHERE id = $id";
        $sql = mysqli_query($sql);
        return true;
    }
    return false;
}
?>