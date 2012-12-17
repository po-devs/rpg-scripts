function require(file) {
    return sys["import"](file);
}

function User(id)
{
    this.id = id;
    this.team = null;
    this.channel = null;
    this.phase = null;
    this.rpg = null;
}

require ("utilities.js");
require ("teamChanger.js");
pokeinfo = require ("pokeinfo.js");
require ("printer.js");
commands = require ("commands.js");

SESSION.identifyScriptAs("RPG Script");

//SESSION.registerGlobalFactory(POGlobal);
SESSION.registerUserFactory(User);
//SESSION.registerChannelFactory(POChannel);

/* Function to clear chat - endless text
  may lag the server at one point. */
lastMemUpdate = sys.time();
function testClearChat() {
    if (parseInt(sys.time(), 10) - lastMemUpdate > 1000) {
        sys.clearChat();
        lastMemUpdate = parseInt(sys.time(), 10);
    }
}

pokeinfo.loadData(); //loads all the data from pokeinfo

poScripts = ({

afterLogIn : function(source) {
    var user = SESSION.users(source);
    user.print("Abra", "Type /commands to get a list of commands!");
    user.print("blank", "");
}
,
beforeBattleMatchup : function() {
    sys.stopEvent();
}
,
beforeChatMessage : function(src, msg, chan) {
    var user = SESSION.users(src);
    user.channel = chan;

    /* This variable is used to capture user input if they're in the middle of doing something */
    if (user.phase) {
        var phase = user.phase;
        var res = phase(msg);

        if (res) {
            /* All went well, stopping message */
            sys.stopEvent();
            if (user.phase === phase) user.phase = null;
        } else {
            /* Something went wrong, doing nothing */
        }
        return;
    }

    if (msg.substr(0, 1) === "/") {
        sys.stopEvent();
        testClearChat();

        var data, command, tar;
        var pos = msg.indexOf(' ');

        if (pos !== -1) {
            command = msg.substring(1, pos).toLowerCase();
            data = msg.substr(pos+1);
            tar = sys.id(data);
        } else {
            command = msg.substr(1).toLowerCase();
        }

        commands.handleCommand(src, command, data, tar, chan);
    }
},

beforeBattleEnded : function(winner,loser,desc,battleid) {
    /* Keeps "used" teams, aka teams with HP loss */
    if (sys.loggedIn(winner)) {
        sys.setTeamToBattleTeam(winner, 0, battleid);
        var uwinner = SESSION.users(winner);
        if (uwinner && uwinner.rpg) {
            uwinner.rpg.team = uwinner.getTeam();
        }
    }
    if (sys.loggedIn(loser)) {
        sys.setTeamToBattleTeam(loser, 0, battleid);
        var uloser = SESSION.users(loser);
        if (uloser && uloser.rpg) {
            uloser.rpg.team = uloser.getTeam();
        }
    }
},

afterChangeTeam : function(src) {
    var user = SESSION.users(src);
    if (user && user.rpg && user.rpg.team) {
        user.rpg.team.syncToUser(user.id);
    }
}

});
