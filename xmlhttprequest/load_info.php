<?php
    if (empty($_POST["g"]) || empty($_POST["o"])) {
        header("Location: ../");
    } else {
        $g = $_POST["g"];
        $o = $_POST["o"];
    }

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    $sql = "SELECT * FROM `users` WHERE id = $g";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);

    if ($o === "img") {
        if (!$sql["photo"]) {
            echo "assets/avatars/user/default.png";
        } else {
            echo $sql["photo"];
        }
    } else {
        echo $sql["name"];
    }
    die();
