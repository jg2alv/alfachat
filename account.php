<?php
    require("includes/db.inc.php");

    function checkUser($conn, $rg, $grade) {
        $sql = "SELECT * from `users` WHERE rg='$rg' AND grade='$grade';";
        $sql = mysqli_query($conn, $sql);
        return mysqli_num_rows($sql);
    }

    if (!empty($_POST["o"])) {
        $rg = $_POST["rg"];
        $grade = $_POST["grade"];
        if ($_POST["o"] == "check") {
            echo checkUser($conn, $rg, $grade);
        } elseif ($_POST["o"] == "createAccount") {
            $name = $_POST["name"];
            $email = $_POST["email"];
            $password = md5($_POST["password"]);
            if (checkUser($conn, $rg, $grade) == 0) {
                $sql = "INSERT INTO `users` (rg, name, email, password, grade) VALUES ($rg, '$name', '$email', '$password', $grade);";
                mysqli_query($conn, $sql);
            }
        } elseif ($_POST["o"] == "login") {
            $rg = $_POST["rg"];
            $grade = $_POST["grade"];
            $password = md5($_POST["password"]);
            if (checkUser($conn, $rg, $grade) == 1) {
                $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND grade = '$grade';";
                $sql = mysqli_query($conn, $sql);
                if (mysqli_num_rows($sql) == 1) {
                    echo 1;
                }
            } else {
                echo "No user found!";
            }
        }
    } else {
        header("Location: /AlfaChat");
    }
?>