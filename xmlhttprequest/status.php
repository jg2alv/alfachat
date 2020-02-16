<?php
    if (empty($_POST["o"])) {
        header("Location: ../");
    } else {
        $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
        $_POST["o"]($conn);
    }

    function check($conn) {
        if (empty($_POST["i"])) {
            header("Location: ../");
        }

        session_start();
        $i = base64_decode($_POST["i"]);
        if ($i === "group:class") {
            $class = $_SESSION["class"];
            $sql = "SELECT * FROM `groups` WHERE id = $class";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $members = $sql["members"];
            if (strlen($members) < 2) {
                echo "1 membro";
                die();
            } else {
                $members = explode(",", $members);
                echo sizeof($members) . " membros";
                die();
            }
        } else {
            $sql = "SELECT * FROM `users` WHERE id = $i";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            echo $sql["status"];
        }
    }

    function set($conn) {
        if (empty($_POST["s"])) {
            header("Location: ../");
        }

        session_start();
        $id = $_SESSION["id"];
        $s = $_POST["s"];
        $sql = "UPDATE `users` SET `status` = '$s' WHERE id = $id";
        mysqli_query($conn, $sql);
    }

    die();
?>