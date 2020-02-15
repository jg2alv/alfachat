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
    <script src="../js/chats/open_chat.js"></script>
    <script src="../js/chats/chat_search.js"></script>
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
            function getClassChat($class, $conn) {
                $sql = "SELECT * FROM `groups` WHERE id = '$class'"; // Get user's class
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                $name = $sql["name"];
                $bio = "Turma do ". str_replace("-", "do", $name);
                return "<div class='chat' data-id='" . base64_encode("class") . "'><div class='chat_pic'><img style='border-radius: 0;' src='../chats/assets/avatars/class/$class.png'></div><div class='chat_info'><div>$name</div><div>$bio</div></div></div>";
            }
        
            $id = $_SESSION["id"]; // Getting user id
            $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Selecting logged user
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $class = $sql["class"];
            $chats = $sql["chats"];
            echo "<div class='chat_list'>"; // Starts div. **JS will break if this is removed**
            echo getClassChat($class, $conn);
            if ($chats) { // 'chats' is either NULL or a specific value. DO NOT USE !empty() because it'll never be empty.
                if (strlen($chats) > 1) {
                    $chats = explode(",", $chats); // Getting all chats
                    foreach ($chats as $user) {
                        $sql = "SELECT * FROM `users` WHERE id = '$user'"; // 'chats' row will now store user IDs.
                        $sql = mysqli_query($conn, $sql);
                        $user_info = mysqli_fetch_assoc($sql);
                        if (!$user_info["photo"]) {
                            $photo = "../chats/assets/avatars/user/default.png"; // If user doesn't have a photo
                        } else {
                            $photo = $user_info["photo"];
                        }
                        $name = $user_info["name"];
                        $bio = $user_info["bio"]; // Users now have a bio :)
                        echo "<div class='chat' data-id='" . base64_encode($user_info["rg"]) . "'><div class='chat_pic'><img src='$photo'></div><div class='chat_info'><div>$name</div><div>$bio</div></div></div>";
                    }
                } else {
                    $sql = "SELECT * FROM `users` WHERE id = '$chats'"; // 'chats' row will now store user IDs.
                    $sql = mysqli_query($conn, $sql);
                    $user_info = mysqli_fetch_assoc($sql);
                    if (!$user_info["photo"]) {
                        $photo = "../chats/assets/avatars/user/default.png"; // If user doesn't have a photo
                    } else {
                        $photo = $user_info["photo"];
                    }
                    $name = $user_info["name"];
                    $bio = $user_info["bio"]; // Users now have a bio :)
                    echo "<div class='chat' data-id='" . base64_encode($user_info["rg"]) . "'><div class='chat_pic'><img src='$photo'></div><div class='chat_info'><div>$name</div><div>$bio</div></div></div>";
                }
            }
            echo "</div>"; // Close chat_list div.
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