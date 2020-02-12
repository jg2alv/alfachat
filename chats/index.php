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
    <link rel="stylesheet" type="text/css" href="../css/normalize.css">
    <meta charset='utf-8'>
    <meta name='viewport' content='initial-scale=1, maximum-scale=1'>
    <link rel='stylesheet' type='text/css' href='../css/default.css'>
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'>
    <link rel='icon' type='image/png' href='../img/logo_short.png'>
    <script src='../js/jquery-3.4.1.min.js'></script>
    <link rel="stylesheet" type="text/css" href="../css/chats.css">
    <script src="../js/chats/chat_search.js"></script>
    <title>AlfaChat  |  Conversas</title>
</head>
<body>
    <div class="chat_selector">
        <header>
            <input type="text" name="query" placeholder="Busca">
        </header>
        <div class="chat_result_list" hidden></div>
        <?php
            define("CHAT_LOADER", 1);
            require "../includes/chat_loader.php";
        ?>
    </div>

    <div class="chats">
        <div class="choose_chat">Escolha uma conversa para entrar</div>
    </div>
</body>
</html>