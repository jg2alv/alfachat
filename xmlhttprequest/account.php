<?php
    session_start();
    require_once "../includes/db.inc.php";


    function checkUser($conn, $ra, $class) {
        $sql = "SELECT * from `users` WHERE ra='$ra' AND class='$class'";
        return mysqli_query($conn, $sql); // Return the query. If user exist.
    }

    if (empty($_POST["o"])) {
        header("Location: ../"); // If someone tries to access through browser.
    }

    $o = $_POST["o"];

    // ============= SAFETY MEASURES
    $ra = mysqli_real_escape_string($conn, $_POST["ra"]);
    $class = $_POST["class"];

    if ($o == "check") {
        echo mysqli_num_rows(checkUser($conn, $ra, $class)); // If the intended operation is a check one.
        die();
    }

    if ($o == "create") { // If operation is a create.
        $name = mysqli_real_escape_string($conn, $_POST["name"]);
        $email = mysqli_real_escape_string($conn, $_POST["email"]);
        $password = md5($_POST["password"]);
        if (!mysqli_num_rows(checkUser($conn, $ra, $class))) { // If don't user exist.
            $joined = time();
            // ============= CREATING USER
            $sql = "INSERT INTO `users` (ra, name, email, password, class, chats, joined) VALUES ($ra, '$name', '$email', '$password', $class, 'group:$class', $joined);";
            mysqli_query($conn, $sql);
            $sql = checkUser($conn, $ra, $class); // Get user info.
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                $_SESSION[$index] = $value;
            }
            $sql = "SELECT * FROM `groups` WHERE id = '$class';";
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);

            // ============= UPDATING USER'S CLASS
            if (!$sql["members"]) {
                $members = $_SESSION["id"];
            } else {
                $members = $sql["members"] . "," . $_SESSION["id"];
            }
            $sql = "UPDATE `groups` SET members='$members' WHERE id = '$class';"; // Updating class' members.
            mysqli_query($conn, $sql);

            // ============= RETURNING USER DATA
            $sql = checkUser($conn, $ra, $class);
            print_r(json_encode(mysqli_fetch_assoc($sql)));
            die();
        } else { // If user exist.
            echo "User already exist";
            die();
        }
    }

    if ($o == "login") { // Login operation.
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE ra = '$ra' AND password = '$password' AND class = '$class';";
        $sql = mysqli_query($conn, $sql);
        if (mysqli_num_rows($sql)) {
            $sql = mysqli_fetch_assoc($sql);
            foreach ($sql as $index => $value) {
                $_SESSION[$index] = $value;
            }
            print_r(json_encode($sql));
        } else {
            echo false; // If user doesn't exist.
        }
        die();
    }
?>