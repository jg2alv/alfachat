<?php
    $id = $_SESSION["id"]; // Getting user id
    $sql = "SELECT chats FROM `users` WHERE id = $id"; // Selecting logged user
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_assoc($sql);

    if (!empty($_POST["chats"])) {
        echo base64_encode($sql["chats"]);
        return;
    }

    $sql = explode(",", $sql["chats"]);

    foreach ($sql as $chat) {
        if (strpos($chat, "group") !== false) { // If that's a group
            $id = explode(":", $chat)[1];
            if ($id < 13) { // If it's a class group (group:1 to group:12)
                if ($id > 9) {
                    $chat = ($id-9) . "° Ano - Ensino M&eacute;dio";
                } else {
                    $chat = $id . "° Ano - Ensino Fundamental";
                }
                $bio = "Turma do " . str_replace("-", "do", $chat);
                echo "<div class='chat' data-id='" . base64_encode("group:" . $_SESSION["class"]) . "'><div class='pic'><img style='border-radius: 0' src='assets/avatars/groups/class/" . $_SESSION["class"] . ".png'></div><div class='info'><div>$chat</div><div>$bio</div></div></div>";
                continue;
            } else { // If that's not a class group
                $sql = "SELECT * FROM `groups` WHERE id = $id";
                $sql = mysqli_query($conn, $sql);
                if (reportBug($conn, $sql, "Group ID $id does not exist"))
                    continue;
                $type = "group:";
            }
        } else {
            $sql = "SELECT * FROM `users` WHERE id = $chat";
            $sql = mysqli_query($conn, $sql);
            if (reportBug($conn, $sql, "Teacher ID $chat does not exist"))
                continue;
            $type = "";
        }

        $sql = mysqli_fetch_assoc($sql);
        echo "<div class='chat' data-id='" . base64_encode($type . $sql["id"]) . "'><div class='pic'><img src='" . $sql["photo"] . "'></div><div class='info'><div>" . $sql["name"] . "</div><div>" . $sql["bio"] . "</div></div></div>";
    }
?>