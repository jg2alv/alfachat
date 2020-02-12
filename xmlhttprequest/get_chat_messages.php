<?php
    if (empty($_POST["c"])) {
        header("Location: ../");
    } else {
        $c = $_POST["c"];
    }

    $conn = mysqli_connect("localhost", "root", "", "AlfaChat");
    $sql = "SELECT *";
?>