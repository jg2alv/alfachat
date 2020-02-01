<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <link rel="stylesheet" type="text/css" href="css/login.css">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Didact+Gothic">
    <link rel="icon" type="image/png" href="img/logo_short.png">
    <script src="js/jquery-3.4.1.min.js"></script>
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
            <input type="tel" pattern="[0-9]*" inputmode="numeric" name="rg" placeholder="Matr&iacute;cula"><br><br>
            <input type="email" name="email" placeholder="Email" hidden><br hidden><br hidden>
            <input type="password" name="password" placeholder="Senha" hidden><br hidden><br hidden>
            <select name="grade">
                <?php
                    require "includes/html_select.inc.php"
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