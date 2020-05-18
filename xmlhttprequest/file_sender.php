<?php
    if (empty($_FILES)) {
        header("Location: ../");
    }

    session_start();
    require "../includes/db.inc.php";
    require "../includes/check_dir.inc.php";
    require "../includes/add_to_chatlist.inc.php";
    require "../includes/send_file.inc.php";

    $sender = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]);
    $file = $_FILES["files"];

    for ($i = 0; $i < sizeof($_FILES["files"]["name"]); $i++) {
        $file_name = $file["name"][$i];
        $file_size = $file["size"][$i];
        $time = time();
        list($id, $path) = sendFile($file_name, $file_size, $receiver, $conn);

        if (strpos($receiver, ":") !== false) {
            $doubt = explode(":", $receiver)[1];
            $sql = "SELECT * FROM `doubts` WHERE id = $doubt";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $receiver = $sql["assignee"];
            $sql = "INSERT INTO `messages` (sender, receiver, file, doubt, time) VALUES ($sender, $receiver, $id, $doubt, $time)";
            mysqli_query($conn, $sql);
        } else {
            $sql = "INSERT INTO `messages` (sender, receiver, file, time) VALUES ($sender, '$receiver', $id, $time)";
            $sql = mysqli_query($conn, $sql);
        }

        move_uploaded_file($file["tmp_name"][$i], $path);
        usleep(5000);
    }

    strpos(base64_decode($_POST["id"]), ":") === false ? addToChatList($receiver) : null;
?>