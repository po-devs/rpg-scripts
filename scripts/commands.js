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

commands['wild'] = ["Battle a wild pokemon!", function(params) {
    var user = params.user;
    if (!user.rpg) {
        user.print("Professor Tree", "You need to have begun your adventure to battle wild pokemon!");
        return;
    }

    var wp = sys.id("Wild Pokemon");
    if (wp <= 0 || !sys.loggedIn(wp)) {
        user.print("Professor Tree", "Let the wild pokemon rest a bit! There's none around here, as you can see!");
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

    team.syncToUser(wp);

    user.print("");
    user.print(sys.pokemon(pokeid), sys.pokemon(pokeid).toUpperCase());
    user.print("");
    sys.forceBattle(user.id, wp,0,0,0,0);
}
];

commands['clear'] = ["Removes all traces of RPG on you! With that you can /start again.", function(params) {
    var user = params.user;

    if (user.rpg === null) {
        user.print("Deoxys", "You aren't playing an RPG!");
        return;
    }

    user.rpg = null;
    user.print("Deoxys", "All traces of you in the RPG world have been erased!");
}];

commands['save'] = ["Saves the game in its current state.", function(params) {
    var user = params.user;

    if (user.rpg === null) {
        user.print("Porygon", "You aren't playing an RPG game at the moment!");
        return;
    }

    var savename = sys.name(user.id).toLowerCase();
    if (!sys.dbRegistered(savename)) {
        user.print("Porygon", "You need to register before saving your game!");
        return;
    }

    var savefolder = "rpgsaves";

    // Make the folder if it doesn't exist already
    sys.makeDir(savefolder);
    sys.writeToFile(savefolder + "/" + escape(savename) + ".json", JSON.stringify(user.rpg));

    user.print("Porygon", "Your game has been saved! You can use /load to load your game.");
}];

commands['load'] = ["Loads your previous game.", function(params) {
    var user = params.user;

    if (user.rpg !== null) {
        user.print("Porygon", "You are already playing an RPG game!");
        return;
    }

    var savename = sys.name(user.id).toLowerCase();

    if (!sys.dbRegistered(savename)) {
        user.print("Porygon", "You need to register before loading a game!");
        return;
    }

    var savefolder = "rpgsaves";
    var content = sys.getFileContent(savefolder + "/" + escape(savename) + ".json");
    if (content === undefined) {
        user.print("Porygon", "You haven't saved a game!");
        return;
    }

    try {
        var gamefile = JSON.parse(content);
    }
    catch (err) {
        user.print("Porygon", "Your game file is corrupted. We apolgise for the inconvenience...");
        return;
    }

    // Data needs to be rehashed to provide the full functionality...

    var localdata = gamefile.team.pokes;
    var newpokes = [];

    for (var x=0; x<6; x++) {
        if (localdata[x].hasOwnProperty("num")) {
            var ivvals = localdata[x].ivs;
            localdata[x].ivs = new IVs(ivvals["hp"],ivvals["att"],ivvals["def"],ivvals["spAtt"],ivvals["spDef"],ivvals["speed"]);
            var evvals = localdata[x].evs;
            localdata[x].evs = new EVs(evvals["hp"],evvals["att"],evvals["def"],evvals["spAtt"],evvals["spDef"],evvals["speed"]);
            newpokes.push(new Pokemon(localdata[x]));
        }
        else {
            newpokes.push(new Pokemon());
        }
    }

    var oldteam = new Team(newpokes);

    oldteam.syncToUser(user.id);
    gamefile.team.pokes = localdata;
    user.rpg = gamefile;
    user.print("Porygon", "Your game has been loaded successfully!");
}];

/*commands['eval'] = ["Evaluation.", function(params) {
    if (sys.ip(params.user.id) != "127.0.0.1") {
        return;
    }
    var res = sys.eval(params.data);
    params.user.print("Porygon", res);
}];*/

ret = ({handleCommand: handleCommand});
