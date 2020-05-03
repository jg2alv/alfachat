<?php
    if (empty($_FILES)) {
        header("Location: ../");
    }

    session_start();
    require "../includes/db.inc.php";
    require "../includes/check_dir.inc.php";
    require "../includes/add_to_chatlist.inc.php";

    $id = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]);
    foreach($_FILES as $file) {
        $sent = time();
        $file_name = $file["name"];
        $file_size = $file["size"];
        $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
        $file_location = base64_encode("assets/files/$sent/$id/$receiver/$file_name");
        $root = "../chats/assets/files";

        if (!empty($_POST["audio"]) && !empty($file["type"])) 
            $file_extension = explode("/", $file["type"])[1];

        checkDirectory($root);
        $root .= "/$sent";
        checkDirectory($root);
        $root .= "/$id";
        checkDirectory($root);
        $root .= "/$receiver";
        checkDirectory($root);
        $root .= "/$file_name";

        $sql = "INSERT INTO `files` (name, size, location, extension, time) VALUES ('$file_name', $file_size, '$file_location', '$file_extension', $sent);";
        $sql = mysqli_query($conn, $sql);

        $sql = mysqli_insert_id($conn);
        
        $sql = "INSERT INTO `messages` (sender, receiver, file, time) VALUES ($id, '$receiver', $sql, $sent)";
        $sql = mysqli_query($conn, $sql);

        move_uploaded_file($file["tmp_name"], $root);
        usleep(5000);
    }

    addToChatList($receiver);
?>