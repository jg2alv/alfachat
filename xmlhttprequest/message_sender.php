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
    $m = filter_input(INPUT_POST, "m", FILTER_SANITIZE_SPECIAL_CHARS);
    $c = $_SESSION["class"];
    $t = time();

    $sql = "INSERT INTO `messages` (sender, reciever, content, class, seen, time) VALUES ('$s', '$r', '$m', '$c', 0, '$t');";
    $sql = mysqli_query($conn, $sql);

    echo $m;

    if ($r !== "class") {
        $s = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE id = $s"; // Returns my chats
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        if (strlen($sql["chats"]) < 2) { // If my chats have only a character
            $chat = $sql["chats"];
            $sql = "SELECT * FROM `users` WHERE id = '$chat'"; // Return 'chats' from the guy I sent a message to
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            if (strpos($sql["chats"], $s) === false) { // If I'm not on his chat list
            $sql = $sql . "," . $s; // Append me to his chat list
            $sql = "UPDATE `users` SET chats = $sql WHERE id = $r"; // Database update
            mysqli_query($conn, $sql);
            }
        } else {
            $chats = explode(",", $sql["chats"]); // Array with my chats
            foreach ($chats as $chat) {
                $sql = "SELECT * FROM `users` WHERE id = '$chat'"; // Return 'chats' from the guy I sent a message to
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                if (strpos($sql["chats"], $s) === false) { // If I'm not on his chat list
                $sql = $sql . "," . $s; // Append me to his chat list
                $sql = "UPDATE `users` SET chats = $sql WHERE id = $r"; // Database update
                mysqli_query($conn, $sql);
                }
            }
        }
    }

    die();
?>