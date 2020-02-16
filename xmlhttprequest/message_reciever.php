<?php
    if (empty($_POST["c"])) {
        header("Location: ../");
    } else {
        $c = base64_decode($_POST["c"]);
    }

    session_start();

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    $user = $_SESSION["id"];
    // The below line should be used on the "auto-refresh script."
    //$sql = "(SELECT * FROM `messages` WHERE sender = '$user' AND reciever = '$c') UNION (SELECT * FROM `messages` WHERE sender = '$c' AND reciever = '$user' AND seen = 0) ORDER BY time;";
    // Select all messages sent by me to him AND sent by him to me which 'seen' value is 0. Order by time.
    $sql = "(SELECT * FROM `messages` WHERE sender = '$user' AND reciever = '$c') UNION (SELECT * FROM `messages` WHERE sender = '$c' AND reciever = '$user') ORDER BY time;";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
    print_r(json_encode($sql));

    // Select all messages he sent me and I didn't see yet.
    $sql = "SELECT * FROM `messages` WHERE sender = $c AND seen = 0";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
    foreach($sql as $message) {
        $id = $message["id"];
        // Mark messages as 'seen'.
        $sql = "UPDATE `messages` SET seen = 1 WHERE id = $id";
        mysqli_query($conn, $sql);
    }
    die();
?>