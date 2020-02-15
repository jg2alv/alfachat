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
        $myID = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE rg = '$r' AND class = '$c'"; // Person I'm talking to.
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $rg = $sql["rg"]; // Their RG
        $theirID = $sql["id"]; // Their ID

        if ($sql["chats"] == NULL) { // If their chats are NULL
            $sql = "UPDATE `users` SET chats = $myID WHERE rg = $rg";
            mysqli_query($conn, $sql);
        } else {
            $chats = $sql["chats"];
            if (strpos($chats, $myID) === false) { // If I'm not on his chat list AND his chat list isn't NULL.
                $chats .= "," . $myID;
                $sql = "UPDATE `users` SET chats = $chats WHERE rg = $rg";
            }
        }

        if ($_SESSION["chats"] == NULL) { // If my chats are NULL
            $sql = "UPDATE `users` SET chats = $theirID WHERE id = $myID";
            mysqli_query($conn, $sql);
        } else {
            $chats = $_SESSION["chats"] . "," . $theirID;
            $sql = "UPDATE `users` SET chats = $chats WHERE id = $myID";
            mysqli_query($conn, $sql);
        }

        $sql = "SELECT * FROM `users` WHERE id = '$myID'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        foreach($sql as $index => $value) {
            $_SESSION[$index] = $value;
        }
    }

    die();
?>