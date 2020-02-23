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


    if (strpos($r, "group") === false) {
        $id = $_SESSION["id"];
        // $id is my ID
        // $r is their ID
        $sql = "SELECT * FROM `users` WHERE id = '$r'"; // Person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);

        if (!$sql["chats"]) { // If their chats are NULL
            $sql = "UPDATE `users` SET chats = $id WHERE id = $r";
            mysqli_query($conn, $sql);          // The if strpos() isn't always true, so I ued two queries.
        } else {
            $chats = $sql["chats"];
            if (strpos($chats, $id) === false) { // If I'm not on his chat list AND his chat list isn't NULL.
                $chats .= "," . $id;
                $sql = "UPDATE `users` SET chats = $chats WHERE id = $id";
                mysqli_query($conn, $sql);      // The if strpos() isn't always true, so I ued two queries.
            }
        }
        
        if (!$_SESSION["chats"]) { // If my chats are NULL
            $sql = "UPDATE `users` SET chats = $r WHERE id = $id";
        } else {
            $chats = $_SESSION["chats"] . "," . $r;
            $sql = "UPDATE `users` SET chats = $chats WHERE id = $id";
        }
        mysqli_query($conn, $sql);

        $sql = "SELECT * FROM `users` WHERE id = '$id'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        foreach($sql as $index => $value) {
            $_SESSION[$index] = $value;
        }
    }

    die();
?>