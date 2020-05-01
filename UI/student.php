<!doctype html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='initial-scale=1, maximum-scale=1'>
    <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Didact+Gothic'>
    <link rel='icon' type='image/png' href='../img/logo_short.png'>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="../js/connection.js"></script>
    <script src="../js/toast.class.js"></script>
    <?php
        foreach (array_diff(scandir("../js/chats"), array(".", "..")) as $file) {
            echo "<script src='../js/chats/$file'></script>";   // Load JS files
        }

        foreach (array_diff(scandir("../css"), array(".", "..")) as $file) {
            if ($file === "login.css") {
                continue;
            }
            echo "<link rel='stylesheet' type='text/css' href='../css/$file'></link>";   // Load JS files
        }
    ?>
    <title>AlfaChat | Conversas</title>
</head>
<body>
    <div class="side_menu">
        <div class="side_menu_visible">
            <header>
                <img id="user_img" src="<?php echo $_SESSION["photo"] ? $_SESSION["photo"] : "assets/avatars/users/default.png"; ?>"><br>
                <span id="user_name" style="font-weight: bold"><?php echo $_SESSION["name"]; ?></span><br>
                <span id="user_ra"><?php echo $_SESSION["ra"]; ?></span>
            </header>
            <main style="overflow-y: auto">
                <div id="new_group" class="menu_icon"><div class="pic"><img style="max-width: 50%"  src="assets/icons/group.png" alt="Novo Grupo"></div><div class="info" style="flex: 4">Novo Grupo</div></div>
                <div style="flex-direction: column; justify-content: center; padding: 0" id="subjects_menu" class="menu_icon">
                    <div style="display: flex; padding-left: 20px; min-height: 100%; min-width: 100%; box-sizing: border-box">
                        <div class="pic"><img style="max-width: 50%"  src="assets/icons/play.png" alt="Professores"></div>
                        <div class="info" style="flex: 4">Disciplinas</div>
                    </div>
                    <div id="teacher_list" style="padding-top: 15px; height: auto; display: none; margin-bottom: 10px">
                        <?php
                            require "../includes/teachers_list.inc.php";
                        ?>
                    </div>
                    <script>
                        function teacherListUpdater() {
                            const xml = new XMLHttpRequest(),
                                t0 = performance.now();

                            xml.open("POST", "../includes/teachers_list.inc.php", true);
                            xml.send(null);

                            xml.onload = () => {
                                const teachers_list = document.createElement("div");
                                teachers_list.innerHTML = xml.responseText;

                                if ($("#teacher_list").html() !== teachers_list.innerHTML) {
                                    $("#teacher_list").html(teachers_list.innerHTML);
                                    $("[subject]").on("click", e => {
                                        hideSideMenu();
                                        $(e.currentTarget).attr("data-id") === "dGVhY2hlcjow" ? openChat(e, e.currentTarget.children[1].children[0].children[0], "offline") : openChat(e, e.currentTarget.children[1].children[0].children[0], "online");
                                        $('[subject]').attr('style', 'background: #291a46'); // Removing "selected" background from every other div
                                        e.currentTarget.style.backgroundColor = '#35215a'; // Setting background to a darker one, indicating "selected"
                                    });
                                }
                                
                                $(document).remove(teachers_list);
                                update(t0, "teacherListUpdater");
                            }

                            return;
                        }

                        teacherListUpdater();
                        </script>
                </div>
            </main>
            <footer style="padding: 0; margin-top: 15px; padding-top: 10px">
                <div id="config" class="menu_icon"><div class="pic"><img style="max-width: 50%" src="assets/icons/settings.png" alt="Config"></div><div class="info" style="flex: 4">Configura&ccedil;&otilde;es</div></div>
                <div class="menu_icon"><div class="pic" style="margin: 0 15px"><img src="assets/icons/release.png" style="width: 200%; border-radius: 0"></div><div class="info"><a target="_blank" href="https://github.com/alfachat/alfachat/releases" id="version"></a></div></div>
            </footer>
        </div>
        <div class="side_menu_bg"></div>
    </div>
    <form class="submenu" id="new_group_menu" enctype="multipart/form-data">
        <div class="submenu_container" style="display: flex; flex: 1">
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
        <footer class="submenu_btns">
            <div>FECHAR</div>
            <button type="submit">PROSSEGUIR</button>
        </footer>
    </form>
    <form class="submenu" id="new_group_menu_advanced">
       <header>
           <span class="submenu_header_title">Adicionar Membros:</span>
           <div id="member_search_container">
                <div style="display: flex;"></div>
                <input type="text" placeholder="Busca">
           </div>
       </header>
       <main>
            <div class="members_result" hidden></div>
            <div class="members"></div>
            <footer class="submenu_btns" style="flex: 1">
                <div>FECHAR</div>
                <button type="submit">PROSSEGUIR</button>
            </footer>    
       </main> 
    </form>
    <div class="submenu" id="settings_menu">
        <header>
            <div style="display: flex; justify-content: space-between; flex: 1;">
                <span class="submenu_header_title" style="flex: 4">Configura&ccedil;&otilde;es:</span>
                <div class="settings_header_btns">
                    <img src="assets/icons/advanced_icon.png" alt="3 pontinhos">
                    <div id="settings_menu_header_drop_down" class="settings_menu_header_drop_down">
                        <span>Encerrar sess&atilde;o</span>
                        <span class="edit_profile">Editar perfil</span>
                    </div>
                    <img src="assets/icons/x_icon.png" alt="X icon" style="width: 18%; margin-bottom: 3.5px">
                </div>
            </div>
            <div class="settings_menu_user_area">
                <div class="pic">
                    <img src="<?php echo $_SESSION["photo"] ? $_SESSION["photo"] : "assets/avatars/users/default.png"; ?>">
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
                    <div class="submenu_header_title" style="flex: 20; display: flex; align-items: start; padding-left: 0; padding-left: 25px">
                        <img id="settings_menu_back" src="assets/icons/arrow.png" alt="Voltar">
                        <span style="margin: 12px 0 0 10px;">Informa&ccedil;&otilde;es:</span>
                    </div>
                    <div class="settings_header_btns" style="flex: 1; text-align: end;">
                        <img id="settings_menu_close" src="assets/icons/x_icon.png" alt="X icon">
                    </div>
                </div>
                <div style="background-color: #291a46; flex: 3; flex-direction: column; justify-content: center; align-items: center; display: flex">
                    <img id="settings_menu_advanced_profile_pic" src="<?php echo $_SESSION["photo"] ? $_SESSION["photo"] : "assets/avatars/users/default.png" ?>" alt="">
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
    <div class="chat_selector">
        <header>
            <img src="assets/icons/menu.png" alt="Menu icon">
            <input type="text" name="query" placeholder="Busca">
        </header>
        <div class="chat_result_list" hidden></div>
        <div class="chat_list"><?php require "../includes/chat_list.inc.php"; ?></div>
        <script>
            function chatListUpdater() {
                const xml = new XMLHttpRequest(),
                    t0 = performance.now();

                xml.open("POST", "../includes/chat_list.inc.php", true);
                xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xml.send("chats=1");

                xml.onload = () => {
                    const xml = new XMLHttpRequest();

                    $("chat_list").attr("data-chats", xml.responseText);
                    xml.open("POST", "../includes/chat_list.inc.php", true);
                    xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xml.send(null);

                    xml.onload = () => {
                        if (xml.responseText !== $("chat_list").html()) {
                            $("chat_list").html(xml.responseText);
                            $(".chat:visible").on("click", openChat);
                        }
                        
                        update(t0, "chatListUpdater");
                    }
                }

                return;
            }

            chatListUpdater();
        </script>
    </div>

    <div class="chats">
        <div class="choose_chat">Escolha uma conversa para entrar</div>
        <header>
            <img src="assets/icons/arrow.png" alt="Back Arrow">
            <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-direction: column">
                <div></div>
                <div></div>
            </div>
            <img src="assets/icons/advanced_icon.png" alt="Avan&ccedil;ado">
            <div id="settings_menu_header_drop_down_2" class="settings_menu_header_drop_down">
                <span>Encerrar sess&atilde;o</span>
                <span class="edit_profile">Editar perfil</span>
            </div>
        </header>
        <div class="message_area"></div>
        <form class="input_area" enctype="multipart/form-data">
            <input id="file_input" type="file" style="display: none" name="file_input" multiple>
            <img src="assets/icons/file.png" alt="Carregar arquivo">
            <input placeholder="Escreva sua mensagem..." type="text">
            <div class="audio_control" style="background-color: green; bottom: 80px; left: 85px" hidden></div>
            <div class="audio_control" style="background-color: red; bottom: 40px; left: 60px" hidden></div>
            <span class="countdown" hidden>00:00</span>
            <img src="assets/icons/audio.png" alt="Gravar audio">
        </form>
    </div>
    </div>
    <script>
        async function getSessionData() {
            const xml = new XMLHttpRequest();
            xml.open("POST", "./", true);
            xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xml.send("s=1");

            return new Promise(resolve => {
                xml.onload = () => resolve(JSON.parse(xml.responseText));
            });
        }

        const response = getSessionData().then(response => {
            const keys = Object.keys(response);
            
            keys.forEach(key => sessionStorage[btoa(key)] = btoa(unescape(encodeURIComponent(response[key]))));
        });

        fetch("http://api.github.com/repos/alfachat/alfachat/tags").then(response =>  response.json().then(data => (data))).then(response => $("#version").html(response[response.length - 1]["name"]));


        $(".submenu_btns div:nth-of-type(1)").on("click", hideSideMenu);
        $("#subjects_menu div").eq(0).on("click", e => {
            $("#subjects_menu").toggleClass("subjects_menu_active");

            const icon = $("#subjects_menu img")[0];

            if (!icon.style.transform) {
                icon.style.transform = "rotate(90deg)";
                $("#subjects_menu div").eq(3).slideDown();
            } else {
                icon.style.transform = "";
                $("#subjects_menu div").eq(3).slideUp();
            }
        });
    </script>
</body>
</html>