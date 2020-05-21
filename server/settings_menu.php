<?php
    if (empty($_POST["f"])) {
        header("Location: ../");
    }

    $_POST["f"]();

    function photo() {
        session_start();
        require "../includes/db.inc.php";
        require "../includes/check_dir.inc.php";
        $id = $_SESSION["id"];
        $file_extension = pathinfo($_FILES["user_photo"]["name"], PATHINFO_EXTENSION);
        $root = "assets/avatars/users/uploads";

        checkDirectory("../chats/$root");
        $root .= "/$id";
        checkDirectory("../chats/$root");
        $root .= "/profile_pic.$file_extension";

        $sql = "SELECT * FROM `users` WHERE id = $id";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql)["photo"];

        if ($sql !== "assets/avatars/users/default.png")
            unlink("../chats/$sql");

        move_uploaded_file($_FILES["user_photo"]["tmp_name"], "../chats/$root");

        $sql = "UPDATE `users` SET `photo` = '$root' WHERE id = $id";
        mysqli_query($conn, $sql);
    }

    die();
?>