<?php
    empty($_POST["q"]) ? header("Location: ../") : $q = filter_input(INPUT_POST, "q", FILTER_SANITIZE_SPECIAL_CHARS);

    session_start();
    require "../includes/db.inc.php";
    require "../includes/get_last_message.inc.php";
    require "../includes/file_info.inc.php";

    $class = $_SESSION["class"];
    $id = $_SESSION["id"];
    $city = $_SESSION["city"];

    $sql = $class == 0 ? "SELECT * FROM `users` WHERE name LIKE '%$q%' OR ra LIKE '%$q%' AND id <> $id" : "SELECT * FROM `users` WHERE (name LIKE '%$q%' OR ra LIKE '%$q%') AND class = '$class' AND city = '$city' AND id <> $id;";
    
    $sql = mysqli_query($conn, $sql); // Search
    if (mysqli_num_rows($sql)) {
        $chats = array();
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        foreach($sql as $chat) {
            $name = $chat["name"];
            $photo = $chat["photo"];
            $receiver = $type = $chat["id"];
            $chat = $chat["id"];
            list($bio, $date, $unseen, $time) = getLastMessage($conn, "sender = $id AND receiver = $receiver");
            $unseen = $unseen ? "<div class='unseen_count'>$unseen</div>" : "";
            $type = base64_encode($type);
            $chats[$time] = "<div class='chat' data-id='$type'><div class='pic'><img src='$photo'></div><div class='info'><div style='display: flex; justify-content: space-between'><div>$name</div><div class='unseen_count' style='background: none; min-width: 30px; width: auto;'>$date</div></div><div style='display: flex; justify-content: space-between'><div>$bio</div>$unseen</div></div></div>";
        }

        krsort($chats);
        echo implode("", $chats);
    }
    die();
?>