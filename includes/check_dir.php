<?php
    function checkDirectory($root) {
        if (!file_exists($root)) {
            mkdir($root);
        }
    }
?>