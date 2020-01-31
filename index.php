<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <link rel="stylesheet" type="text/css" href="css/login.css">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Didact+Gothic">
    <link rel="icon" type="image/png" href="img/logo_short.png">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script src="js/login.js"></script>
    <title>AlfaChat - Entrar</title>
</head>
<body>
    <?php
        require "includes/header.inc.php"
    ?>
    <main>
        <div class="form">
            <input name="name" required placeholder="Nome completo" hidden><br hidden><br hidden>
            <input name="rg" required placeholder="Matr&iacute;cula"><br><br hidden>
            <input name="email" required placeholder="Email" hidden><br hidden><br hidden>
            <input name="password" required placeholder="Senha" hidden><br hidden>
            <button>Prosseguir</button>
        </div>
    </main>
    <?php
        require "includes/footer.inc.php"
    ?>
</body>
</html>