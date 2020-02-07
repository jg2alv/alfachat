<?php
    if (empty($_POST["q"])) {
        header("Location: ../");
    } else {
        $q = $_POST["q"];
    }

    require "../AlfaChat.php";
    $ac = new AlfaChat();
    $conn = $ac->DB_CONN();
    $sql = "SELECT * FROM `chats` WHERE name LIKE '%$q%' OR description LIKE '%$q%';";
    $sql = mysqli_query($conn, $sql);
    if (mysqli_num_rows($sql)) {
        $results = mysqli_fetch_all($sql, MYSQLI_ASSOC);
        echo "{";
        for ($i = 0; $i < sizeof($results); $i++) {
            if ($i != sizeof($results) - 1) {
                echo "\"$i\": " . json_encode($results[$i]) . ", ";
            } else {
                echo "\"$i\": " . json_encode($results[$i]);
            }
        }
        echo "}";
    }
    die();
?>