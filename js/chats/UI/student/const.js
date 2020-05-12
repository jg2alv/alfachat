// Time between message_area and chat_selector divs content update (in MS).
const UPDATE_TIME = 500;

// JQuery reverse function. Available using $("*").reverse()
jQuery.fn.reverse = function() {return this.pushStack(this.get().reverse(), arguments)};

// ID code of the user talking to the logged user.
let id;

// Boolean indicating whether or not the website should scroll to bottom when new messages arrive.
let canScroll = true;

// Boolean indicating whether or not the recursive update() function should execute.
let canUpdate = new Object();

// Set containing asked doubts.
let doubts = new FormData();

// addZero(1) = "10"
// addZero(10) = "10"
const addZero = i => i < 10 ? String(`${i}0`) : String(i);

// Subject list
const subjects = {
    "Qu&iacute;mica": "Desce de revesgueio e cruza de robod&eacute;sio",
    "F&iacute;sica": "Esse a&iacute; &eacute; meio emba&ccedil;adinho",
    "Biologia": "VOU CARIMBAR A SUA TESTA",
    "Matem&aacute;tica": "X vezes cinco &eacute; igual a X vezes dez divido por dois",
    "Portugu&ecirc;s": "",
    "Ingl&ecirc;s": "",
    "Geografia": "O Canad&aacute; &eacute; o pa&iacute;s com mais canadenses no mundo todo",
    "Hist&oacute;ria": "O tempo ruge e a Sapoca&iacute; &eacute; grande",
    "Filosofia": "O n&atilde;o ser &eacute; e o ser n&atilde;o &eacute;",
    "Sociologia": "De acordo com Durkheim",
    "Reda&ccedil;&atilde;o": "",
    "Literatura": "",

    draw: function(subject) {
        return `<div class="menu_icon" subject="${btoa(subject)}"><div class="pic"><img src="assets/avatars/subjects/${subject}.png" alt="${subject}"></div><div class="info"><div>${subject}</div><div>${this[subject]}</div></div></div>`;
    }
};

// Array of all doubts available on the DB
let forum_doubts = new Array();