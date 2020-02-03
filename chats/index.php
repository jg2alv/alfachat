<?php
    if (empty($_COOKIE["id"])) {
        header("Location: ../");
    }

    foreach ($_COOKIE as $index => $value) {
        setcookie($index, $value, (time() + strtotime("+30 days")));
    }
?>

<!doctype html>
<html>
<head>
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