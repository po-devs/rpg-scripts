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

//All of the information is stored as numbers
Pokemon.prototype.print = function (user){
    var name = sys.pokemon(this.num);
    var gender = this.gender === 0 ? "" : (this.gender===1?"(M)":"(F)");
    if (name === this.nick) {
        user.print(name + " " + gender + " lv. " + this.level + " @ " + sys.item(this.item) + (this.shiny? " [Shiny]" : ""));
    } else {
        user.print(this.nick + " ("+ name + ") " + gender + " lv. " + this.level + " @ " + sys.item(this.item) + (this.shiny? " [Shiny]" : ""));
    }

    user.print("Trait: " + sys.ability(this.ability));
    this.evs.print(user);
    this.ivs.print(user);
    user.print(sys.nature(this.nature)+ " nature, " + this.happiness + " happiness");
    for (var i in this.moves) {
        user.print("- " + sys.move(this.moves[i]));
    }
};

IVs.prototype.print = function(user) {
    /* Max IVs */
    if (this.hp + this.att + this.def + this.spAtt + this.spDef + this.speed === 6*31) {
        return;
    }
    user.print("IVs: " + this.hp + " HP / " + this.att + " Atk / " + this.def + " Def / " + this.spAtt + " SAtk / " + this.spDef + " SDef / " + this.speed + " Spd");
}

EVs.prototype.print = function(user) {
    /* No EVs */
    if (this.hp + this.att + this.def + this.spAtt + this.spDef + this.speed === 0) {
        return;
    }
    var array = [];
    if (this.hp) array.push(this.hp + " HP");
    if (this.att) array.push(this.hp + " Atk");
    if (this.def) array.push(this.hp + " Def");
    if (this.spAtt) array.push(this.hp + " SAtk");
    if (this.spDef) array.push(this.hp + " SDef");
    if (this.speed) array.push(this.hp + " Spd");

    user.print("EVs: " + array.join(" / "));
}
