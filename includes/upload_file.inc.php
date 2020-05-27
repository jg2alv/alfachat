<?php
    function uploadFile($file_name, $file_size, $receiver, $conn) {
        $sender = $_SESSION["id"];
        $time = time();
        $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
        $file_location = base64_encode("assets/files/$time/$sender/$receiver/$file_name");
        $path = "../chats/assets/files";

        checkDirectory($path);
        $path .= "/$time";
        checkDirectory($path);
        $path .= "/$sender";
        checkDirectory($path);
        $path .= "/$receiver";
        checkDirectory($path);
        $path .= "/$file_name";

        $sql = "INSERT INTO `files` (name, size, location, extension, time) VALUES ('$file_name', $file_size, '$file_location', '$file_extension', $time);";
        $sql = mysqli_query($conn, $sql);

        return array(mysqli_insert_id($conn), $path);
    }
?>