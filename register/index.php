<?php
    if (!empty($_POST["rg"]) && !empty($_POST["name"]) && !empty($_POST["email"]) && !empty($_POST["password"])) {
        require "../includes/db.inc.php";
        $rg = $_POST["rg"];
        $name = $_POST["name"];
        $email = $_POST["email"];
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE `rg` = '$rg' OR `email` = '$email'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_num_rows($sql);
        if ($sql) {
            $error_register = 1;
        } else {
            $sql = "INSERT INTO `users` (rg, name, email, password) VALUES ('$rg', '$name', '$email', '$password')";
            $sql = mysqli_query($conn, $sql);
        }
    }
?>

<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="../css/main.css">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Didact+Gothic">
    <title>AlfaChat - Entrar</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <link rel="icon" type="image/png" href="../img/favicon.png" sizes="80x66">
</head>

<body>
    <a href="http://alfaonline.com.br/alfa/" target="_blank">
        <img class="logo" src="../img/logo.png">
    </a>
    <div class="info_div">
        <form method="POST">
            <label for="rg">Matrícula:</label><br>
            <input id="rg" type="number" name="rg"><br>
            <label for="name">Nome completo:</label><br>
            <input id="name" name="name" type="text"><br>
            <label for="email">E-mail:</label><br>
            <input id="email" name="email" type="email"><br>
            <label for="password">Senha:</label><br>
            <input type="password" name="password" required>
            <?php
                if (!empty($error_register)) {
                    echo "<span class='error'>Esse usu&aacute;rio j&aacute; existe! Tente novamente.</span><br>";
                    unset($error_register);
                }
            ?>
            <a href="../">Entrar</a><br><br>
            <input type="submit" value="Criar conta" class="button register">
        </form>
    </div>
    <?php
        require "../includes/footer.inc.php";
    ?>
</body>

</html>