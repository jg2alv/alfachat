<?php
    echo "<select name='class'>";
    for ($i = 1; $i <= 12; $i++) {
        if ($i < 10) {
            echo "<option value='" . $i . "'>" . $i . "° Ano Ensino Fundamental</option>";
        } else {
            echo "<option value='" . $i . "'>" . ($i-9) . "° Ano Ensino M&eacute;dio</option>";
        }
    }
    echo "</select><br>";
?>