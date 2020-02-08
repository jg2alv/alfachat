<?php
    if (!empty($_COOKIE)) {
        header("Location: chats/");
    }
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/normalize.css">
    <meta charset='utf-8'>
    <meta name='viewport' content='initial-scale=1, maximum-scale=1'>
    <link rel='stylesheet' type='text/css' href='css/default.css'>
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'>
    <link rel='icon' type='image/png' href='img/logo_short.png'>
    <script src='js/jquery-3.4.1.min.js'></script>
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
            <select name="class">
                <option value="1">1° Ano Ensino Fundamental</option>
                <option value="2">2° Ano Ensino Fundamental</option>
                <option value="3">3° Ano Ensino Fundamental</option>
                <option value="4">4° Ano Ensino Fundamental</option>
                <option value="5">5° Ano Ensino Fundamental</option>
                <option value="6">6° Ano Ensino Fundamental</option>
                <option value="7">7° Ano Ensino Fundamental</option>
                <option value="8">8° Ano Ensino Fundamental</option>
                <option value="9">9° Ano Ensino Fundamental</option>
                <option value="10">1° Ano Ensino Médio</option>
                <option value="11">2° Ano Ensino Médio</option>
                <option value="12">3° Ano Ensino Médio</option>
            </select>
            <br>
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