<?php
    if (empty($_COOKIE)) {
        header("Location: ../"); // If user isn't logged in
    }

    $conn = mysqli_connect('localhost', 'root', '', 'AlfaChat');
    
    $sql = "SELECT * FROM `users` WHERE ";
    foreach ($_COOKIE as $index => $value) { // Filling SQL query lol
        $sql .= "$index = '$value' ";
        if (!($value == end($_COOKIE))) {
            $sql .= "AND ";
        }
    }
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_num_rows($sql);
    foreach ($_COOKIE as $index => $value) {
        if ($sql) {
            setcookie($index, $value, (time() + strtotime("+30 days")), "/"); // Resetting cookies
        } else {
            setcookie($index, $value, (time() - 3600), "/"); // Deleting cookies
            $refresh = 1; // I tired to use a 'break' here but it doesn't work. So just let PHP finish it's loop :)
        }
    }

    if (!empty($refresh)) {
        header("Refresh: 0"); // Refresh page to redirect user to login page.
        die();
    }
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="../css/normalize.css">
    <meta charset='utf-8'>
    <meta name='viewport' content='initial-scale=1, maximum-scale=1'>
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'>
    <link rel='icon' type='image/png' href='../img/logo_short.png'>
    <script src='../js/jquery-3.4.1.min.js'></script>
    <link rel="stylesheet" type="text/css" href="../css/chats.css">
    <script src="../js/chats/chat_search.js"></script>
    <script src="../js/chats/open_chat.js"></script>
    <script src="../js/chats/message_sender.js"></script>
    <title>AlfaChat | Conversas</title>
</head>
<body>
    <div class="chat_selector">
        <header>
            <img src="assets/icons/menu.png" alt="Menu icon">
            <input type="text" name="query" placeholder="Busca">
        </header>
        <div class="chat_result_list" hidden></div>
        <?php
            define("CHAT_LOADER", 1); // Security measure
            require "../includes/chat_loader.php";
        ?>
    </div>

    <div class="chats">
        <div class="choose_chat">Escolha uma conversa para entrar</div>
        <header>
            <div></div>
        </header>
        <div class="message_area"></div>
        <form class="input_area" enctype="multipart/form-data">
            <input id="file_input" type="file" style="display: none">
            <label for="file_input" style="height: 16px;">
                <img src="assets/icons/file.png" alt="Carregar arquivo">
            </label>
            <input placeholder="Escreva sua mensagem..." type="text">
        </form>
    </div>
</body>
</html>