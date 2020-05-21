<?php
    if (empty($_POST["q"])) {
        header("Location: ../"); // If user tries to access directly
    } else {
        $q = filter_input(INPUT_POST, "q", FILTER_SANITIZE_SPECIAL_CHARS);
    }

    session_start();
    require "../includes/db.inc.php";

    $class = $_SESSION["class"];
    $id = $_SESSION["id"];
    $city = $_SESSION["city"];

    $sql = "SELECT * FROM `users` WHERE (name LIKE '%$q%' OR ra LIKE '%$q%') AND class = '$class' AND city = '$city' AND id <> $id;";
    
    $sql = mysqli_query($conn, $sql); // Search
    if (mysqli_num_rows($sql))
        echo json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC));
    die();
?>