<?php
    if (empty($_POST["m"])) {
        header("Location: ../");
    } elseif (empty($_POST["id"])) {
        header("Location: ../");
    }

    session_start();

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");

    $s = $_SESSION["rg"];
    $r = base64_decode($_POST["id"]);
    $m = base64_encode(filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS));
    $c = $_SESSION["class"];
    $t = time();

    $sql = "INSERT INTO `messages` (sender, reciever, content, class, seen, time) VALUES ('$s', '$r', '$m', '$c', 0, '$t');";
    $sql = mysqli_query($conn, $sql);

    echo base64_decode($m);


    if ($r !== "class") {
        $mid = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE rg = '$r' AND class = '$c'"; // Person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $rg = $sql["rg"]; // Their RG
        $tid = $sql["id"]; // Their ID

        if (!$sql["chats"]) { // If their chats are NULL
            $sql = "UPDATE `users` SET chats = $mid WHERE rg = $rg";
            mysqli_query($conn, $sql);
        } else {
            $chats = $sql["chats"];
            if (strpos($chats, $mid) === false) { // If I'm not on his chat list AND his chat list isn't NULL.
                $chats .= "," . $mid;
                $sql = "UPDATE `users` SET chats = $chats WHERE rg = $rg";
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