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

User.prototype.print = function (bot, message) {
    if (is_undefined(this.channel)) {
        /* This.channel = lowest channel id of player (0 is default channel) */
        var chans = sys.channelsOfPlayer(this.id);
        chans.sort();
        this.channel = chans[0];
    }

    /* If only one argument, treat it as no bot specified and only message */
    if (arguments.length === 1) {
        message = bot;
        bot = "blank";
    }

    if (bot === "blank") {
        sys.sendMessage(this.id, message, this.channel);
        return;
    }
    if (bot === "***") {
        sys.sendMessage(this.id, "*** " + message + " ***", this.channel);
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
        sys.sendMessage(this.id, bot + ": " + message, this.channel);
    }
    else {
        sys.sendHtmlMessage(this.id, "<span style='color: " + color + "'><timestamp/>" + "<b>" + bot + ":</b></span> " + message, this.channel);
    }
};

Team.prototype.print = function(user) {
    for (var i = 0; i < this.pokes.length; i++) {
        if (this.poke(i).isValid()) {
            this.poke(i).print(user);
        }
    }
};

Pokemon.prototype.print = function (user){
    user.print("");
    sys.sendHtmlMessage(user.id, "<table><tr><td><img src='pokemon:" + this.num+ "' /></td><td><pre>"+this+"</pre></td></tr></table>", user.channel);
};
