<?php
    if (empty($_POST))
        header("Location: ../");

    require "../includes/db.inc.php";

    $id = $_POST["m"];
    $sql = "SELECT file FROM `messages` WHERE id = $id";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);

    if ($sql["file"]) {
        $file = $sql["file"];
        $sql = "SELECT location FROM `files` WHERE id = $file";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $sql = base64_decode($sql["location"]);
        unlink("../chats/$sql");

        $sql = "DELETE FROM `files` WHERE id = $file";
        mysqli_query($conn, $sql);
    }

    $sql = "DELETE FROM `messages` WHERE id = $id";
    mysqli_query($conn, $sql);

    die();
?>