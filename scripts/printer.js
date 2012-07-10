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
    return typeof(val) === 'undefined' || val === null;
};

User.prototype.print = function(bot, message) {
    var pokemon = sys.pokemon(bot);
    var color;

    if (!is_undefined(pokemon)) {
        color = colors[sys.pokeType1(pokemon)];
    }

    if (is_undefined(color)) {
        sys.sendMessage(this.id, "±" + bot + ": " + message, this.channel);
    } else {
        sys.sendHtmlMessage(this.id, "<span style='color: " + color + "'><timestamp/>"
                            + "<b>±" + bot +  ":</b></span> " + message);
    }
};
