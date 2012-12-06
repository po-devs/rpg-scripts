var colors = [
    "#a8a878",
    "#c03028",
    "#a890f0",
    "#a040a0",
    "#e0c068",
    "#b8a038",
    "#a8b820",
    "#705898",
    "#b8b8d0",
    "#f08030",
    "#6890f0",
    "#78c850",
    "#f8d030",
    "#f85888",
    "#98d8d8",
    "#7038f8",
    "#705848",
    "#68a090"
];

function is_undefined(val) {
    return typeof (val) === 'undefined' || val === null;
}

User.prototype.print = function (bot, message) {
    var sendMessage = function (id, message, channel) {
        if (!is_undefined(channel)) {
            sys.sendMessage(id, message, channel);
        }
        else {
            sys.sendMessage(id, message);
        }
    };
    var sendHtmlMessage = function (id, message, channel) {
        if (!is_undefined(channel)) {
            sys.sendHtmlMessage(id, message, channel);
        }
        else {
            sys.sendHtmlMessage(id, message);
        }
    };
    if (bot === "blank") {
        sendMessage(this.id, message, this.channel);
        return;
    }
    if (bot === "***") {
        sendMessage(this.id, "*** " + message + " ***", this.channel);
        return;
    }

    var pokemon = sys.pokeNum(bot);
    var color;

    if (!is_undefined(pokemon)) {
        color = colors[sys.pokeType1(pokemon)];
    }

    if (bot.startsWithLetter()) {
        bot = "±" + bot;
    }

    if (is_undefined(color)) {
        sendMessage(this.id, bot + ": " + message, this.channel);
    }
    else {
        sendHtmlMessage(this.id, "<span style='color: " + color + "'><timestamp/>" + "<b>" + bot + ":</b></span> " + message, this.channel);
    }
};