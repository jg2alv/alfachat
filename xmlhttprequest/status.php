<?php
    if (empty($_POST["o"]) || empty($_POST["i"])) { // Default safety measure
        header("Location: ../");
    }

    error_reporting(0); // DISABLING ERROR REPORTING

    require_once "../includes/db.inc.php";
    $_POST["o"]($conn); // Executing function which has the same name as given argument

    function get($conn) {
        session_start();
        $i = base64_decode($_POST["i"]); // #encryption lol

        if (strpos($i, "group") !== false) { // If that's a group (status is member count)
            $id = explode(":", $i)[1];
            $sql = "SELECT * FROM `groups` WHERE id = $id"; // Getting info on group
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $members = $sql["members"];
            $members = explode(",", $members);
            if (sizeof($members) > 1) {
                $status = sizeof($members) . " membros";
            } else {
                $status = "1 membro";
            }
            $id = $_SESSION["id"];
            $count = 0;
            foreach($members as $member) {
                $sql = "SELECT * FROM `users` WHERE status = 'online' AND id = '$member' AND id <> '$id'"; // Getting info on group
                $sql = mysqli_query($conn, $sql);
                if (mysqli_num_rows($sql)) {
                    $count++;
                }
            }
            if ($count) {
                $status .= ", " . $count . " online";
            }
        } else {
            $sql = "SELECT * FROM `users` WHERE id = $i"; // Getting user info

            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $status = $sql["status"];
        }

        echo $status;
        die();
    }

    function set($conn) { // If the operation is a set one
        session_start();
        $id = $_SESSION["id"];
        $i = $_POST["i"];
        $sql = "UPDATE `users` SET `status` = '$i' WHERE id = $id"; // Updating user status to given
        mysqli_query($conn, $sql);
    }

    die();
?>