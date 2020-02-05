<?php
    if (empty($_COOKIE)) {
        header("Location: ../");
    }

    require "../includes/db.inc.php";
    $sql = "SELECT * FROM `users` WHERE ";
    foreach ($_COOKIE as $index => $value) {
        $sql .= "$index = '$value' ";
        if (!($value == end($_COOKIE))) {
            $sql .= "AND ";
        }
    }
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_num_rows($sql);
    if ($sql) {
        foreach ($_COOKIE as $index => $value) {
            setcookie($index, $value, (time() + strtotime("+30 days")), "/");
        }
    } else {
        setcookie($index, $value, (time() - 3600), "/");
    }
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/AlfaChat/css/normalize.css">
    <?php
        require "../includes/head.inc.php";
    ?>
    <link rel="stylesheet" type="text/css" href="/AlfaChat/css/chats.css">
    <script src="../js/chats/search_input.js"></script>
    <title>AlfaChat</title>
</head>
<body>
    <div class="chat-list">
        <header>
            <input type="text" name="query" placeholder="Busca">
        </header>
    </div>

    <div class="chats">
    </div>
</body>
</html>