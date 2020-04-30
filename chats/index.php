<?php
    session_start();
    require "../includes/db.inc.php";
    require "../includes/report_bug.inc.php";

    $id = $_SESSION["id"];
    $sql = "SELECT * FROM `users` WHERE id = $id";
    $sql = mysqli_query($conn, $sql);

    if ((!empty($_GET["log_out"])) || (empty($_SESSION) || !(mysqli_num_rows($sql)))) {
        session_unset();
        session_destroy();
        header("Location: ../"); // If user isn't logged in
    } else {
        $sql = mysqli_fetch_assoc($sql);
        if (!empty($_POST["s"])) {
            echo json_encode($sql);
            die();
        }
    }

    require ($_SESSION["type"] === "teacher") ? "../UI/teacher.php" : "../UI/student.php";
?>