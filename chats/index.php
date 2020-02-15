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
            $conn = mysqli_connect('localhost', 'root', '', 'AlfaChat'); // Database connection

            function getClassChat($class, $conn) {
                $sql = "SELECT * FROM `classes` WHERE id = '$class'"; // Get user's class
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                $name = $sql["name"];
                $description = "Turma do ". str_replace("-", "do", $name);
                return "<div class='chat' data-id='" . base64_encode("class") . "'><div class='chat_pic'><img style='border-radius: 0;' src='../chats/assets/avatars/class/$class.png'></div><div class='chat_info'><div>$name</div><div>$description</div></div></div>";
            }
        
            $id = $_COOKIE["id"]; // Getting user id
            $sql = "SELECT * FROM `users` WHERE id = '$id'"; // Selecting logged user
            $sql = mysqli_query($conn, $sql);
            $sql = mysqli_fetch_assoc($sql);
            $class = $sql["class"];
            echo "<div class='chat_list'>"; // Starts div. **JS will break if this is removed**
            echo getClassChat($class, $conn);
            if ($sql["chats"]) { // 'chats' is either NULL or a specific value. DO NOT USE !empty() because it'll never be empty.
                $chats = explode(",", $sql["chats"]); // Getting all chats
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