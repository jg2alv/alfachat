<?php
    session_start();
    require_once "../includes/db.inc.php";

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
    <div class="side_menu">
        <div class="side_menu_visible">
            <header>
                <img id="user_img"><br>
                <span id="user_name"></span><br>
                <span id="user_rg"></span>
            </header>
            <main>
                <div id="new_group" class="menu_icon"><div class="pic"><img style="max-width: 50%"  src="assets/icons/group.png" alt="Novo Grupo"></div><div class="info" style="flex: 4">Novo Grupo</div></div>
                <div id="config" class="menu_icon"><div class="pic"><img style="max-width: 50%" src="assets/icons/settings.png" alt="Config"></div><div class="info" style="flex: 4">Configura&ccedil;&otilde;es</div></div>
            </main>
        </div>
        <div class="side_menu_bg"></div>
    </div>
    <form class="submenu" id="new_group_menu" enctype="multipart/form-data" style="flex-direction: column">
        <div class="submenu_container" style="display: flex; flex: 1">
            <div class="pic">
                <input id="group_pic_input" type="file" style="display: none" accept="image/*">
                <label for="group_pic_input" style="display: flex; cursor: pointer;">
                    <img src="assets/icons/camera.png" alt="Camera" style="margin: auto;">
                </label>
            </div>
            <div class="info">
                <label>Nome do grupo:</label>
                <input type="text" name="gn">
            </div>
        </div>
        <div class="submenu_btns">
            <div onclick="hideSideMenu()">FECHAR</div>
            <button type="submit">PROSSEGUIR</button>
        </div>
    </form>
    <div class="submenu" id="settings_menu">

    </div>
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
                    echo "<div class='chat' data-id='" . base64_encode($chat_info["id"]) . "'><div class='pic'><img style='border-radius: 50%;' src='$photo'></div><div class='info'><div>$name</div><div>$bio</div></div></div>";
                } else { // If that's a group
                    $chat = explode(":", $chat)[1];
                    if ($chat < 13) { // If it's a class group (group:1 to group:12)
                        if ($chat > 9) {
                            $chat = ($chat-9) . "° Ano - Ensino M&eacute;dio";
                        } else {
                            $chat = $chat . "° Ano - Ensino Fundamental";
                        }
                        $bio = "Turma do " . str_replace("-", "do", $chat);
                        echo "<div class='chat' data-id='" . base64_encode("group:" . $_SESSION["class"]) . "'><div class='pic'><img src='assets/avatars/groups/class/" . $_SESSION["class"] . ".png'></div><div class='info'><div>$chat</div><div>$bio</div></div></div>";
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
                        echo "<div class='chat' data-id='" . base64_encode("group:" . $_chat_info["id"]) . "'><div class='pic'><img src='$photo'></div><div class='info'><div>$name</div><div>$bio</div></div></div>";
                    }
                }
            }
            echo "</div>";
        ?>
    </div>

    <div class="chats">
        <div class="choose_chat">Escolha uma conversa para entrar</div>
        <header>
            <img src="assets/icons/back_arrow.png" alt="Back Arrow" onclick="closeChat()">
            <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-direction: column">
                <div></div>
                <div></div>
            </div>
        </header>
        <div class="message_area"></div>
        <form class="input_area" enctype="multipart/form-data">
            <input id="file_input" type="file" style="display: none">
            <label for="file_input" style="height: 16px; width: 60px;">
                <img src="assets/icons/file.png" alt="Carregar arquivo">
            </label>
            <input placeholder="Escreva sua mensagem..." type="text">
        </form>
    </div>
</body>
</html>