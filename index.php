<?php
    session_start();
    if (!empty($_SESSION)) {
        header("Location: chats/"); // If user is already logged in.
    }
?>

<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/normalize.css">
    <meta charset='utf-8'>
    <meta name='viewport' content='initial-scale=1, maximum-scale=1'>
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'>
    <link rel='icon' type='image/png' href='img/logo_short.png'>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <link rel='stylesheet' type='text/css' href='css/normalize.css'>
    <link rel='stylesheet' type='text/css' href='css/default.css'>
    <link rel='stylesheet' type='text/css' href='css/login.css'>
    <?php
        foreach (array_diff(scandir("js"), array(".", "..", "chats")) as $file) {
            echo "<script defer src='js/$file'></script>";   // Load JS files
        }
    ?>
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
            <input required minlength="8" maxlength="8" pattern="[0-9]*" inputmode="numeric" name="ra" placeholder="RA" required><br><br>
            <input minlength="8" maxlength="16" type="password" name="password" placeholder="Senha" required><br data-teacher><br data-teacher>
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
            </select><br data-teacher><br data-teacher>

            <select name="city">
                <option value="cascavel">Paran&aacute; - Cascavel</option>
                <option value="toledo">Paran&aacute; - Toledo</option>
                <option value="pato_branco">Paran&aacute; - Pato Branco</option>
                <option value="francisco_beltrao">Paran&aacute; - Francisco Beltr&atilde;o</option>
                <option value="guarapuava">Paran&aacute; - Guarapuava</option>
                <option value="campo_mourao">Paran&aacute; - Campo Mour&atilde;o</option>
                <option value="ponta_grossa">Paran&aacute; - Ponta Grossa</option>
                <option value="chapeco">Santa Catarina - Chapec&oacute;</option>
                <option value="blumenau">Santa Catarina - Blumenau</option>
                <option value="jaragua_sul">Santa Catarina - Jaragu&aacute; do Sul</option>
            </select><br>

            <span data-teacher="0">Sou um professor</span><br>

            <input type="submit" value="Entrar">
        </form>
    </main>
    <footer>
        <p>AlfaChat <?php echo date("Y");?><br> <!-- Setting footer copyright year -->
            Todos os direitos reservados<br><br>
            Dúvidas?<br>
            <a href='https://t.me/bored_user' target='_blank'>Telegram</a> ou <a href='https://github.com/bored-user/AlfaChat/issues' target='_blank'>Github</a>.
        </p>
    </footer>
</body>
</html>