<?php
    require("../includes/db.inc.php");

    function checkUser($conn, $rg, $class) {
        $sql = "SELECT * from `users` WHERE rg='$rg' AND class='$class'";
        return mysqli_query($conn, $sql);
    }

    if (empty($_POST["o"])) {
        header("Location: /AlfaChat");
    } else {
        $o = $_POST["o"];
    }

    $rg = addslashes($_POST["rg"]);
    $class = addslashes($_POST["class"]);

    if ($o == "check") {
        echo mysqli_num_rows(checkUser($conn, $rg, $class));
        die();
    }

    if ($o == "create") {
        $name = addslashes($_POST["name"]);
        $email = addslashes($_POST["email"]);
        $password = md5($_POST["password"]);
        if (!mysqli_num_rows(checkUser($conn, $rg, $class))) {
            $joined = time();
            $sql = "INSERT INTO `users` (rg, name, email, password, class, photo, joined) VALUES ($rg, '$name', '$email', '$password', $class, '/AlfaChat/chats/assets/avatar.png', $joined);";
            $sql = mysqli_query($conn, $sql);
            $sql = checkUser($conn, $rg, $class);
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                setcookie($index, $value, (time() + strtotime("+30 days")), "/");
            }
            $sql = "SELECT * FROM `classes` WHERE id = '$class';";
            $sql = mysqli_query($conn, $sql);
            if (mysqli_num_rows($sql)) {
                $members = mysqli_fetch_assoc($sql)["members"] . "," . $rg;
                $member_count = sizeof(explode(",", $members));
                $sql = "UPDATE `classes` SET members='$members', member_count=$member_count WHERE id = '$class';";
            } else {
                if ($class < 10) {
                    $name = $class . "° Ano - Ensino Fundamental";
                } else {
                    $name = ($class-9) . "° Ano - Ensino Médio";
                }
                $sql = "INSERT INTO `classes` (id, name, members, member_count, created) VALUES ($class, '$name', '$rg', 1, $joined);";
            }
            $sql = mysqli_query($conn, $sql);
            echo true;
            die();
        } else {
            echo "User already exist";
            die();
        }
    }

    if ($o == "login") {
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND class = '$class';";
        $sql = mysqli_query($conn, $sql);
        if (mysqli_num_rows($sql)) {
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                setcookie($index, $value, (time() + strtotime("+30 days")), "/");
            }
            echo true;
        } else {
            echo false;
        }
        die();
    }
?>