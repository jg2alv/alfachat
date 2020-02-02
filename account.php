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
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                setcookie($index, $value, (time() + strtotime("+30 days")));
            }
        } else {
            $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND grade = '$grade';";
            $sql = mysqli_query($conn, $sql);
            if (mysqli_num_rows($sql)) {
                $sql = mysqli_fetch_assoc($sql);
                foreach ($sql as $index => $value) {
                    setcookie($index, $value, (time() + strtotime("+30 days")));
                }
                echo true;
            } else {
                echo false;
            }
        }
    }

    if ($o == "login") {
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND grade = '$grade';";
        $sql = mysqli_query($conn, $sql);
        if (mysqli_num_rows($sql)) {
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                setcookie($index, $value, (time() + strtotime("+30 days")));
            }
            echo true;
        } else {
            echo false;
        }
    }
?>