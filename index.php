<?php
    if (!empty($_COOKIE)) {
        header("Location: chats/");
    }
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/normalize.css">
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
        <form>
            <input type="text" name="name" placeholder="Nome completo" hidden><br hidden><br hidden>
            <input required minlength="8" maxlength="8" pattern="[0-9]*" inputmode="numeric" name="rg" placeholder="Matr&iacute;cula"><br><br>
            <input type="email" name="email" placeholder="Email" hidden><br hidden><br hidden>
            <input minlength="8" maxlength="16" type="password" name="password" placeholder="Senha" hidden><br hidden><br hidden>
            <?php
                require "includes/select.inc.php"
            ?>
            <input type="submit" value="Prosseguir">
        </form>
    </main>
    <?php
        require "includes/footer.inc.php"
    ?>
</body>
</html>