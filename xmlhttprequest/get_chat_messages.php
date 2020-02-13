<?php
    if (empty($_POST["c"])) {
        header("Location: ../");
    } else {
        $c = base64_decode($_POST["c"]);
    }

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    $user = $_COOKIE["rg"];
    $sql = "(SELECT * FROM `messages` WHERE sender = '$user' AND reciever = '$c')
            UNION
            (SELECT * FROM `messages` WHERE sender = '$c' AND reciever = '$user') ORDER BY time;";
    $sql = mysqli_query($conn, $sql);
    print_r(json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC)));
    die();
?>