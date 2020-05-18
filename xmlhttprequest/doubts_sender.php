<?php
    if (empty($_POST) && empty($_FILES)) {
        header("Location: ../");
    }

    session_start();
    require "../includes/db.inc.php";
    require "../includes/check_dir.inc.php";

    $assignee_bak = base64_decode($_POST["receiver"]);
    $public = $_POST["public"];
    $subject = base64_decode($_POST["subject"]);
    $name = base64_decode($_POST["name"]);
    $sender = $_SESSION["id"];
    $time = time();
    if ($_SESSION["class"] < 10)
        $tags = "#fund_" . $_SESSION["class"];
    else
        $tags = "#med_" . ($_SESSION["class"] - 9);

    if (!empty($_POST["messages"])) {
        $hasMessage = true;
        if (strpos($assignee_bak, "teacher") !== false) {
            $assignee = explode(":", $assignee_bak)[1];
            $content = $_POST["messages"];
            $sql = !empty($assignee) ? "INSERT INTO `doubts` (subject, name, sender, assignee, public, tags, time) VALUES ('$subject', '$name', $sender, $assignee, $public, '$tags', $time)" : "INSERT INTO `doubts` (subject, name, sender, public, tags, time) VALUES ('$subject', '$name', $sender, $public, '$tags', $time)";
            mysqli_query($conn, $sql);
            $id = $doubtID = mysqli_insert_id($conn);
            $tags .= " #$id";
            $sql = "UPDATE `doubts` SET tags = '$tags' WHERE id = $id";
            mysqli_query($conn, $sql);

            foreach($content as $msg) {
                $msg = base64_encode(filter_var($msg, FILTER_SANITIZE_SPECIAL_CHARS));
                $sql = $assignee ? "INSERT INTO `messages` (sender, receiver, content, doubt, time) VALUES ($sender, $assignee, '$msg', $id, $time)" : "INSERT INTO `messages` (sender, content, doubt, time) VALUES ($sender, '$msg', $id, $time)";
                mysqli_query($conn, $sql);
            }
        } else if (strpos($assignee_bak, "doubt") !== false) {
            $doubt = explode(":", $assignee)[1];
            $sql = "SELECT * FROM `doubts` WHERE id = $doubt";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $assignee = $sql["assignee"];
            $sql = "INSERT INTO `messages` (sender, receiver, content, doubt, time) VALUES ($sender, $assignee, '$content', $doubt, $time)";
            mysqli_query($conn, $sql);
        }
    }

    if (!empty($_FILES)) {
        $receiver = $assignee_bak;
        $assignee = explode(":", $assignee_bak)[1];

        for ($i = 0; $i < sizeof($_FILES["files"]["name"]); $i++) {
            $file = $_FILES["files"];

            $file_name = $file["name"][$i];
            $file_size = $file["size"][$i];
            $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
            $file_location = base64_encode("assets/files/$time/$sender/$assignee/$file_name");
            $path = "../chats/assets/files";

            if (!empty($_POST["audio"]) && !empty($file["type"][$i])) 
                $file_extension = explode("/", $file["type"][$i])[1];

            checkDirectory($path);
            $path .= "/$time";
            checkDirectory($path);
            $path .= "/$sender";
            checkDirectory($path);
            $path .= "/$assignee";
            checkDirectory($path);
            $path .= "/$file_name";

            $sql = "INSERT INTO `files` (name, size, location, extension, time) VALUES ('$file_name', $file_size, '$file_location', '$file_extension', $time);";
            $sql = mysqli_query($conn, $sql);
            $id = mysqli_insert_id($conn);

            if (strpos($receiver, "teacher") !== false && empty($hasMessage)) {
                $sql = !empty($assignee) ? "INSERT INTO `doubts` (subject, name, sender, assignee, public, tags, time) VALUES ('$subject', '$name', $sender, $assignee, $public, '$tags', $time)" : "INSERT INTO `doubts` (subject, name, sender, public, tags, time) VALUES ('$subject', '$name', $sender, $public, '$tags', $time)";
                mysqli_query($conn, $sql);
                $doubt = mysqli_insert_id($conn);
                $tags .= " #$doubt";
                $sql = "UPDATE `doubts` SET tags = '$tags' WHERE id = $doubt";
                mysqli_query($conn, $sql);

                $sql = "INSERT INTO `messages` (sender, receiver, file, doubt, time) VALUES ($sender, $assignee, $id, $doubt, $time)";
                mysqli_query($conn, $sql);
            } else if (strpos($receiver, "doubt") !== false || !empty($hasMessage)) {
                $sql = !empty($doubtID) ? "SELECT * FROM `doubts` WHERE id = $doubtID" : "SELECT * FROM `doubts` WHERE id = $assignee";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                $receiver = $sql["assignee"];
                $sql = !empty($doubtID) ? "INSERT INTO `messages` (sender, receiver, file, doubt, time) VALUES ($sender, $receiver, $id, $doubtID, $time)" : "INSERT INTO `messages` (sender, receiver, file, doubt, time) VALUES ($sender, $receiver, $id, $assignee, $time)";
                mysqli_query($conn, $sql);
            }

            move_uploaded_file($file["tmp_name"][$i], $path);
            usleep(5000);
        }
    }

    die();
?>