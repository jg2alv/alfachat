<?php
    if (empty($_POST))
        header("Location: ../");

    session_start();
    list($id, $password) = json_decode($_POST["cred"]);

    if (empty($_SESSION) || $id !== $_SESSION["id"] || $password !== $_SESSION["password"])
        header("Location: ../");

    require "../includes/db.inc.php";
    require "../includes/fetch_messages.inc.php";
    $subject = $_SESSION["subject"];

    $sql = "(SELECT * FROM `doubts` WHERE subject = '$subject' AND assignee IS NULL AND solved = 0) UNION (SELECT * FROM `doubts` WHERE assignee = $id AND solved = 0)";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);

    $response = array();
    foreach($sql as $doubt) {
        $id = $doubt["id"];
        $sql = "SELECT * FROM `messages` WHERE doubt = $id";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        $msgs = array();
        foreach($sql as $msg)
            array_push($msgs, array(fetchMessages($conn, $sql), array($doubt["name"], $doubt["tags"])));
        array_push($response, $msgs);
    }

    echo json_encode($response);
?>