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
            $i = explode(":", $i)[1]; // Getting group ID (model: group:ID)
            $sql = "SELECT * FROM `groups` WHERE id = $i"; // Getting info on group
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $members = $sql["members"];
            $members = explode(",", $members);
            if (sizeof($members) > 1) {
                echo sizeof($members) . " membros";
            } else {
                echo "1 membro";
            }
            die();
        } else { // If it's a private chat
            $sql = "SELECT * FROM `users` WHERE id = $i"; // Getting user info
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            echo $sql["status"]; // Returning user status' row
        }
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