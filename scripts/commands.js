var commands = {};

var handleCommand = function(src, command, data, tar, channel) {
    var user = SESSION.users(src);

    if (command in commands) {
        commands[command][1]({"user":user, "data":data, "target":tar, "channel":channel});
    }
};

commands['commands'] = ["get a list of commands.", function(params) {
    var user = params.user;
    //user.print("blank","");
    user.print("***", "Commands");
    user.print("blank","");

    for(var command in commands) {
        user.print("/"+command, commands[command][0]);
    }

    user.print("blank", "");
}];

commands['help'] = ["get started.", function(params) {
    var user = params.user;
    user.print("Meowth", "This is a RPG server in construction! Nothing to see just yet, be patient ~");
}];

commands['transfer'] = ["Transfer your team to someone else.", function(params) {
    var user = params.user;

    if (!params.target) {
        user.print("Porygon", "You can't transfer your team to " + params.data + ", they don't exist!");
        return;
    }

    var target = SESSION.users(params.target);
    target.setTeam(user.getTeam());

    user.print("Porygon", "You successfully transferred your team to " + target.name() + "!" );
    target.print("Porygon", user.name() + " transferred their team over to you!");
}];

commands['generate'] = ["Generate the pokemon specified with random stats.", function(params) {
    var user = params.user;
    var data = (params.data||"").split(" ");
    var pokeid = (sys.pokeNum(data[0]) || 0) & 0xFFFF; //Remove forme

    if (pokeid === 0) {
        user.print("Arceus", "I can't generate a pokemon '"+(params.data||'Missingno')+"'. Please enter a valid pokemon.");
        return;
    }
    var f = function(msg) {
        var level = Math.floor(+(msg) || 0);
        if (level < 1 || level > 100) {
            user.print("Arceus", "Please input a valid level, i.e. a number between 1 and 100:");
            /* wrong message, do nothing */
            return false;
        }
        var poke = new Pokemon();
        poke.generate(pokeid, level);
        user.print("");
        poke.print(user);
        /* good message, remove phase */
        return true;
    };
    if (data.length > 1) {
        f(data[1]);
    } else {
        user.print("Arceus", "Please input the level of the " + sys.pokemon(pokeid) + ":");
        user.phase = f;
    }
}];

ret = ({handleCommand: handleCommand});
