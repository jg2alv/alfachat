<?php
    if (empty($_POST["subject"]))
        header("Location: ../");

    require "../includes/db.inc.php";
    require "../includes/fetch_messages.inc.php";

    $subject = addslashes(html_entity_decode((base64_decode($_POST["subject"]))));
    $sql = "SELECT id FROM `doubts` WHERE subject = '$subject' AND public = 1";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
    $response = array();
    foreach($sql as $doubt) {
        $doubt = $doubt["id"];
        $sql = "SELECT * FROM `messages` WHERE doubt = $doubt";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        array_push($response, fetchMessages($conn, $sql));
    }
    echo json_encode($response);
    
    die();
?>