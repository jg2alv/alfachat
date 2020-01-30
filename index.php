<?php
    if (!empty($_SESSION["login_success"])) {
        header("Location: browse/");
    }

    if (!empty($_POST["rg"]) && !empty($_POST["password"])) {
        require "includes/db.inc.php";
        $rg = $_POST["rg"];
        $password = md5($_POST["password"]);
        $sql = "SELECT * FROM `users` WHERE `rg` = '$rg'";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_num_rows($sql);
        if ($sql) {
            # Mudar a pagina para que o campo "SENHA" apareca MAS sem mudar o endereco (com JS).
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
    <a class="logo_link" href="http://alfaonline.com.br/alfa/" target="_blank">
        <img class="logo_image" src="img/logo.png">
    </a>
    <main>
        <form method="POST">
            <input name="rg" type="tel" pattern="[0-9]*" required inputmode="numeric" placeholder="Matr&iacute;cula"><br>
            <?php
                if (!empty($error_login)) {
                    echo "<span class='error'>Login inv&aacute;lido! Tente novamente.</span><br>";
                    unset($error_login);
                }
            ?>
            <input type="submit" value="Prosseguir" class="submit">
        </form>
    </main>
    <?php
        require "includes/footer.inc.php";
    ?>
</body>

</html>