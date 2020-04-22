<?php
    if (!empty($_POST["ra"]) & !empty($_POST["password"]) & !empty($_POST["city"]) & !empty($_POST["class"])) {
        login();
    } else {
        header("Location: ../"); // If someone tries to access through browser.
    }

    function login() {
        if (!in_array($_POST["city"], array("cascavel", "toledo", "pato_branco", "francisco_beltrao", "guarapuava", "campo_mourao", "ponta_grossa", "chapeco", "blumenau", "jaragua_sul"))) {
            echo false;
        } else {
            session_start();
            require "../includes/db.inc.php";

            if ($_POST["teacher"]) {
                $email = filter_input(INPUT_POST, "ra", FILTER_SANITIZE_EMAIL);
                $sql = "SELECT * FROM `teachers` WHERE email = '$email'";  
            } else {
                $ra = filter_input(INPUT_POST, "ra", FILTER_SANITIZE_NUMBER_INT);
                $city = $_POST["city"];
                $class = $_POST["class"];
                $sql = "SELECT * FROM `users` WHERE ra = '$ra' AND class = '$class' AND city = '$city'";
            }
                
            $sql = mysqli_query($conn, $sql);
            if (!mysqli_num_rows($sql)) {
                echo false;
                die();
            }
            $sql = mysqli_fetch_assoc($sql);

            if (!password_verify($_POST["password"], $sql["password"])) {
                echo false;
                die();
            }

            foreach ($sql as $index => $value) {
                $_SESSION[$index] = $value;
            }

            echo json_encode($sql);
            die();
        }
    }
?>