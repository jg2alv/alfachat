<?php
    require "db.inc.php";

    $sql = "SELECT * FROM `subjects`";
    $sql = mysqli_query($conn, $sql);
    $sql = mysqli_fetch_all($sql, MYSQLI_ASSOC);

    foreach($sql as $subject) {
        $teachers = explode(",", $subject["priority"]);
        foreach($teachers as $teacher) {
            $sql = "SELECT * FROM `users` WHERE id = $teacher AND status = 'online'";
            $sql = mysqli_query($conn, $sql);
            if (mysqli_num_rows($sql)) {
                $success = $teacher;
                break;
            }
        }

        echo empty($success) ? "<div title='Assim que poss&iacute;vel, sua d&uacute;vida ser&aacute; respondida.' class='menu_icon' subject='' data-id='" . base64_encode("teacher:0") . "'><div class='pic'><img src='assets/avatars/subjects/" . $subject["name"] . ".png'></div><div class='info subject_info_wrapper'><div class='subject_info_general'><div>" . $subject["name"] . "</div><div style='font-size: 12px; color: #ccc'>N&atilde;o h&aacute; professores dispon&iacute;veis</div></div><div class='subject_info_status'><div class='subject_status' style='background-color: red'></div></div></div></div>" : "<div class='menu_icon' subject='' data-id='" . base64_encode("teacher:$success") . "'><div class='pic'><img src='assets/avatars/subjects/" . $subject["name"] . ".png'></div><div class='info subject_info_wrapper'><div class='subject_info_general'><div>" . $subject["name"] . "</div><div style='font-size: 12px; color: #ccc'>H&aacute; professores dispon&iacute;veis</div></div><div class='subject_info_status'><div class='subject_status'></div></div></div></div>";
    }
?>