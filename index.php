<?php
    if (!empty($_COOKIE["id"])) {
        header("Location: chats/");
    }
?>

<!doctype html>
<html>
<head>
    <?php
        require "includes/head.inc.php";
    ?>
    <link rel="stylesheet" type="text/css" href="css/login.css">
    <script src="js/account.js"></script>
    <title>AlfaChat - Entrar</title>
</head>
<body>
    <?php
        require "includes/header.inc.php"
    ?>
    <main>
        <div class="form">
            <input type="text" name="name" placeholder="Nome completo" hidden><br hidden><br hidden>
            <input type="tel" name="rg" placeholder="Matr&iacute;cula"><br><br>
            <input type="email" name="email" placeholder="Email" hidden><br hidden><br hidden>
            <input type="password" name="password" placeholder="Senha" hidden><br hidden><br hidden>
            <select name="class">
                <?php
                    require "includes/select.inc.php"
                ?>
            </select><br>
            <button>Prosseguir</button>
        </div>
    </main>
    <?php
        require "includes/footer.inc.php"
    ?>
</body>
</html>