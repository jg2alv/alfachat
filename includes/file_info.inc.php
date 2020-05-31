<?php
    function file_info($conn, $file) {
        $img = array("png", "jpg", "jpeg", "gif", "jfif");
        $video = array("mp4", "webm");
        $audio = array("mp3", "wav", "ogg");

        $sql = "SELECT extension, name FROM `files` WHERE id = $file";
        $sql = mysqli_query($conn, $sql);
        $sql = mysqli_fetch_assoc($sql);
        $sql["extension"] = strtolower($sql["extension"]);

        if (in_array($sql["extension"], $img))
            return "<img src='assets/icons/camera.png' style='width: 15px; vertical-align: bottom; margin-right: 5px'>Foto";
        else if (in_array($sql["extension"], $video))
            return "<img src='assets/icons/play.png' style='width: 20px; vertical-align: text-top; margin: 0 2.5px 0 0'>V&iacute;deo";
        else if (in_array($sql["extension"], $audio))
            return "<img src='assets/icons/audio.png' style='width: 25px; vertical-align: middle; margin: 0 -2.5px'>&Aacute;udio";
        else
            return "<img src='assets/icons/file.png' style='width: 25px; vertical-align: middle; margin: 0 2.5px 4px 2.5px'>" . $sql["name"];
    }
?>