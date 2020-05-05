<?php
    function checkDirectory($path) {
        if (!file_exists($path))
            mkdir($path);
    }
?>