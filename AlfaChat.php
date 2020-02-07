<?php
    class AlfaChat {
        public function GLOBAL_ROOT() {
            return dirname(__FILE__);
        }

        public function DB_CONN() {
            $user = "root";
            $psw = "";
            $server = "localhost";
            $db = "AlfaChat";
            return mysqli_connect($server, $user, $psw, $db);
        }
    }
?>