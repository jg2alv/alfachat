<?php
    if (empty($_POST["q"])) {
        header("Location: ../"); // If user tries to access directly
    } else {
        $q = $_POST["q"];
    }

    session_start();

    $conn = mysqli_connect('localhost', 'root', '', 'AlfaChat'); // Database connection
    $class = $_SESSION["class"];
    $sql = "SELECT * FROM `users` WHERE (name LIKE '%$q%' OR rg LIKE '%$q%') AND (class = '$class');"; // Select users where it's name/ email matches query and class match user's class (user's will only be allowed to talk to others from the same class)
    $sql = mysqli_query($conn, $sql); // Search
    if (mysqli_num_rows($sql)) {
        echo json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC));
    }
    die();
?>