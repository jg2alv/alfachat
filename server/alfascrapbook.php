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
        $files = array();
        foreach($sql["files"] as $index => $value) {
            $files[$index] = array();
            $files[$index][0] = "assets/alfascrapbooks/$_uri/" . $value;
            $files[$index][1] = "data:image/" . pathinfo("../chats/" . $files[$index][0], PATHINFO_EXTENSION) . ";base64," . base64_encode(file_get_contents("../chats/" . $files[$index][0]));
        }

        $sql["files"] = $files;
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
        $file = "../chats/assets/alfascrapbooks/$uri/" . $_FILES["slide"]["name"];
        unlink($file);

        move_uploaded_file($_FILES["slide"]["tmp_name"], $file);
        echo load($uri, true);
    }

    $_POST["op"]();
?>