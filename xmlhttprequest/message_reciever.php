<?php
    if (empty($_POST["c"])) {
        header("Location: ../");
    } else {
        $c = base64_decode($_POST["c"]);
    }

    session_start();

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    $user = $_SESSION["rg"];
    $class = $_SESSION["class"];
    $sql = "(SELECT * FROM `messages` WHERE sender = '$user' AND reciever = '$c' AND class = '$class') UNION (SELECT * FROM `messages` WHERE sender = '$c' AND reciever = '$user' AND class = '$class') ORDER BY time;";
    $sql = mysqli_query($conn, $sql);
    print_r(json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC)));
    if ($c !== "class") {
        $sql = "SELECT * FROM `users` WHERE rg = '$c' AND class = '$class'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $chats = $sql["chats"];
        if ($chats) {
            if (strpos($chats, $_SESSION["id"]) === false) {
                $chats .= "," . $_SESSION["id"];
            }
        } else {
            $chats = $_SESSION["id"];
        }
        $id = $sql["id"];
        $sql = "UPDATE `users` SET chats = '$chats' WHERE id = '$id'";
        mysqli_query($conn, $sql);
    }
    die();
?>