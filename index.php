<?php
    if (!empty($_SESSION["login_success"])) {
        header("Location: browse/")
    }

    if (!empty($_POST["rg"]) && !empty($_POST["password"])) {
        require "includes/db.inc.php";
        $rg = $_POST["rg"];
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE `rg` = '$rg' AND `password` = '$password'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_num_rows($sql);
        if ($sql) {
            $_SESSION["rg"] = $rg;
            $_SESSION["password"] = $password;
            $_SESSION["login_success"] = 1;
            header("Location: index.php");
        } else {
            $error_login = 1;
        }
    }
?>

<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Didact+Gothic">
    <title>AlfaChat - Entrar</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <link rel="icon" type="image/png" href="img/favicon.png" sizes="80x66">
</head>

<body>
    <a href="http://alfaonline.com.br/alfa/" target="_blank">
        <img class="logo" src="img/logo.png">
    </a>
    <div class="info_div">
        <form method="POST">
            <label for="rg">Matrícula:</label><br>
            <input id="rg" type="number" name="rg" required><br>
            <label for="password">Senha:</label><br>
            <input id="password" type="password" name="password" required>
            <?php
                if (!empty($error_login)) {
                    echo "<span class='error'>Login inv&aacute;lido! Tente novamente.</span><br>";
                    unset($error_login);
                }
            ?>
            <a href="register/">Criar uma conta</a><br><br>
            <a href="forgot/">Esqueci a senha</a><br><br>
            <input type="submit" value="Entrar" class="button">
        </form>
    </div>
    <?php
        require "includes/footer.inc.php";
    ?>
</body>

</html>