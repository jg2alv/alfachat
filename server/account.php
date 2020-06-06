<?php
    if (empty($_POST))
        header("Location: ../");


    if (empty($_POST["ra"]) || empty($_POST["password"]) || empty($_POST["city"]) || empty($_POST["class"])) die();
    session_start();
    $time = time();
    require "../includes/db.inc.php";

    if ($_POST["teacher"]) {
        $email = filter_input(INPUT_POST, "ra", FILTER_SANITIZE_EMAIL);
        $sql = "SELECT * FROM `users` WHERE ra = '$email'";
        $_SESSION["subject"] = getSubject($sql, $email);
    } else {
        $ra = filter_input(INPUT_POST, "ra", FILTER_SANITIZE_NUMBER_INT);
        if (!in_array($_POST["city"], array("cascavel", "toledo", "pato_branco", "francisco_beltrao", "guarapuava", "campo_mourao", "ponta_grossa", "chapeco", "blumenau", "jaragua_sul")) || strlen($ra) !== 8) die();
        $city = $_POST["city"];
        $class = $_POST["class"];
        $sql = "SELECT * FROM `users` WHERE ra = '$ra' AND class = '$class' AND city = '$city'";
    }
        
    $sql = mysqli_query($conn, $sql);
    $user = mysqli_fetch_assoc($sql);
    if (!mysqli_num_rows($sql) || !password_verify($_POST["password"], $user["password"])) die();

    $id = $user["id"];
    mysqli_query($conn, "INSERT INTO `user_logs` (type, user, time) VALUES (1, $id, $time)");

    foreach ($user as $index => $value) {

        $_SESSION[$index] = $value;
    }

    echo json_encode($user);
    die();

    function getSubject($sql, $email) {
        global $conn;

        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $id = $sql["id"];
        $sql = "SELECT * FROM `subjects` WHERE priority LIKE '$id%'";
        $sql = mysqli_query($conn, $sql);
        if (mysqli_num_rows($sql))
            return mysqli_fetch_assoc($sql)["id"];
        
        $sql = "SELECT * FROM `subjects` WHERE priority LIKE '%$id%'";
        $sql = mysqli_query($conn, $sql);
        return mysqli_fetch_assoc($sql)["id"];
    }
?>