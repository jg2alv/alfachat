<?php

    if (empty($_POST["a"])) { // Safety
        header("Location: ../");
    }

    if (!empty($_POST["n"]) && !empty($_POST["m"])) { // If I wanna set the group **name**
        createGroup();
    } else {
        getUserChatList(); // If POST[a] is filled but both POST[n] AND POST[m] aren't
    }

    function createGroup() {
        require "../includes/db.inc.php"; // Getting connection
        session_start(); // Starting session
        $created = time(); // Creation time
        $name = mysqli_real_escape_string($conn, $_POST["n"]); // Safety on group names
        $members = $_SESSION["id"] . "," . mysqli_real_escape_string($conn, $_POST["m"]); // Safety on member list

        $sql = "INSERT INTO `groups` (`name`, `members`, `created`) VALUES ('$name', '$members', '$created')"; // Insert INTO groups table values: name, members (the user) and creation time
        mysqli_query($conn, $sql); // Querying

        if ($_FILES["p"]) {
            require "../includes/check_dir.inc.php";

            $extension = pathinfo($_FILES["p"]["name"], PATHINFO_EXTENSION);
            $id = mysqli_insert_id($conn);
            $root = "assets/avatars/groups/uploads";

            checkDirectory("../chats/$root");
            $root .= "/$id";
            checkDirectory("../chats/$root");
            $root .= "/profile_pic.$extension";

            $sql = "UPDATE `groups` SET `photo` = '$root' WHERE id = $id"; // Insert INTO groups table values: name, members (the user) and creation time
            mysqli_query($conn, $sql);

            $sql = "SELECT * FROM `groups` WHERE id = $id";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql)["photo"];

            if ($sql) {
                unlink("../chats/$sql");
            }

            move_uploaded_file($_FILES["p"]["tmp_name"], "../chats/$root");
        }

        $sql = "SELECT * FROM `groups` WHERE `name` = '$name' AND `members` = '$members' AND `created` = '$created'"; // Getting the new-born group ID
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $group_id = $sql["id"]; // Setting group ID to group_id

        $members = explode(",", $members);
        foreach($members as $member) {
            $sql = "SELECT * FROM `users` WHERE id = $member"; // Getting creator's info
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $chats = $sql["chats"] . "," . "group:$group_id";
            $sql = "UPDATE `users` SET `chats` = '$chats' WHERE `id` = '$member'"; // Getting creator's info
            mysqli_query($conn, $sql);
        }
        echo base64_encode("group:$group_id");
        die(); // Ending the connection
    }

    function getUserChatList() {
        require "../includes/db.inc.php"; // Getting connection
        session_start(); // Starting session
        $id = $_SESSION["id"];
        $sql = "SELECT * FROM `users` WHERE id = $id";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $response = "[";
        $chats = explode(",", $sql["chats"]);
        foreach($chats as $chat) {
            if (strpos($chat, ":") === false) {
                $sql = "SELECT * FROM `users` WHERE id = $chat";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                unset($sql["password"], $sql["ra"], $sql["chats"], $sql["class"], $sql["email"], $sql["joined"], $sql["bio"]);
                $sql["id"] = base64_encode($sql["id"]);
                $response .= json_encode($sql);
                $response .= ",";
            }
        }
        $response = substr($response, 0, -1);
        $response .= "]";
        echo $response;
        die();
    }
?>