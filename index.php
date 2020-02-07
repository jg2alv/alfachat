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
    <header>
        <a href="http://alfaonline.com.br/alfa/" target="_blank">
            <img src="img/logo_long.png" alt="Alfa Rede de Ensino">
        </a>
    </header>
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
    <footer>
        <p>AlfaChat <?php echo date("Y");?><br>
            Todos os direitos reservados<br><br>
            Dúvidas?<br>
            <a href='https://t.me/bored_user' target='_blank'>Telegram</a> ou <a href='https://github.com/bored-user' target='_blank'>Github</a>.
        </p>
    </footer>
</body>
</html>