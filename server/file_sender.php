<?php
    if (empty($_FILES)) {
        header("Location: ../");
    }

    session_start();
    require "../includes/db.inc.php";
    require "../includes/check_dir.inc.php";
    require "../includes/add_to_chatlist.inc.php";
    require "../includes/upload_file.inc.php";
    require "../includes/parse_receiver.inc.php";

    $sender = $_SESSION["id"];
    $receiver = base64_decode($_POST["id"]);
    $file = $_FILES["files"];

    /*
        $receiver can be:
            ID
            doubt:ID
            group:ID
    */

    for ($i = 0; $i < sizeof($_FILES["files"]["name"]); $i++) {
        $file_name = $file["name"][$i];
        $file_size = $file["size"][$i];
        $time = time();
        $reply = $_POST["reply"];
        list($id, $path) = uploadFile($file_name, $file_size, $receiver, $conn);

        if (strpos($receiver, "doubt") !== false) {
            list($assignee, $doubt) = parseReceiver($conn, $receiver);
            $sql = "INSERT INTO `messages` (sender, receiver, reply, file, doubt, time) VALUES ($sender, $assignee, $reply, $id, $doubt, $time)";
        } else
            $sql = "INSERT INTO `messages` (sender, receiver, reply, file, time) VALUES ($sender, '$receiver', $reply, $id, $time)";

        mysqli_query($conn, $sql);

        move_uploaded_file($file["tmp_name"][$i], $path);
        usleep(5000);
    }

    strpos(base64_decode($_POST["id"]), ":") === false ? addToChatList($receiver) : null;
?>