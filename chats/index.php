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
    foreach ($_COOKIE as $index => $value) {
        if ($sql) {
            setcookie($index, $value, (time() + strtotime("+30 days")), "/");
        } else {
            setcookie($index, $value, (time() - 3600), "/");
            $refresh = 1;
        }
    }

    if (!empty($refresh)) {
        header("Refresh: 0");
        die();
    }
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="/css/normalize.css">
    <?php
        require "../includes/head.inc.php";
    ?>
    <link rel="stylesheet" type="text/css" href="/css/chats.css">
    <script src="../js/chats/chat_search.js"></script>
    <title>AlfaChat</title>
</head>
<body>
    <div class="chat_selector">
        <header>
            <input type="text" name="query" placeholder="Busca">
        </header>
        <div class="chat_result_list" hidden></div>
        <?php
            require "../includes/chat_loader.php";
        ?>
    </div>

    <div class="chats">
        <div class="choose_chat">Escolha uma conversa para entrar</div>
    </div>
</body>
</html>