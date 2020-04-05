<?php
    if (empty($_FILES)) {
        header("Location: ../");
    }

    function checkDirectory($root) {
        if (!file_exists($root)) {
            mkdir($root);
        }
    }

    session_start();
    require "../includes/db.inc.php";

    $sent = time();
    $id = $_SESSION["id"];
    $reciever = base64_decode($_POST["id"]);
    $file_name = $_FILES["file_user_input"]["name"];
    $file_size = $_FILES["file_user_input"]["size"];
    $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
    $file_location = base64_encode("assets/files/$sent/$id/$reciever/$file_name");
    $root = "../chats/assets/files";

    checkDirectory($root);
    $root .= "/$sent";
    checkDirectory($root);
    $root .= "/$id";
    checkDirectory($root);
    $root .= "/$reciever";
    checkDirectory($root);
    $root .= "/$file_name";

    $sql = "INSERT INTO `files` (name, size, location, extension, time) VALUES ('$file_name', $file_size, '$file_location', '$file_extension', $sent);";
    $sql = mysqli_query($conn, $sql);

    $sql = mysqli_insert_id($conn);
    
    $sql = "INSERT INTO `messages` (sender, reciever, content, file, time) VALUES ($id, '$reciever', '0', $sql, $sent)";
    $sql = mysqli_query($conn, $sql);

    move_uploaded_file($_FILES["file_user_input"]["tmp_name"], $root);
?>