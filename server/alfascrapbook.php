<?php
    if (empty($_POST))
        header("Location: ../");

    require "../includes/db.inc.php";
    session_start();
    $uri = $_POST["uri"];

    function load($_uri = "", $return = false) {
        global $conn, $uri;

        empty($_uri) ? $_uri = $uri : null;

        $sql = mysqli_query($conn, "SELECT * FROM `alfascrapbooks` WHERE uri = '$_uri'");
        !mysqli_num_rows($sql) ? die() : null;

        $sql = mysqli_fetch_assoc($sql);
        $sql["files"] = array_values(array_diff(scandir("../chats/assets/alfascrapbooks/$_uri"), array(".", "..")));
        foreach($sql["files"] as $index => $value)
            $sql["files"][$index] = "data:image/" . pathinfo("../chats/assets/alfascrapbooks/$_uri/$value", PATHINFO_EXTENSION) . ";base64," . base64_encode(file_get_contents("../chats/assets/alfascrapbooks/$_uri/$value"));

        $sql["mine"] = $_SESSION["id"] === $sql["owner"] ? true : false;
        $sql["owner"] = mysqli_fetch_assoc(mysqli_query($conn, "SELECT name FROM `users` WHERE id = " . $sql["owner"]))["name"];
        if ($return) return json_encode($sql);
        echo json_encode($sql);
    }

    function duplicate() {
        global $conn, $uri;

        $id = $_SESSION["id"];
        $name = $_POST["name"];
        $time = time();

        do {
            $uri2 = hash("adler32", uniqid());
            $sql = "SELECT uri FROM `alfascrapbooks` WHERE uri = '$uri2'";
            $sql = mysqli_query($conn, $sql);
        } while (mysqli_num_rows($sql));

        $sql = "INSERT INTO `alfascrapbooks` (owner, name, uri, time) VALUES ($id, '$name', '$uri2', '$time')";
        mysqli_query($conn, $sql);

        mkdir("../chats/assets/alfascrapbooks/$uri2");
        shell_exec("cp -r ../chats/assets/alfascrapbooks/$uri/* ../chats/assets/alfascrapbooks/$uri2");

        echo load($uri2, true);
    }

    function update() {
        global $conn, $uri;

        $file = array_values(array_diff(scandir("../chats/assets/alfascrapbooks/$uri"), array(".", "..")))[intval($_FILES["file"]["name"])];
        unlink("../chats/assets/alfascrapbooks/$uri/$file");

        move_uploaded_file($_FILES["file"]["tmp_name"], "../chats/assets/alfascrapbooks/$uri/$file");
    }

    $_POST["op"]();
    die();
?>