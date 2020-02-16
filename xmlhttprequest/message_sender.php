<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    session_start();

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");

    $s = $_SESSION["id"];
    $r = base64_decode($_POST["id"]);
    $c = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));
    $t = time();

    $sql = "INSERT INTO `messages` (sender, reciever, content, seen, time) VALUES ('$s', '$r', '$c', 0, '$t');";
    $sql = mysqli_query($conn, $sql);

    echo base64_decode($c);


    if ($r !== "class") {
        $mid = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE id = '$r'"; // Person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $id = $sql["id"]; // Their RG
        $tid = $sql["id"]; // Their ID

        if (!$sql["chats"]) { // If their chats are NULL
            $sql = "UPDATE `users` SET chats = $mid WHERE id = $id";
            mysqli_query($conn, $sql);
        } else {
            $chats = $sql["chats"];
            if (strpos($chats, $mid) === false) { // If I'm not on his chat list AND his chat list isn't NULL.
                $chats .= "," . $mid;
                $sql = "UPDATE `users` SET chats = $chats WHERE id = $id";
            }
        }

        if (!$_SESSION["chats"]) { // If my chats are NULL
            $sql = "UPDATE `users` SET chats = $tid WHERE id = $mid";
            mysqli_query($conn, $sql);
        } else {
            $chats = $_SESSION["chats"] . "," . $tid;
            $sql = "UPDATE `users` SET chats = $chats WHERE id = $mid";
            mysqli_query($conn, $sql);
        }

        $sql = "SELECT * FROM `users` WHERE id = '$mid'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        foreach($sql as $index => $value) {
            $_SESSION[$index] = $value;
        }
    }

    die();
?>