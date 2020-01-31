<?php
    require "includes/db.inc.php";
    if (!empty($_POST["rg"])) {
        $rg = $_POST["rg"];
        $sql = "SELECT * from `users` WHERE rg='$rg'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_num_rows($sql);
        echo $sql;
    } else {
        header("Location: /AlfaChat");
    }
?>