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

commands['team'] = ["Shows your team.", function(params) {
    params.user.print("Porygon", "Here's your team:");
    params.user.getTeam().print(params.user);
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

commands['start'] = ["Start the RPG! You can specify your starter, too.", function(params) {
    var user = params.user;
    if (user.rpg) {
        user.print("Professor Tree", "You already started the game, you gotta go with what you have!");
        return;
    }

    /* Generates a pokemon at random to give */
    var data = (params.data||"").split(" ");
    var pokeid = (sys.pokeNum(data[0]) || 0) & 0xFFFF; //Remove forme
    if (!pokeid) {
        pokeid = sys.rand(1, 650);
    }

    var team = new Team();
    team.poke(0).generate(pokeid, 5);

    user.rpg = {};
    user.rpg.team = team;
    team.syncToUser(user.id);

    user.print("Professor Tree", "Welcome, young trainer, to the world of pokemon! Pokemon are wonderful things and...");
    user.print("Professor Tree", "I just had this " + sys.pokemon(team.poke(0).num) + " delivered to me! Take it!");

    team.print(user);

    user.print("Professor Tree", "You are now on your way to become a pokemon master! Battle with your " + team.poke(0).nick + " and go fulfill your destiny!");
    user.print("");
}];

ret = ({handleCommand: handleCommand});
