<?php
    session_start();

    $conn = mysqli_connect('localhost', 'root', '', 'AlfaChat'); // Database connection
    $id = $_SESSION["id"];
    $sql = "SELECT * FROM `users` WHERE id = $id;";
    $sql = mysqli_query($conn, $sql);

    if (empty($_SESSION) || !(mysqli_num_rows($sql))) {
        session_unset();
        session_destroy();
        header("Location: ../"); // If user isn't logged in
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
    <?php
        $files = array_diff(scandir("../js/chats"), array(".", ".."));
        foreach ($files as $file) {
            echo "<script src='../js/chats/" . $file . "'></script>";   // Load JS files
        }
    ?>
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
            echo "<div class='chat_list' ";
            $id = $_SESSION["id"]; // Getting user id
            $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Selecting logged user
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            echo "data-chats='" . base64_encode($sql["chats"]) . "'>";
            foreach (explode(",", $sql["chats"]) as $chat) {
                if (strpos($chat, ":") === false) { // If that's not a group
                    $sql = "SELECT * FROM `users` WHERE id = '$chat'";
                    $sql = mysqli_query($conn, $sql);
                    $chat_info = mysqli_fetch_assoc($sql);
                    $photo = $chat_info["photo"];
                    if (!$photo) {
                        $photo = "assets/avatars/user/default.png"; // If user doesn't have a photo (setting according to js/chats relative path)
                    }
                    $name = $chat_info["name"];
                    $bio = $chat_info["bio"];
                    echo "<div class='chat' data-id='" . base64_encode($chat_info["id"]) . "'><div class='chat_pic'><img style='border-radius: 50%;' src='$photo'></div><div class='chat_info'><div>$name</div><div>$bio</div></div></div>";
                } else { // If that's a group
                    $chat = explode(":", $chat)[1];
                    if ($chat < 13) { // If it's a class group (group:1 to group:12)
                        if ($chat > 9) {
                            $chat = ($chat-9) . "° Ano - Ensino M&eacute;dio";
                        } else {
                            $chat = $chat . "° Ano - Ensino Fundamental";
                        }
                        $bio = "Turma do " . str_replace("-", "do", $chat);
                        echo "<div class='chat' data-id='" . base64_encode("group:" . $_SESSION["class"]) . "'><div class='chat_pic'><img src='assets/avatars/groups/class/" . $_SESSION["class"] . ".png'></div><div class='chat_info'><div>$chat</div><div>$bio</div></div></div>";
                    } else { // If that's not a class group
                        $sql = "SELECT * FROM `groups` WHERE id = '$chat'";
                        $sql = mysqli_query($conn, $sql);
                        $chat_info = mysqli_fetch_assoc($sql);
                        $photo = $chat_info["photo"];
                        if (!$photo) {
                            $photo = "assets/avatars/groups/default.png"; // If group doesn't have a photo (setting according to js/chats relative path)
                        }
                        $name = $chat_info["name"];
                        $bio = $chat_info["description"];
                        echo "<div class='chat' data-id='" . base64_encode("group:" . $_chat_info["id"]) . "'><div class='chat_pic'><img src='$photo'></div><div class='chat_info'><div>$name</div><div>$bio</div></div></div>";
                    }
                }
            }
            echo "</div>";
        ?>
    </div>

    <div class="chats">
        <div class="choose_chat">Escolha uma conversa para entrar</div>
        <header>
            <div></div>
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