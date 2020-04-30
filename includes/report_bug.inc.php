<?php
function reportBug($conn, $sql, $msg) {
    if (!mysqli_num_rows($sql)) {
        $bug_time = time();
        $sql = "INSERT INTO `log` (`file`, `session`, `msg`, `time`) VALUES ('chats/index.php', 'PHP chat page loading', '$msg', $bug_time)";
        mysqli_query($conn, $sql);
        return true;
    }
    return false;
}
?>