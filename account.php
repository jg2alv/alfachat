<?php
    require("includes/db.inc.php");

    function checkUser($conn, $rg, $grade) {
        $sql = "SELECT * from `users` WHERE rg='$rg' AND grade='$grade';";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_num_rows($sql);
        return $sql;
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
                $sql = mysqli_query($conn, $sql);
            }
        }
    } else {
        header("Location: /AlfaChat");
    }
?>