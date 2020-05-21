<?php
    require "../includes/db.inc.php";
    require "../includes/fetch_messages.inc.php";

    if (empty($_POST["subject"]))
        $sql = "SELECT * FROM `doubts` WHERE public = 1 AND assignee IS NOT NULL ORDER BY time DESC";
    else {
        $subject = addslashes(html_entity_decode(base64_decode($_POST["subject"])));
        $sql = "SELECT * FROM `doubts` WHERE subject = '$subject' AND public = 1 AND assignee IS NOT NULL ORDER BY time DESC";
    }

    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);

    $response = array();
    foreach($sql as $doubt) {
        $id = $doubt["id"];
        $sql = "SELECT * FROM `messages` WHERE doubt = $id";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        array_push($response, array(fetchMessages($conn, $sql), array($doubt["name"], $doubt["tags"], $doubt["subject"], $id, $doubt["solved"])));
    }

    echo json_encode($response);
    
    die();
?>