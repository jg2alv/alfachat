<?php
    if (empty($_POST))
        header("Location: ../");
    
    require "../includes/db.inc.php";
    
    $sql = "SELECT id, name, subject FROM `doubts`";
    $sql = mysqli_query($conn, $sql);
    
    echo json_encode(mysqli_fetch_all($sql, MYSQLI_ASSOC));
    die();
?>