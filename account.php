<?php
    require("includes/db.inc.php");

    function checkUser($conn, $rg, $grade)
    {
        $sql = "SELECT * from `users` WHERE rg='$rg' AND grade='$grade';";
        return mysqli_query($conn, $sql);
    }

    if (empty($_POST["o"])) {
        header("Location: /AlfaChat");
    } else {
        $o = $_POST["o"];
    }

    $rg = $_POST["rg"];
    $grade = $_POST["grade"];

    if ($o == "check") {
        echo mysqli_num_rows(checkUser($conn, $rg, $grade));
    }

    if ($o == "create") {
        if (!mysqli_num_rows(checkUser($conn, $rg, $grade))) {
            $name = $_POST["name"];
            $email = $_POST["email"];
            $password = md5($_POST["password"]);
            $sql = "INSERT INTO `users` (rg, name, email, password, grade) VALUES ($rg, '$name', '$email', '$password', $grade);";
            mysqli_query($conn, $sql);
            // ============================= SET COOKIES =========================
            echo true;
        } else {
            $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND grade = '$grade';";
            $sql = mysqli_num_rows(mysqli_query($conn, $sql));
            if ($sql) {
                // ====================== SET COOKIES ======================
                echo true;
            } else {
                echo false;
            }
        }
    }

    if ($o == "login") {
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND grade = '$grade';";
        $sql = mysqli_num_rows(mysqli_query($conn, $sql));
        if ($sql) {
            // ====================== SET COOKIES ======================
            echo true;
        } else {
            echo false;
        }
    }
?>