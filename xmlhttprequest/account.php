<?php
    $conn = mysqli_connect('localhost', 'root', '', 'AlfaChat'); // Database connection

    function checkUser($conn, $rg, $class) {
        $sql = "SELECT * from `users` WHERE rg='$rg' AND class='$class'";
        return mysqli_query($conn, $sql); // Return the query. If user exist.
    }

    if (empty($_POST["o"])) {
        header("Location: /"); // If someone tries to access through browser.
    } else {
        $o = $_POST["o"];
    }

    // ============= SAFETY MEASURES
    $rg = mysqli_real_escape_string($conn, $_POST["rg"]);
    $class = mysqli_real_escape_string($conn, $_POST["class"]);

    if ($o == "check") {
        echo mysqli_num_rows(checkUser($conn, $rg, $class)); // If the intended operation is a check one.
        die();
    }

    if ($o == "create") { // If operation is a create.
        $name = mysqli_real_escape_string($conn, $_POST["name"]);
        $email = mysqli_real_escape_string($conn, $_POST["email"]);
        $password = md5($_POST["password"]);
        if (!mysqli_num_rows(checkUser($conn, $rg, $class))) { // If don't user exist.
            $joined = time();
            // ============= CREATING USER
            $sql = "INSERT INTO `users` (rg, name, email, password, class, photo, joined) VALUES ($rg, '$name', '$email', '$password', $class, 0, $joined);";
            $sql = mysqli_query($conn, $sql);
            $sql = checkUser($conn, $rg, $class); // Get user info.
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                setcookie($index, $value, (time() + strtotime("+30 days")), "/"); // Setting cookies.
            }
            $sql = "SELECT * FROM `classes` WHERE id = '$class';";
            $sql = mysqli_query($conn, $sql);
            if (mysqli_num_rows($sql)) {
                $members = mysqli_fetch_assoc($sql)["members"] . "," . $rg;
                // ============= UPDATING USER'S CLASS
                $sql = "UPDATE `classes` SET members='$members' WHERE id = '$class';"; // Updating class' members.
            } else {
                if ($class < 10) { // If user is on HS or regular.
                    $name = $class . "° Ano - Ensino Fundamental";
                } else {
                    $name = ($class-9) . "° Ano - Ensino Médio";
                }
                // ============= CREATING USER'S CLASS
                $sql = "INSERT INTO `classes` (id, name, members, created) VALUES ($class, '$name', '$rg', $joined);";
            }
            $sql = mysqli_query($conn, $sql);
            echo true;
            die();
        } else { // If user exist.
            echo "User already exist";
            die();
        }
    }

    if ($o == "login") { // Login operation.
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE rg = '$rg' AND password = '$password' AND class = '$class';";
        $sql = mysqli_query($conn, $sql);
        if (mysqli_num_rows($sql)) {
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                setcookie($index, $value, (time() + strtotime("+30 days")), "/"); // Setting cookies.
            }
            echo true;
        } else {
            echo false; // If user doesn't exist.
        }
        die();
    }
?>