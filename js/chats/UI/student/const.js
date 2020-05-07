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

const addZero = i => i < 10 ? String(`${i}0`) : String(i);