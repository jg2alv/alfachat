<?php
    session_start();
    require "../includes/db.inc.php";
    require "../includes/remove_from_chatlist.inc.php";

    $id = $_SESSION["id"];
    $sql = "SELECT * FROM `users` WHERE id = $id";
    $sql = mysqli_query($conn, $sql);

    if ((!empty($_GET["log_out"])) || (empty($_SESSION) || !(mysqli_num_rows($sql)))) {
        session_unset();
        session_destroy();
        header("Location: ../"); // If user isn't logged in
    } else {
        $sql = mysqli_fetch_assoc($sql);
        if (!empty($_POST["cred"]) && $_POST["cred"] === $_SESSION["ra"] . ":" . $_SESSION["password"]) {
            echo json_encode($sql);
            die();
        }
    }
?>

<!doctype html>
<html>
<head>
    <base target='_blank'>
    <script src='https://code.jquery.com/jquery-3.4.1.min.js' integrity='sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=' crossorigin='anonymous'></script>
    <link rel='stylesheet' type='text/css' href='../css/normalize.css'>
    <link rel='stylesheet' type='text/css' href='../css/chats.css'>

    <?php
        foreach (array_diff(scandir('../js/chats'), array('.', '..')) as $file) {
            echo "<script src='../js/chats/$file'></script>";   // Load JS files
        }

        if ($_SESSION["class"] > 0)
            echo "<script src='components/const.js'></script>";
    ?>

    
    <meta charset='utf-8'>
    <meta name='viewport' content='initial-scale=1, maximum-scale=1'>
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'>
    <link rel='icon' type='image/png' href='../img/logo_short.png'>
    <link rel='stylesheet' type='text/css' href='../css/default.css'>
    <link rel='stylesheet' type='text/css' href='../css/common.css'>
    <script src='../js/connection.js'>
    </script><script src='../js/toast.class.js'>
    </script><title>AlfaChat | Conversas</title>
</head>

<body>
    <div class="side_menu">
        <div class="side_menu_visible">
            <header>
                <img id="user_img" src="<?php echo $_SESSION["photo"]; ?>"><br>
                <span id="user_name" style="font-weight: bold"><?php echo $_SESSION["name"]; ?></span><br>
                <span id="user_ra"><?php echo $_SESSION["ra"]; ?></span>
            </header>
            <main style="overflow-y: auto">
                <div id="new_group" class="menu_icon"><div class="pic"><img style="max-width: 50%"  src="assets/icons/group.png" alt="Novo Grupo"></div><div class="info" style="flex: 4">Novo Grupo</div></div>
                <div id="forum_menu" class="menu_icon"><div class="pic"><img src="assets/icons/forum.png" alt="F&oacute;rum"></div><div class="info" style="flex: 4">F&oacute;rum</div></div>
                <?php
                    if ($_SESSION["class"] > 0)
                        require "components/subject_list.html";
                ?>
            </main>
            <footer style="padding: 0; margin-top: 15px; padding-top: 10px">
                <div id="config" class="menu_icon"><div class="pic"><img style="max-width: 50%" src="assets/icons/settings.png" alt="Config"></div><div class="info" style="flex: 4">Configura&ccedil;&otilde;es</div></div>
                <div class="menu_icon"><div class="pic" style="margin: 0 15px"><img src="assets/icons/release.png" style="width: 200%; border-radius: 0"></div><div class="info"><a style="width: 100%; min-height: 100%; display: flex; align-items: center; justify-content: left" target="_blank" id="version"></a></div></div>
            </footer>
        </div>
        <div class="side_menu_bg"></div>
    </div>
    <form class="modal" id="new_group_menu" enctype="multipart/form-data">
        <div class="modal_container" style="display: flex; flex: 1">
            <div class="pic">
                <input id="group_pic_input" type="file" style="display: none" accept="image/*">
                <label for="group_pic_input" style="display: flex; cursor: pointer;">
                    <img src="assets/icons/camera.png" alt="Camera" style="margin: auto; max-width: 60%">
                </label>
            </div>
            <div class="info">
                <label>Nome do grupo:</label>
                <input type="text" autofocus>
            </div>
        </div>
        <footer class="modal_btns">
            <div>FECHAR</div>
            <button type="submit">PROSSEGUIR</button>
        </footer>
    </form>
    <form class="modal" id="new_group_menu_advanced">
       <header>
           <span class="modal_header_title">Adicionar Membros:</span>
           <div id="member_search_container">
                <div style="display: flex;"></div>
                <input type="text" placeholder="Busca">
           </div>
       </header>
       <main>
            <div class="members_result" hidden></div>
            <div class="members"></div>
            <footer class="modal_btns" style="flex: 1">
                <div>FECHAR</div>
                <button type="submit">PROSSEGUIR</button>
            </footer>    
       </main> 
    </form>
    <div class="modal" id="settings_menu">
        <header>
            <div style="display: flex; justify-content: space-between; flex: 1;">
                <span class="modal_header_title" style="flex: 4">Configura&ccedil;&otilde;es:</span>
                <div class="settings_header_btns">
                    <img src="assets/icons/advanced.png" alt="3 pontinhos">
                    <div id="settings_menu_header_drop_down" class="settings_menu_header_drop_down">
                        <span>Encerrar sess&atilde;o</span>
                        <span class="edit_profile">Editar perfil</span>
                    </div>
                    <img src="assets/icons/x_icon.png" alt="X icon" style="width: 18%; margin-bottom: 3.5px">
                </div>
            </div>
            <div class="settings_menu_user_area">
                <div class="pic">
                    <img src="<?php echo $_SESSION["photo"]; ?>">
                </div>
                <div class="info">
                    <div style="font-weight: bold;"><?php echo $_SESSION["name"]; ?></div>
                    <div style="font-size: 16px; color: #cccccc"><?php echo $_SESSION["ra"]; ?></div>
                </div>
            </div>
        </header>
        <main>
            <div class="menu_icon edit_profile"><div class="pic"><img style="max-width: 30%"  src="assets/icons/info.png" alt="Novo Grupo"></div><div class="info" style="flex: 4">Editar perfil</div></div>
        </main>
        <footer></footer>
        <header hidden style="border: 0; padding-left: 0">
            <div style="flex: 1; flex-direction: column; display: flex">
                <div style="justify-content: space-between; display: flex; flex: 1;">
                    <div class="modal_header_title" style="flex: 20; display: flex; align-items: start; padding-left: 0; padding-left: 25px">
                        <img id="settings_menu_back" src="assets/icons/arrow.png" alt="Voltar">
                        <span style="margin: 12px 0 0 10px;">Informa&ccedil;&otilde;es:</span>
                    </div>
                    <div class="settings_header_btns" style="flex: 1; text-align: end;">
                        <img id="settings_menu_close" src="assets/icons/x_icon.png" alt="X icon">
                    </div>
                </div>
                <div style="background-color: #291a46; flex: 3; flex-direction: column; justify-content: center; align-items: center; display: flex">
                    <img id="settings_menu_advanced_profile_pic" src="<?php echo $_SESSION["photo"]; ?>" alt="">
                    <div>
                        <input id="profile_pic_input" type="file" style="display: none" accept="image/*">
                        <label for="profile_pic_input" style="text-transform: uppercase; font-weight: bold; cursor: pointer; text-align: center; padding: 10px 30px; border-radius: 20px; background-color: #35215a">Mudar foto de perfil</label>
                    </div>
                </div>
            </div>
        </header>
        <form hidden style="flex: 1; display: flex; flex-direction: column">
            <div style="flex: 1" class="menu_icon settings_menu_icon">
                <div class="pic">
                    <img src="assets/icons/name.png" alt="Mudar nome">
                </div>
                <div class="info">
                    <span id="settings_menu_name"><?php echo $_SESSION["name"] ?></span>
                    <span class="settings_menu_subtitle">Nome</span>
                </div>
            </div>
            <div style="flex: 1" class="menu_icon settings_menu_icon">
                <div class="pic">
                    <img src="assets/icons/ra.png" alt="Mudar ra">
                </div>
                <div class="info">
                    <span id="settings_menu_ra"><?php echo $_SESSION["ra"] ?></span>
                    <span class="settings_menu_subtitle">RA</span>
                </div>
            </div>
        </form>
        <footer hidden></footer>
    </div>
    <?php
        if ($_SESSION["class"] > 0)
            require "components/doubt_send.html";
    ?>
    <div id="forum">
        <header>
            <img src="assets/icons/menu.png" alt="Menu icon" style="margin-right: 0">
            <img src="assets/icons/arrow.png" alt="Back" style="height: 9vh; transform: rotate(90deg); margin: 0">
            <img src="assets/icons/update.png" alt="Back" style="height: 4.5vh; margin: 0 20px 0 10px !important; display: none">
            <input type="text" name="query" placeholder="Busca">
        </header>
        <main></main>
    </div>
    <div class="chat_selector">
        <header>
            <img src="assets/icons/menu.png" alt="Menu icon">
            <input type="text" name="query" placeholder="Busca">
        </header>
        <div class="chat_result_list" hidden></div>
        <div class="chat_list"><div class="loading">Carregando...</div></div>
        <script>
            function chatListUpdater() {
                const xml = new XMLHttpRequest(),
                    t0 = performance.now();

                xml.open("POST", "../xmlhttprequest/chat_list.php", true);
                xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xml.send("chats=1");

                xml.onload = () => {
                    const xml = new XMLHttpRequest();

                    $("chat_list").attr("data-chats", xml.responseText);
                    xml.open("POST", "../xmlhttprequest/chat_list.php", true);
                    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xml.send(null);

                    xml.onload = () => {
                        const chat_list = document.createElement("div");
                        chat_list.innerHTML = xml.responseText;

                        if (chat_list.children.length !== $(".chat_list")[0].children.length) {
                            $(".chat_list").html(xml.responseText);
                            $(".chat:visible").on("click", openChat);
                        }

                        $(document).remove(chat_list);
                        
                        update(t0, "chatListUpdater");
                    }
                }
            }
        </script>
    </div>

    <div class="chats">
        <?php
            if ($_SESSION["class"] > 0)
                echo "<div class='choose_chat'>Escolha uma conversa para entrar</div>";
            else
                echo "<script src='get_doubt.js'></script>";
        ?>
        <header>
            <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-direction: column">
                <div></div>
                <div></div>
            </div>
            <img src="assets/icons/advanced.png" alt="Avan&ccedil;ado">
            <div id="settings_menu_header_drop_down_2" class="settings_menu_header_drop_down">
                <span>Encerrar sess&atilde;o</span>
                <span class="edit_profile">Editar perfil</span>
            </div>
        </header>
        <div class="message_area"></div>
        <form class="input_area" enctype="multipart/form-data" accept-charset="UTF-8">
            <input id="file_input" type="file" style="display: none" name="file_input" multiple>
            <img src="assets/icons/file.png" alt="Carregar arquivo">
            <ul id="suggester" class="suggester"></ul>
            <textarea placeholder="Escreva sua mensagem..."></textarea>
            <div class="audio_control" hidden></div>
            <div class="audio_control" hidden></div>
            <span class="countdown" hidden>00:00</span>
            <ul class="suggester emoji">
                <li data-value=':grinning:'>&#x1F600;</li><li data-value=':smiley:'>&#x1F603;</li><li data-value=':smile:'>&#x1F604;</li><li data-value=':grin:'>&#x1F601;</li><li data-value=':laughing:'>&#x1F606;</li><li data-value=':satisfied:'>&#x1F606;</li><li data-value=':sweat_smile:'>&#x1F605;</li><li data-value=':joy:'>&#x1F602;</li><li data-value=':wink:'>&#x1F609;</li><li data-value=':blush:'>&#x1F60A;</li><li data-value=':innocent:'>&#x1F607;</li><li data-value=':heart_eyes:'>&#x1F60D;</li><li data-value=':kissing_heart:'>&#x1F618;</li><li data-value=':kissing:'>&#x1F617;</li><li data-value=':relaxed:'>&#x263A;&#xFE0F;</li><li data-value=':kissing_closed_eyes:'>&#x1F61A;</li><li data-value=':kissing_smiling_eyes:'>&#x1F619;</li><li data-value=':yum:'>&#x1F60B;</li><li data-value=':stuck_out_tongue:'>&#x1F61B;</li><li data-value=':stuck_out_tongue_winking_eye:'>&#x1F61C;</li><li data-value=':stuck_out_tongue_closed_eyes:'>&#x1F61D;</li><li data-value=':neutral_face:'>&#x1F610;</li><li data-value=':expressionless:'>&#x1F611;</li><li data-value=':no_mouth:'>&#x1F636;</li><li data-value=':smirk:'>&#x1F60F;</li><li data-value=':unamused:'>&#x1F612;</li><li data-value=':grimacing:'>&#x1F62C;</li><li data-value=':relieved:'>&#x1F60C;</li><li data-value=':pensive:'>&#x1F614;</li><li data-value=':sleepy:'>&#x1F62A;</li><li data-value=':sleeping:'>&#x1F634;</li><li data-value=':mask:'>&#x1F637;</li><li data-value=':dizzy_face:'>&#x1F635;</li><li data-value=':sunglasses:'>&#x1F60E;</li><li data-value=':confused:'>&#x1F615;</li><li data-value=':worried:'>&#x1F61F;</li><li data-value=':open_mouth:'>&#x1F62E;</li><li data-value=':hushed:'>&#x1F62F;</li><li data-value=':astonished:'>&#x1F632;</li><li data-value=':flushed:'>&#x1F633;</li><li data-value=':frowning:'>&#x1F626;</li><li data-value=':anguished:'>&#x1F627;</li><li data-value=':fearful:'>&#x1F628;</li><li data-value=':cold_sweat:'>&#x1F630;</li><li data-value=':disappointed_relieved:'>&#x1F625;</li><li data-value=':cry:'>&#x1F622;</li><li data-value=':sob:'>&#x1F62D;</li><li data-value=':scream:'>&#x1F631;</li><li data-value=':confounded:'>&#x1F616;</li><li data-value=':persevere:'>&#x1F623;</li><li data-value=':disappointed:'>&#x1F61E;</li><li data-value=':sweat:'>&#x1F613;</li><li data-value=':weary:'>&#x1F629;</li><li data-value=':tired_face:'>&#x1F62B;</li><li data-value=':triumph:'>&#x1F624;</li><li data-value=':rage:'>&#x1F621;</li><li data-value=':angry:'>&#x1F620;</li><li data-value=':smiling_imp:'>&#x1F608;</li><li data-value=':imp:'>&#x1F47F;</li><li data-value=':skull:'>&#x1F480;</li><li data-value=':hankey:'>&#x1F4A9;</li><li data-value='poop:'>&#x1F4A9;</li><li data-value='shit:'>&#x1F4A9;</li><li data-value=':japanese_ogre:'>&#x1F479;</li><li data-value=':japanese_goblin:'>&#x1F47A;</li><li data-value=':ghost:'>&#x1F47B;</li><li data-value=':alien:'>&#x1F47D;</li><li data-value=':space_invader:'>&#x1F47E;</li><li data-value=':smiley_cat:'>&#x1F63A;</li><li data-value=':smile_cat:'>&#x1F638;</li><li data-value=':joy_cat:'>&#x1F639;</li><li data-value=':heart_eyes_cat:'>&#x1F63B;</li><li data-value=':smirk_cat:'>&#x1F63C;</li><li data-value=':kissing_cat:'>&#x1F63D;</li><li data-value=':scream_cat:'>&#x1F640;</li><li data-value=':crying_cat_face:'>&#x1F63F;</li><li data-value=':pouting_cat:'>&#x1F63E;</li><li data-value=':see_no_evil:'>&#x1F648;</li><li data-value=':hear_no_evil:'>&#x1F649;</li><li data-value=':speak_no_evil:'>&#x1F64A;</li><li data-value=':kiss:'>&#x1F48B;</li><li data-value=':love_letter:'>&#x1F48C;</li><li data-value=':cupid:'>&#x1F498;</li><li data-value=':gift_heart:'>&#x1F49D;</li><li data-value=':sparkling_heart:'>&#x1F496;</li><li data-value=':heartpulse:'>&#x1F497;</li><li data-value=':heartbeat:'>&#x1F493;</li><li data-value=':revolving_hearts:'>&#x1F49E;</li><li data-value=':two_hearts:'>&#x1F495;</li><li data-value=':heart_decoration:'>&#x1F49F;</li><li data-value=':broken_heart:'>&#x1F494;</li><li data-value=':heart:'>&#x2764;&#xFE0F;</li><li data-value=':yellow_heart:'>&#x1F49B;</li><li data-value=':green_heart:'>&#x1F49A;</li><li data-value=':blue_heart:'>&#x1F499;</li><li data-value=':purple_heart:'>&#x1F49C;</li><li data-value=':100:'>&#x1F4AF;</li><li data-value=':anger:'>&#x1F4A2;</li><li data-value=':boom:'>&#x1F4A5;</li><li data-value='collision:'>&#x1F4A5;</li><li data-value=':dizzy:'>&#x1F4AB;</li><li data-value=':sweat_drops:'>&#x1F4A6;</li><li data-value=':dash:'>&#x1F4A8;</li><li data-value=':bomb:'>&#x1F4A3;</li><li data-value=':speech_balloon:'>&#x1F4AC;</li><li data-value=':thought_balloon:'>&#x1F4AD;</li><li data-value=':zzz:'>&#x1F4A4;</li><li data-value=':wave:'>&#x1F44B;</li><li data-value=':hand:'>&#x270B;</li><li data-value=':raised_hand:'>&#x270B;</li><li data-value=':ok_hand:'>&#x1F44C;</li><li data-value=':v:'>&#x270C;&#xFE0F;</li><li data-value=':point_left:'>&#x1F448;</li><li data-value=':point_right:'>&#x1F449;</li><li data-value=':point_up_2:'>&#x1F446;</li><li data-value=':point_down:'>&#x1F447;</li><li data-value=':point_up:'>&#x261D;&#xFE0F;</li><li data-value=':+1:'>&#x1F44D;</li><li data-value='thumbsup:'>&#x1F44D;</li><li data-value=':-1:'>&#x1F44E;</li><li data-value=':thumbsdown:'>&#x1F44E;</li><li data-value=':fist:'>&#x270A;</li><li data-value=':facepunch:'>&#x1F44A;</li><li data-value='punch:'>&#x1F44A;</li><li data-value=':clap:'>&#x1F44F;</li><li data-value=':raised_hands:'>&#x1F64C;</li><li data-value=':open_hands:'>&#x1F450;</li><li data-value=':pray:'>&#x1F64F;</li><li data-value=':nail_care:'>&#x1F485;</li><li data-value=':muscle:'>&#x1F4AA;</li><li data-value=':ear:'>&#x1F442;</li><li data-value=':nose:'>&#x1F443;</li><li data-value=':eyes:'>&#x1F440;</li><li data-value=':tongue:'>&#x1F445;</li><li data-value=':lips:'>&#x1F444;</li><li data-value=':baby:'>&#x1F476;</li><li data-value=':boy:'>&#x1F466;</li><li data-value=':girl:'>&#x1F467;</li><li data-value=':person_with_blond_hair:'>&#x1F471;</li><li data-value=':man:'>&#x1F468;</li><li data-value=':woman:'>&#x1F469;</li><li data-value=':older_man:'>&#x1F474;</li><li data-value=':older_woman:'>&#x1F475;</li><li data-value=':person_frowning:'>&#x1F64D;</li><li data-value=':person_with_pouting_face:'>&#x1F64E;</li><li data-value=':no_good:'>&#x1F645;</li><li data-value=':ok_woman:'>&#x1F646;</li><li data-value=':information_desk_person:'>&#x1F481;</li><li data-value=':raising_hand:'>&#x1F64B;</li><li data-value=':bow:'>&#x1F647;</li><li data-value=':cop:'>&#x1F46E;</li><li data-value=':guardsman:'>&#x1F482;</li><li data-value=':construction_worker:'>&#x1F477;</li><li data-value=':princess:'>&#x1F478;</li><li data-value=':man_with_turban:'>&#x1F473;</li><li data-value=':man_with_gua_pi_mao:'>&#x1F472;</li><li data-value=':bride_with_veil:'>&#x1F470;</li><li data-value=':angel:'>&#x1F47C;</li><li data-value=':santa:'>&#x1F385;</li><li data-value=':massage:'>&#x1F486;</li><li data-value=':haircut:'>&#x1F487;</li><li data-value=':walking:'>&#x1F6B6;</li><li data-value=':runner:'>&#x1F3C3;</li><li data-value=':running:'>&#x1F3C3;</li><li data-value=':dancer:'>&#x1F483;</li><li data-value=':dancers:'>&#x1F46F;</li><li data-value=':horse_racing:'>&#x1F3C7;</li><li data-value=':snowboarder:'>&#x1F3C2;</li><li data-value=':surfer:'>&#x1F3C4;</li><li data-value=':rowboat:'>&#x1F6A3;</li><li data-value=':swimmer:'>&#x1F3CA;</li><li data-value=':bicyclist:'>&#x1F6B4;</li><li data-value=':mountain_bicyclist:'>&#x1F6B5;</li><li data-value=':bath:'>&#x1F6C0;</li><li data-value=':two_women_holding_hands:'>&#x1F46D;</li><li data-value=':couple:'>&#x1F46B;</li><li data-value=':two_men_holding_hands:'>&#x1F46C;</li><li data-value=':couplekiss:'>&#x1F48F;</li><li data-value=':couple_with_heart:'>&#x1F491;</li><li data-value=':family:'>&#x1F46A;</li><li data-value=':bust_in_silhouette:'>&#x1F464;</li><li data-value=':busts_in_silhouette:'>&#x1F465;</li><li data-value=':footprints:'>&#x1F463;</li><li data-value=':monkey_face:'>&#x1F435;</li><li data-value=':monkey:'>&#x1F412;</li><li data-value=':dog:'>&#x1F436;</li><li data-value=':dog2:'>&#x1F415;</li><li data-value=':poodle:'>&#x1F429;</li><li data-value=':wolf:'>&#x1F43A;</li><li data-value=':cat:'>&#x1F431;</li><li data-value=':cat2:'>&#x1F408;</li><li data-value=':tiger:'>&#x1F42F;</li><li data-value=':tiger2:'>&#x1F405;</li><li data-value=':leopard:'>&#x1F406;</li><li data-value=':horse:'>&#x1F434;</li><li data-value=':racehorse:'>&#x1F40E;</li><li data-value=':cow:'>&#x1F42E;</li><li data-value=':ox:'>&#x1F402;</li><li data-value=':water_buffalo:'>&#x1F403;</li><li data-value=':cow2:'>&#x1F404;</li><li data-value=':pig:'>&#x1F437;</li><li data-value=':pig2:'>&#x1F416;</li><li data-value=':boar:'>&#x1F417;</li><li data-value=':pig_nose:'>&#x1F43D;</li><li data-value=':ram:'>&#x1F40F;</li><li data-value=':sheep:'>&#x1F411;</li><li data-value=':goat:'>&#x1F410;</li><li data-value=':dromedary_camel:'>&#x1F42A;</li><li data-value=':camel:'>&#x1F42B;</li><li data-value=':elephant:'>&#x1F418;</li><li data-value=':mouse:'>&#x1F42D;</li><li data-value=':mouse2:'>&#x1F401;</li><li data-value=':rat:'>&#x1F400;</li><li data-value=':hamster:'>&#x1F439;</li><li data-value=':rabbit:'>&#x1F430;</li><li data-value=':rabbit2:'>&#x1F407;</li><li data-value=':bear:'>&#x1F43B;</li><li data-value=':koala:'>&#x1F428;</li><li data-value=':panda_face:'>&#x1F43C;</li><li data-value=':feet:'>&#x1F43E;</li><li data-value='paw_prints:'>&#x1F43E;</li><li data-value=':chicken:'>&#x1F414;</li><li data-value=':rooster:'>&#x1F413;</li><li data-value=':hatching_chick:'>&#x1F423;</li><li data-value=':baby_chick:'>&#x1F424;</li><li data-value=':hatched_chick:'>&#x1F425;</li><li data-value=':bird:'>&#x1F426;</li><li data-value=':penguin:'>&#x1F427;</li><li data-value=':frog:'>&#x1F438;</li><li data-value=':crocodile:'>&#x1F40A;</li><li data-value=':turtle:'>&#x1F422;</li><li data-value=':snake:'>&#x1F40D;</li><li data-value=':dragon_face:'>&#x1F432;</li><li data-value=':dragon:'>&#x1F409;</li><li data-value=':whale:'>&#x1F433;</li><li data-value=':whale2:'>&#x1F40B;</li><li data-value=':dolphin:'>&#x1F42C;</li><li data-value=':flipper:'>&#x1F42C;</li><li data-value=':fish:'>&#x1F41F;</li><li data-value=':tropical_fish:'>&#x1F420;</li><li data-value=':blowfish:'>&#x1F421;</li><li data-value=':octopus:'>&#x1F419;</li><li data-value=':shell:'>&#x1F41A;</li><li data-value=':snail:'>&#x1F40C;</li><li data-value=':bug:'>&#x1F41B;</li><li data-value=':ant:'>&#x1F41C;</li><li data-value=':bee:'>&#x1F41D;</li><li data-value='honeybee:'>&#x1F41D;</li><li data-value=':beetle:'>&#x1F41E;</li><li data-value=':bouquet:'>&#x1F490;</li><li data-value=':cherry_blossom:'>&#x1F338;</li><li data-value=':white_flower:'>&#x1F4AE;</li><li data-value=':rose:'>&#x1F339;</li><li data-value=':hibiscus:'>&#x1F33A;</li><li data-value=':sunflower:'>&#x1F33B;</li><li data-value=':blossom:'>&#x1F33C;</li><li data-value=':tulip:'>&#x1F337;</li><li data-value=':seedling:'>&#x1F331;</li><li data-value=':evergreen_tree:'>&#x1F332;</li><li data-value=':deciduous_tree:'>&#x1F333;</li><li data-value=':palm_tree:'>&#x1F334;</li><li data-value=':cactus:'>&#x1F335;</li><li data-value=':ear_of_rice:'>&#x1F33E;</li><li data-value=':herb:'>&#x1F33F;</li><li data-value=':four_leaf_clover:'>&#x1F340;</li><li data-value=':maple_leaf:'>&#x1F341;</li><li data-value=':fallen_leaf:'>&#x1F342;</li><li data-value=':leaves:'>&#x1F343;</li><li data-value=':grapes:'>&#x1F347;</li><li data-value=':melon:'>&#x1F348;</li><li data-value=':watermelon:'>&#x1F349;</li><li data-value=':tangerine:'>&#x1F34A;</li><li data-value=':lemon:'>&#x1F34B;</li><li data-value=':banana:'>&#x1F34C;</li><li data-value=':pineapple:'>&#x1F34D;</li><li data-value=':apple:'>&#x1F34E;</li><li data-value=':green_apple:'>&#x1F34F;</li><li data-value=':pear:'>&#x1F350;</li><li data-value=':peach:'>&#x1F351;</li><li data-value=':cherries:'>&#x1F352;</li><li data-value=':strawberry:'>&#x1F353;</li><li data-value=':tomato:'>&#x1F345;</li><li data-value=':eggplant:'>&#x1F346;</li><li data-value=':corn:'>&#x1F33D;</li><li data-value=':mushroom:'>&#x1F344;</li><li data-value=':chestnut:'>&#x1F330;</li><li data-value=':bread:'>&#x1F35E;</li><li data-value=':meat_on_bone:'>&#x1F356;</li><li data-value=':poultry_leg:'>&#x1F357;</li><li data-value=':hamburger:'>&#x1F354;</li><li data-value=':fries:'>&#x1F35F;</li><li data-value=':pizza:'>&#x1F355;</li><li data-value=':egg:'>&#x1F373;</li><li data-value=':stew:'>&#x1F372;</li><li data-value=':bento:'>&#x1F371;</li><li data-value=':rice_cracker:'>&#x1F358;</li><li data-value=':rice_ball:'>&#x1F359;</li><li data-value=':rice:'>&#x1F35A;</li><li data-value=':curry:'>&#x1F35B;</li><li data-value=':ramen:'>&#x1F35C;</li><li data-value=':spaghetti:'>&#x1F35D;</li><li data-value=':sweet_potato:'>&#x1F360;</li><li data-value=':oden:'>&#x1F362;</li><li data-value=':sushi:'>&#x1F363;</li><li data-value=':fried_shrimp:'>&#x1F364;</li><li data-value=':fish_cake:'>&#x1F365;</li><li data-value=':dango:'>&#x1F361;</li><li data-value=':icecream:'>&#x1F366;</li><li data-value=':shaved_ice:'>&#x1F367;</li><li data-value=':ice_cream:'>&#x1F368;</li><li data-value=':doughnut:'>&#x1F369;</li><li data-value=':cookie:'>&#x1F36A;</li><li data-value=':birthday:'>&#x1F382;</li><li data-value=':cake:'>&#x1F370;</li><li data-value=':chocolate_bar:'>&#x1F36B;</li><li data-value=':candy:'>&#x1F36C;</li><li data-value=':lollipop:'>&#x1F36D;</li><li data-value=':custard:'>&#x1F36E;</li><li data-value=':honey_pot:'>&#x1F36F;</li><li data-value=':baby_bottle:'>&#x1F37C;</li><li data-value=':coffee:'>&#x2615;</li><li data-value=':tea:'>&#x1F375;</li><li data-value=':sake:'>&#x1F376;</li><li data-value=':wine_glass:'>&#x1F377;</li><li data-value=':cocktail:'>&#x1F378;</li><li data-value=':tropical_drink:'>&#x1F379;</li><li data-value=':beer:'>&#x1F37A;</li><li data-value=':beers:'>&#x1F37B;</li><li data-value=':fork_and_knife:'>&#x1F374;</li><li data-value=':hocho:'>&#x1F52A;</li><li data-value=':knife:'>&#x1F52A;</li><li data-value=':earth_africa:'>&#x1F30D;</li><li data-value=':earth_americas:'>&#x1F30E;</li><li data-value=':earth_asia:'>&#x1F30F;</li><li data-value=':globe_with_meridians:'>&#x1F310;</li><li data-value=':japan:'>&#x1F5FE;</li><li data-value=':volcano:'>&#x1F30B;</li><li data-value=':mount_fuji:'>&#x1F5FB;</li><li data-value=':house:'>&#x1F3E0;</li><li data-value=':house_with_garden:'>&#x1F3E1;</li><li data-value=':office:'>&#x1F3E2;</li><li data-value=':post_office:'>&#x1F3E3;</li><li data-value=':european_post_office:'>&#x1F3E4;</li><li data-value=':hospital:'>&#x1F3E5;</li><li data-value=':bank:'>&#x1F3E6;</li><li data-value=':hotel:'>&#x1F3E8;</li><li data-value=':love_hotel:'>&#x1F3E9;</li><li data-value=':convenience_store:'>&#x1F3EA;</li><li data-value=':school:'>&#x1F3EB;</li><li data-value=':department_store:'>&#x1F3EC;</li><li data-value=':factory:'>&#x1F3ED;</li><li data-value=':japanese_castle:'>&#x1F3EF;</li><li data-value=':european_castle:'>&#x1F3F0;</li><li data-value=':wedding:'>&#x1F492;</li><li data-value=':tokyo_tower:'>&#x1F5FC;</li><li data-value=':statue_of_liberty:'>&#x1F5FD;</li><li data-value=':church:'>&#x26EA;</li><li data-value=':fountain:'>&#x26F2;</li><li data-value=':tent:'>&#x26FA;</li><li data-value=':foggy:'>&#x1F301;</li><li data-value=':night_with_stars:'>&#x1F303;</li><li data-value=':sunrise_over_mountains:'>&#x1F304;</li><li data-value=':sunrise:'>&#x1F305;</li><li data-value=':city_sunset:'>&#x1F306;</li><li data-value=':city_sunrise:'>&#x1F307;</li><li data-value=':bridge_at_night:'>&#x1F309;</li><li data-value=':hotsprings:'>&#x2668;&#xFE0F;</li><li data-value=':carousel_horse:'>&#x1F3A0;</li><li data-value=':ferris_wheel:'>&#x1F3A1;</li><li data-value=':roller_coaster:'>&#x1F3A2;</li><li data-value=':barber:'>&#x1F488;</li><li data-value=':circus_tent:'>&#x1F3AA;</li><li data-value=':steam_locomotive:'>&#x1F682;</li><li data-value=':railway_car:'>&#x1F683;</li><li data-value=':bullettrain_side:'>&#x1F684;</li><li data-value=':bullettrain_front:'>&#x1F685;</li><li data-value=':train2:'>&#x1F686;</li><li data-value=':metro:'>&#x1F687;</li><li data-value=':light_rail:'>&#x1F688;</li><li data-value=':station:'>&#x1F689;</li><li data-value=':tram:'>&#x1F68A;</li><li data-value=':monorail:'>&#x1F69D;</li><li data-value=':mountain_railway:'>&#x1F69E;</li><li data-value=':train:'>&#x1F68B;</li><li data-value=':bus:'>&#x1F68C;</li><li data-value=':oncoming_bus:'>&#x1F68D;</li><li data-value=':trolleybus:'>&#x1F68E;</li><li data-value=':minibus:'>&#x1F690;</li><li data-value=':ambulance:'>&#x1F691;</li><li data-value=':fire_engine:'>&#x1F692;</li><li data-value=':police_car:'>&#x1F693;</li><li data-value=':oncoming_police_car:'>&#x1F694;</li><li data-value=':taxi:'>&#x1F695;</li><li data-value=':oncoming_taxi:'>&#x1F696;</li><li data-value=':car:'>&#x1F697;</li><li data-value='red_car:'>&#x1F697;</li><li data-value=':oncoming_automobile:'>&#x1F698;</li><li data-value=':blue_car:'>&#x1F699;</li><li data-value=':truck:'>&#x1F69A;</li><li data-value=':articulated_lorry:'>&#x1F69B;</li><li data-value=':tractor:'>&#x1F69C;</li><li data-value=':bike:'>&#x1F6B2;</li><li data-value=':busstop:'>&#x1F68F;</li><li data-value=':fuelpump:'>&#x26FD;</li><li data-value=':rotating_light:'>&#x1F6A8;</li><li data-value=':traffic_light:'>&#x1F6A5;</li><li data-value=':vertical_traffic_light:'>&#x1F6A6;</li><li data-value=':construction:'>&#x1F6A7;</li><li data-value=':anchor:'>&#x2693;</li><li data-value=':boat:'>&#x26F5;</li><li data-value=':sailboat:'>&#x26F5;</li><li data-value=':speedboat:'>&#x1F6A4;</li><li data-value=':ship:'>&#x1F6A2;</li><li data-value=':airplane:'>&#x2708;&#xFE0F;</li><li data-value=':seat:'>&#x1F4BA;</li><li data-value=':helicopter:'>&#x1F681;</li><li data-value=':suspension_railway:'>&#x1F69F;</li><li data-value=':mountain_cableway:'>&#x1F6A0;</li><li data-value=':aerial_tramway:'>&#x1F6A1;</li><li data-value=':rocket:'>&#x1F680;</li><li data-value=':hourglass:'>&#x231B;</li><li data-value=':hourglass_flowing_sand:'>&#x23F3;</li><li data-value=':watch:'>&#x231A;</li><li data-value=':alarm_clock:'>&#x23F0;</li><li data-value=':clock12:'>&#x1F55B;</li><li data-value=':clock1230:'>&#x1F567;</li><li data-value=':clock1:'>&#x1F550;</li><li data-value=':clock130:'>&#x1F55C;</li><li data-value=':clock2:'>&#x1F551;</li><li data-value=':clock230:'>&#x1F55D;</li><li data-value=':clock3:'>&#x1F552;</li><li data-value=':clock330:'>&#x1F55E;</li><li data-value=':clock4:'>&#x1F553;</li><li data-value=':clock430:'>&#x1F55F;</li><li data-value=':clock5:'>&#x1F554;</li><li data-value=':clock530:'>&#x1F560;</li><li data-value=':clock6:'>&#x1F555;</li><li data-value=':clock630:'>&#x1F561;</li><li data-value=':clock7:'>&#x1F556;</li><li data-value=':clock730:'>&#x1F562;</li><li data-value=':clock8:'>&#x1F557;</li><li data-value=':clock830:'>&#x1F563;</li><li data-value=':clock9:'>&#x1F558;</li><li data-value=':clock930:'>&#x1F564;</li><li data-value=':clock10:'>&#x1F559;</li><li data-value=':clock1030:'>&#x1F565;</li><li data-value=':clock11:'>&#x1F55A;</li><li data-value=':clock1130:'>&#x1F566;</li><li data-value=':new_moon:'>&#x1F311;</li><li data-value=':waxing_crescent_moon:'>&#x1F312;</li><li data-value=':first_quarter_moon:'>&#x1F313;</li><li data-value=':moon:'>&#x1F314;</li><li data-value='waxing_gibbous_moon:'>&#x1F314;</li><li data-value=':full_moon:'>&#x1F315;</li><li data-value=':waning_gibbous_moon:'>&#x1F316;</li><li data-value=':last_quarter_moon:'>&#x1F317;</li><li data-value=':waning_crescent_moon:'>&#x1F318;</li><li data-value=':crescent_moon:'>&#x1F319;</li><li data-value=':new_moon_with_face:'>&#x1F31A;</li><li data-value=':first_quarter_moon_with_face:'>&#x1F31B;</li><li data-value=':last_quarter_moon_with_face:'>&#x1F31C;</li><li data-value=':sunny:'>&#x2600;&#xFE0F;</li><li data-value=':full_moon_with_face:'>&#x1F31D;</li><li data-value=':sun_with_face:'>&#x1F31E;</li><li data-value=':star:'>&#x2B50;</li><li data-value=':star2:'>&#x1F31F;</li><li data-value=':stars:'>&#x1F320;</li><li data-value=':milky_way:'>&#x1F30C;</li><li data-value=':cloud:'>&#x2601;&#xFE0F;</li><li data-value=':partly_sunny:'>&#x26C5;</li><li data-value=':cyclone:'>&#x1F300;</li><li data-value=':rainbow:'>&#x1F308;</li><li data-value=':closed_umbrella:'>&#x1F302;</li><li data-value=':umbrella:'>&#x2614;</li><li data-value=':zap:'>&#x26A1;</li><li data-value=':snowflake:'>&#x2744;&#xFE0F;</li><li data-value=':snowman:'>&#x26C4;</li><li data-value=':fire:'>&#x1F525;</li><li data-value=':droplet:'>&#x1F4A7;</li><li data-value=':ocean:'>&#x1F30A;</li><li data-value=':jack_o_lantern:'>&#x1F383;</li><li data-value=':christmas_tree:'>&#x1F384;</li><li data-value=':fireworks:'>&#x1F386;</li><li data-value=':sparkler:'>&#x1F387;</li><li data-value=':sparkles:'>&#x2728;</li><li data-value=':balloon:'>&#x1F388;</li><li data-value=':tada:'>&#x1F389;</li><li data-value=':confetti_ball:'>&#x1F38A;</li><li data-value=':tanabata_tree:'>&#x1F38B;</li><li data-value=':bamboo:'>&#x1F38D;</li><li data-value=':dolls:'>&#x1F38E;</li><li data-value=':flags:'>&#x1F38F;</li><li data-value=':wind_chime:'>&#x1F390;</li><li data-value=':rice_scene:'>&#x1F391;</li><li data-value=':ribbon:'>&#x1F380;</li><li data-value=':gift:'>&#x1F381;</li><li data-value=':ticket:'>&#x1F3AB;</li><li data-value=':trophy:'>&#x1F3C6;</li><li data-value=':soccer:'>&#x26BD;</li><li data-value=':baseball:'>&#x26BE;</li><li data-value=':basketball:'>&#x1F3C0;</li><li data-value=':football:'>&#x1F3C8;</li><li data-value=':rugby_football:'>&#x1F3C9;</li><li data-value=':tennis:'>&#x1F3BE;</li><li data-value=':bowling:'>&#x1F3B3;</li><li data-value=':golf:'>&#x26F3;</li><li data-value=':fishing_pole_and_fish:'>&#x1F3A3;</li><li data-value=':running_shirt_with_sash:'>&#x1F3BD;</li><li data-value=':ski:'>&#x1F3BF;</li><li data-value=':dart:'>&#x1F3AF;</li><li data-value=':8ball:'>&#x1F3B1;</li><li data-value=':crystal_ball:'>&#x1F52E;</li><li data-value=':video_game:'>&#x1F3AE;</li><li data-value=':slot_machine:'>&#x1F3B0;</li><li data-value=':game_die:'>&#x1F3B2;</li><li data-value=':spades:'>&#x2660;&#xFE0F;</li><li data-value=':hearts:'>&#x2665;&#xFE0F;</li><li data-value=':diamonds:'>&#x2666;&#xFE0F;</li><li data-value=':clubs:'>&#x2663;&#xFE0F;</li><li data-value=':black_joker:'>&#x1F0CF;</li><li data-value=':mahjong:'>&#x1F004;</li><li data-value=':flower_playing_cards:'>&#x1F3B4;</li><li data-value=':performing_arts:'>&#x1F3AD;</li><li data-value=':art:'>&#x1F3A8;</li><li data-value=':eyeglasses:'>&#x1F453;</li><li data-value=':necktie:'>&#x1F454;</li><li data-value=':shirt:'>&#x1F455;</li><li data-value=':tshirt:'>&#x1F455;</li><li data-value=':jeans:'>&#x1F456;</li><li data-value=':dress:'>&#x1F457;</li><li data-value=':kimono:'>&#x1F458;</li><li data-value=':bikini:'>&#x1F459;</li><li data-value=':womans_clothes:'>&#x1F45A;</li><li data-value=':purse:'>&#x1F45B;</li><li data-value=':handbag:'>&#x1F45C;</li><li data-value=':pouch:'>&#x1F45D;</li><li data-value=':school_satchel:'>&#x1F392;</li><li data-value=':mans_shoe:'>&#x1F45E;</li><li data-value=':shoe:'>&#x1F45E;</li><li data-value=':athletic_shoe:'>&#x1F45F;</li><li data-value=':high_heel:'>&#x1F460;</li><li data-value=':sandal:'>&#x1F461;</li><li data-value=':boot:'>&#x1F462;</li><li data-value=':crown:'>&#x1F451;</li><li data-value=':womans_hat:'>&#x1F452;</li><li data-value=':tophat:'>&#x1F3A9;</li><li data-value=':mortar_board:'>&#x1F393;</li><li data-value=':lipstick:'>&#x1F484;</li><li data-value=':ring:'>&#x1F48D;</li><li data-value=':gem:'>&#x1F48E;</li><li data-value=':mute:'>&#x1F507;</li><li data-value=':speaker:'>&#x1F508;</li><li data-value=':sound:'>&#x1F509;</li><li data-value=':loud_sound:'>&#x1F50A;</li><li data-value=':loudspeaker:'>&#x1F4E2;</li><li data-value=':mega:'>&#x1F4E3;</li><li data-value=':postal_horn:'>&#x1F4EF;</li><li data-value=':bell:'>&#x1F514;</li><li data-value=':no_bell:'>&#x1F515;</li><li data-value=':musical_score:'>&#x1F3BC;</li><li data-value=':musical_note:'>&#x1F3B5;</li><li data-value=':notes:'>&#x1F3B6;</li><li data-value=':microphone:'>&#x1F3A4;</li><li data-value=':headphones:'>&#x1F3A7;</li><li data-value=':radio:'>&#x1F4FB;</li><li data-value=':saxophone:'>&#x1F3B7;</li><li data-value=':guitar:'>&#x1F3B8;</li><li data-value=':musical_keyboard:'>&#x1F3B9;</li><li data-value=':trumpet:'>&#x1F3BA;</li><li data-value=':violin:'>&#x1F3BB;</li><li data-value=':iphone:'>&#x1F4F1;</li><li data-value=':calling:'>&#x1F4F2;</li><li data-value=':phone:'>&#x260E;&#xFE0F;</li><li data-value='telephone:'>&#x260E;&#xFE0F;</li><li data-value=':telephone_receiver:'>&#x1F4DE;</li><li data-value=':pager:'>&#x1F4DF;</li><li data-value=':fax:'>&#x1F4E0;</li><li data-value=':battery:'>&#x1F50B;</li><li data-value=':electric_plug:'>&#x1F50C;</li><li data-value=':computer:'>&#x1F4BB;</li><li data-value=':minidisc:'>&#x1F4BD;</li><li data-value=':floppy_disk:'>&#x1F4BE;</li><li data-value=':cd:'>&#x1F4BF;</li><li data-value=':dvd:'>&#x1F4C0;</li><li data-value=':movie_camera:'>&#x1F3A5;</li><li data-value=':clapper:'>&#x1F3AC;</li><li data-value=':tv:'>&#x1F4FA;</li><li data-value=':camera:'>&#x1F4F7;</li><li data-value=':video_camera:'>&#x1F4F9;</li><li data-value=':vhs:'>&#x1F4FC;</li><li data-value=':mag:'>&#x1F50D;</li><li data-value=':mag_right:'>&#x1F50E;</li><li data-value=':bulb:'>&#x1F4A1;</li><li data-value=':flashlight:'>&#x1F526;</li><li data-value=':izakaya_lantern:'>&#x1F3EE;</li><li data-value=':lantern:'>&#x1F3EE;</li><li data-value=':notebook_with_decorative_cover:'>&#x1F4D4;</li><li data-value=':closed_book:'>&#x1F4D5;</li><li data-value=':book:'>&#x1F4D6;</li><li data-value=':open_book:'>&#x1F4D6;</li><li data-value=':green_book:'>&#x1F4D7;</li><li data-value=':blue_book:'>&#x1F4D8;</li><li data-value=':orange_book:'>&#x1F4D9;</li><li data-value=':books:'>&#x1F4DA;</li><li data-value=':notebook:'>&#x1F4D3;</li><li data-value=':ledger:'>&#x1F4D2;</li><li data-value=':page_with_curl:'>&#x1F4C3;</li><li data-value=':scroll:'>&#x1F4DC;</li><li data-value=':page_facing_up:'>&#x1F4C4;</li><li data-value=':newspaper:'>&#x1F4F0;</li><li data-value=':bookmark_tabs:'>&#x1F4D1;</li><li data-value=':bookmark:'>&#x1F516;</li><li data-value=':moneybag:'>&#x1F4B0;</li><li data-value=':yen:'>&#x1F4B4;</li><li data-value=':dollar:'>&#x1F4B5;</li><li data-value=':euro:'>&#x1F4B6;</li><li data-value=':pound:'>&#x1F4B7;</li><li data-value=':money_with_wings:'>&#x1F4B8;</li><li data-value=':credit_card:'>&#x1F4B3;</li><li data-value=':chart:'>&#x1F4B9;</li><li data-value=':email:'>&#x2709;&#xFE0F;</li><li data-value=':envelope:'>&#x2709;&#xFE0F;</li><li data-value=':e-mail:'>&#x1F4E7;</li><li data-value=':incoming_envelope:'>&#x1F4E8;</li><li data-value=':envelope_with_arrow:'>&#x1F4E9;</li><li data-value=':outbox_tray:'>&#x1F4E4;</li><li data-value=':inbox_tray:'>&#x1F4E5;</li><li data-value=':package:'>&#x1F4E6;</li><li data-value=':mailbox:'>&#x1F4EB;</li><li data-value=':mailbox_closed:'>&#x1F4EA;</li><li data-value=':mailbox_with_mail:'>&#x1F4EC;</li><li data-value=':mailbox_with_no_mail:'>&#x1F4ED;</li><li data-value=':postbox:'>&#x1F4EE;</li><li data-value=':pencil2:'>&#x270F;&#xFE0F;</li><li data-value=':black_nib:'>&#x2712;&#xFE0F;</li><li data-value=':memo:'>&#x1F4DD;</li><li data-value=':pencil:'>&#x1F4DD;</li><li data-value=':briefcase:'>&#x1F4BC;</li><li data-value=':file_folder:'>&#x1F4C1;</li><li data-value=':open_file_folder:'>&#x1F4C2;</li><li data-value=':date:'>&#x1F4C5;</li><li data-value=':calendar:'>&#x1F4C6;</li><li data-value=':card_index:'>&#x1F4C7;</li><li data-value=':chart_with_upwards_trend:'>&#x1F4C8;</li><li data-value=':chart_with_downwards_trend:'>&#x1F4C9;</li><li data-value=':bar_chart:'>&#x1F4CA;</li><li data-value=':clipboard:'>&#x1F4CB;</li><li data-value=':pushpin:'>&#x1F4CC;</li><li data-value=':round_pushpin:'>&#x1F4CD;</li><li data-value=':paperclip:'>&#x1F4CE;</li><li data-value=':straight_ruler:'>&#x1F4CF;</li><li data-value=':triangular_ruler:'>&#x1F4D0;</li><li data-value=':scissors:'>&#x2702;&#xFE0F;</li><li data-value=':lock:'>&#x1F512;</li><li data-value=':unlock:'>&#x1F513;</li><li data-value=':lock_with_ink_pen:'>&#x1F50F;</li><li data-value=':closed_lock_with_key:'>&#x1F510;</li><li data-value=':key:'>&#x1F511;</li><li data-value=':hammer:'>&#x1F528;</li><li data-value=':gun:'>&#x1F52B;</li><li data-value=':wrench:'>&#x1F527;</li><li data-value=':nut_and_bolt:'>&#x1F529;</li><li data-value=':link:'>&#x1F517;</li><li data-value=':microscope:'>&#x1F52C;</li><li data-value=':telescope:'>&#x1F52D;</li><li data-value=':satellite:'>&#x1F4E1;</li><li data-value=':syringe:'>&#x1F489;</li><li data-value=':pill:'>&#x1F48A;</li><li data-value=':door:'>&#x1F6AA;</li><li data-value=':toilet:'>&#x1F6BD;</li><li data-value=':shower:'>&#x1F6BF;</li><li data-value=':bathtub:'>&#x1F6C1;</li><li data-value=':smoking:'>&#x1F6AC;</li><li data-value=':moyai:'>&#x1F5FF;</li><li data-value=':atm:'>&#x1F3E7;</li><li data-value=':put_litter_in_its_place:'>&#x1F6AE;</li><li data-value=':potable_water:'>&#x1F6B0;</li><li data-value=':wheelchair:'>&#x267F;</li><li data-value=':mens:'>&#x1F6B9;</li><li data-value=':womens:'>&#x1F6BA;</li><li data-value=':restroom:'>&#x1F6BB;</li><li data-value=':baby_symbol:'>&#x1F6BC;</li><li data-value=':wc:'>&#x1F6BE;</li><li data-value=':passport_control:'>&#x1F6C2;</li><li data-value=':customs:'>&#x1F6C3;</li><li data-value=':baggage_claim:'>&#x1F6C4;</li><li data-value=':left_luggage:'>&#x1F6C5;</li><li data-value=':warning:'>&#x26A0;&#xFE0F;</li><li data-value=':children_crossing:'>&#x1F6B8;</li><li data-value=':no_entry:'>&#x26D4;</li><li data-value=':no_entry_sign:'>&#x1F6AB;</li><li data-value=':no_bicycles:'>&#x1F6B3;</li><li data-value=':no_smoking:'>&#x1F6AD;</li><li data-value=':do_not_litter:'>&#x1F6AF;</li><li data-value=':non-potable_water:'>&#x1F6B1;</li><li data-value=':no_pedestrians:'>&#x1F6B7;</li><li data-value=':no_mobile_phones:'>&#x1F4F5;</li><li data-value=':underage:'>&#x1F51E;</li><li data-value=':arrow_up:'>&#x2B06;&#xFE0F;</li><li data-value=':arrow_upper_right:'>&#x2197;&#xFE0F;</li><li data-value=':arrow_right:'>&#x27A1;&#xFE0F;</li><li data-value=':arrow_lower_right:'>&#x2198;&#xFE0F;</li><li data-value=':arrow_down:'>&#x2B07;&#xFE0F;</li><li data-value=':arrow_lower_left:'>&#x2199;&#xFE0F;</li><li data-value=':arrow_left:'>&#x2B05;&#xFE0F;</li><li data-value=':arrow_upper_left:'>&#x2196;&#xFE0F;</li><li data-value=':arrow_up_down:'>&#x2195;&#xFE0F;</li><li data-value=':left_right_arrow:'>&#x2194;&#xFE0F;</li><li data-value=':leftwards_arrow_with_hook:'>&#x21A9;&#xFE0F;</li><li data-value=':arrow_right_hook:'>&#x21AA;&#xFE0F;</li><li data-value=':arrow_heading_up:'>&#x2934;&#xFE0F;</li><li data-value=':arrow_heading_down:'>&#x2935;&#xFE0F;</li><li data-value=':arrows_clockwise:'>&#x1F503;</li><li data-value=':arrows_counterclockwise:'>&#x1F504;</li><li data-value=':back:'>&#x1F519;</li><li data-value=':end:'>&#x1F51A;</li><li data-value=':on:'>&#x1F51B;</li><li data-value=':soon:'>&#x1F51C;</li><li data-value=':top:'>&#x1F51D;</li><li data-value=':six_pointed_star:'>&#x1F52F;</li><li data-value=':aries:'>&#x2648;</li><li data-value=':taurus:'>&#x2649;</li><li data-value=':gemini:'>&#x264A;</li><li data-value=':cancer:'>&#x264B;</li><li data-value=':leo:'>&#x264C;</li><li data-value=':virgo:'>&#x264D;</li><li data-value=':libra:'>&#x264E;</li><li data-value=':scorpius:'>&#x264F;</li><li data-value=':sagittarius:'>&#x2650;</li><li data-value=':capricorn:'>&#x2651;</li><li data-value=':aquarius:'>&#x2652;</li><li data-value=':pisces:'>&#x2653;</li><li data-value=':ophiuchus:'>&#x26CE;</li><li data-value=':twisted_rightwards_arrows:'>&#x1F500;</li><li data-value=':repeat:'>&#x1F501;</li><li data-value=':repeat_one:'>&#x1F502;</li><li data-value=':arrow_forward:'>&#x25B6;&#xFE0F;</li><li data-value=':fast_forward:'>&#x23E9;</li><li data-value=':arrow_backward:'>&#x25C0;&#xFE0F;</li><li data-value=':rewind:'>&#x23EA;</li><li data-value=':arrow_up_small:'>&#x1F53C;</li><li data-value=':arrow_double_up:'>&#x23EB;</li><li data-value=':arrow_down_small:'>&#x1F53D;</li><li data-value=':arrow_double_down:'>&#x23EC;</li><li data-value=':cinema:'>&#x1F3A6;</li><li data-value=':low_brightness:'>&#x1F505;</li><li data-value=':high_brightness:'>&#x1F506;</li><li data-value=':signal_strength:'>&#x1F4F6;</li><li data-value=':vibration_mode:'>&#x1F4F3;</li><li data-value=':mobile_phone_off:'>&#x1F4F4;</li><li data-value=':heavy_multiplication_x:'>&#x2716;&#xFE0F;</li><li data-value=':heavy_plus_sign:'>&#x2795;</li><li data-value=':heavy_minus_sign:'>&#x2796;</li><li data-value=':heavy_division_sign:'>&#x2797;</li><li data-value=':bangbang:'>&#x203C;&#xFE0F;</li><li data-value=':interrobang:'>&#x2049;&#xFE0F;</li><li data-value=':question:'>&#x2753;</li><li data-value=':grey_question:'>&#x2754;</li><li data-value=':grey_exclamation:'>&#x2755;</li><li data-value=':exclamation:'>&#x2757;</li><li data-value=':heavy_exclamation_mark:'>&#x2757;</li><li data-value=':wavy_dash:'>&#x3030;&#xFE0F;</li><li data-value=':currency_exchange:'>&#x1F4B1;</li><li data-value=':heavy_dollar_sign:'>&#x1F4B2;</li><li data-value=':recycle:'>&#x267B;&#xFE0F;</li><li data-value=':trident:'>&#x1F531;</li><li data-value=':name_badge:'>&#x1F4DB;</li><li data-value=':beginner:'>&#x1F530;</li><li data-value=':o:'>&#x2B55;</li><li data-value=':white_check_mark:'>&#x2705;</li><li data-value=':ballot_box_with_check:'>&#x2611;&#xFE0F;</li><li data-value=':heavy_check_mark:'>&#x2714;&#xFE0F;</li><li data-value=':x:'>&#x274C;</li><li data-value=':negative_squared_cross_mark:'>&#x274E;</li><li data-value=':curly_loop:'>&#x27B0;</li><li data-value=':loop:'>&#x27BF;</li><li data-value=':part_alternation_mark:'>&#x303D;&#xFE0F;</li><li data-value=':eight_spoked_asterisk:'>&#x2733;&#xFE0F;</li><li data-value=':eight_pointed_black_star:'>&#x2734;&#xFE0F;</li><li data-value=':sparkle:'>&#x2747;&#xFE0F;</li><li data-value=':copyright:'>&#x00A9;&#xFE0F;</li><li data-value=':registered:'>&#x00AE;&#xFE0F;</li><li data-value=':tm:'>&#x2122;&#xFE0F;</li><li data-value=':hash:'>#&#xFE0F;&#x20E3;</li><li data-value=':zero:'>0&#xFE0F;&#x20E3;</li><li data-value=':one:'>1&#xFE0F;&#x20E3;</li><li data-value=':two:'>2&#xFE0F;&#x20E3;</li><li data-value=':three:'>3&#xFE0F;&#x20E3;</li><li data-value=':four:'>4&#xFE0F;&#x20E3;</li><li data-value=':five:'>5&#xFE0F;&#x20E3;</li><li data-value=':six:'>6&#xFE0F;&#x20E3;</li><li data-value=':seven:'>7&#xFE0F;&#x20E3;</li><li data-value=':eight:'>8&#xFE0F;&#x20E3;</li><li data-value=':nine:'>9&#xFE0F;&#x20E3;</li><li data-value=':keycap_ten:'>&#x1F51F;</li><li data-value=':capital_abcd:'>&#x1F520;</li><li data-value=':abcd:'>&#x1F521;</li><li data-value=':1234:'>&#x1F522;</li><li data-value=':symbols:'>&#x1F523;</li><li data-value=':abc:'>&#x1F524;</li><li data-value=':a:'>&#x1F170;&#xFE0F;</li><li data-value=':ab:'>&#x1F18E;</li><li data-value=':b:'>&#x1F171;&#xFE0F;</li><li data-value=':cl:'>&#x1F191;</li><li data-value=':cool:'>&#x1F192;</li><li data-value=':free:'>&#x1F193;</li><li data-value=':information_source:'>&#x2139;&#xFE0F;</li><li data-value=':id:'>&#x1F194;</li><li data-value=':m:'>&#x24C2;&#xFE0F;</li><li data-value=':new:'>&#x1F195;</li><li data-value=':ng:'>&#x1F196;</li><li data-value=':o2:'>&#x1F17E;&#xFE0F;</li><li data-value=':ok:'>&#x1F197;</li><li data-value=':parking:'>&#x1F17F;&#xFE0F;</li><li data-value=':sos:'>&#x1F198;</li><li data-value=':up:'>&#x1F199;</li><li data-value=':vs:'>&#x1F19A;</li><li data-value=':koko:'>&#x1F202;&#xFE0F;</li><li data-value=':u6708:'>&#x1F237;&#xFE0F;</li><li data-value=':u6709:'>&#x1F236;</li><li data-value=':u6307:'>&#x1F22F;</li><li data-value=':ideograph_advantage:'>&#x1F250;</li><li data-value=':u5272:'>&#x1F239;</li><li data-value=':u7121:'>&#x1F21A;</li><li data-value=':u7981:'>&#x1F232;</li><li data-value=':accept:'>&#x1F251;</li><li data-value=':u7533:'>&#x1F238;</li><li data-value=':u5408:'>&#x1F234;</li><li data-value=':u7a7a:'>&#x1F233;</li><li data-value=':congratulations:'>&#x3297;&#xFE0F;</li><li data-value=':secret:'>&#x3299;&#xFE0F;</li><li data-value=':u55b6:'>&#x1F23A;</li><li data-value=':u6e80:'>&#x1F235;</li><li data-value=':red_circle:'>&#x1F534;</li><li data-value=':large_blue_circle:'>&#x1F535;</li><li data-value=':black_circle:'>&#x26AB;</li><li data-value=':white_circle:'>&#x26AA;</li><li data-value=':black_large_square:'>&#x2B1B;</li><li data-value=':white_large_square:'>&#x2B1C;</li><li data-value=':black_medium_square:'>&#x25FC;&#xFE0F;</li><li data-value=':white_medium_square:'>&#x25FB;&#xFE0F;</li><li data-value=':black_medium_small_square:'>&#x25FE;</li><li data-value=':white_medium_small_square:'>&#x25FD;</li><li data-value=':black_small_square:'>&#x25AA;&#xFE0F;</li><li data-value=':white_small_square:'>&#x25AB;&#xFE0F;</li><li data-value=':large_orange_diamond:'>&#x1F536;</li><li data-value=':large_blue_diamond:'>&#x1F537;</li><li data-value=':small_orange_diamond:'>&#x1F538;</li><li data-value=':small_blue_diamond:'>&#x1F539;</li><li data-value=':small_red_triangle:'>&#x1F53A;</li><li data-value=':small_red_triangle_down:'>&#x1F53B;</li><li data-value=':diamond_shape_with_a_dot_inside:'>&#x1F4A0;</li><li data-value=':radio_button:'>&#x1F518;</li><li data-value=':white_square_button:'>&#x1F533;</li><li data-value=':black_square_button:'>&#x1F532;</li><li data-value=':checkered_flag:'>&#x1F3C1;</li><li data-value=':triangular_flag_on_post:'>&#x1F6A9;</li><li data-value=':crossed_flags:'>&#x1F38C;</li><li data-value=':trans:'>&#x1F3F3;&#xFE0F;&#x200D;&#x26A7;&#xFE0F;</li><li data-value=':cn:'>&#x1F1E8;&#x1F1F3;</li><li data-value=':de:'>&#x1F1E9;&#x1F1EA;</li><li data-value=':es:'>&#x1F1EA;&#x1F1F8;</li><li data-value=':fr:'>&#x1F1EB;&#x1F1F7;</li><li data-value=':gb:'>&#x1F1EC;&#x1F1E7;</li><li data-value=':uk:'>&#x1F1EC;&#x1F1E7;</li><li data-value=':it:'>&#x1F1EE;&#x1F1F9;</li><li data-value=':jp:'>&#x1F1EF;&#x1F1F5;</li><li data-value=':kr:'>&#x1F1F0;&#x1F1F7;</li><li data-value=':ru:'>&#x1F1F7;&#x1F1FA;</li><li data-value=':us:'>&#x1F1FA;&#x1F1F8;</li>
            </ul>
            <img src="assets/icons/emoji.png" alt="Enviar emoji">
            <img src="assets/icons/audio.png" alt="Gravar audio">
        </form>
    </div>
    </div>
    <script>
        $(".modal_btns div").on("click", hideSideMenu);

        function getSessionData() {
            const xml = new XMLHttpRequest();
            xml.open("POST", "./", true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xml.send("cred=<?php echo $_SESSION["ra"] . ":" . $_SESSION["password"] ?>");

            return new Promise(resolve => {
                xml.onload = () => resolve(JSON.parse(xml.responseText));
            });
        }

        const response = getSessionData().then(response => {
            const keys = Object.keys(response);
            
            keys.forEach(key => sessionStorage[btoa(key)] = btoa(unescape(encodeURIComponent(response[key]))));
        });

    </script>

    <script>
        fetch("http://api.github.com/repos/alfachat/alfachat/tags").then(response =>  response.json().then(data => (data))).then(response => $("#version").html(response[0]["name"]).attr("href", `https://github.com/alfachat/alfachat/releases/${response[0]["name"]}`));
    </script>

    <?php
        if ($_SESSION["class"] > 0)
            echo "<script src='components/subjects_menu.js'></script>";
    ?>

    <script>
        statusTimer();
	    statusBackend('i=online&o=set');
	    messageSender();
        chatListUpdater();
        
	    atob(sessionStorage["Y2xhc3M="]) > 0 ? teacherListUpdater() : null;
    </script>
</body>
</html>