<?php
    function fetchMessages($conn, $sql) {
        $response = array();
        foreach($sql as $msg) {
            if ($msg["file"]) {
                $file = $msg["file"];
                $sql = "SELECT * FROM `files` WHERE id = $file";
                $sql = mysqli_query($conn, $sql);
                $sql = mysqli_fetch_assoc($sql);
                $msg["file"] = json_encode($sql);
            }
            $msg["content"] = html_entity_decode(base64_decode($msg["content"]));
            array_push($response, $msg);
        }
        return json_encode($response); // Returning it to JS
    }
?>