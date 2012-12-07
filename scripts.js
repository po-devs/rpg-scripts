function require(file) {
    return sys["import"](file);
}

function User(id)
{
    this.id = id;
    this.team = null;
    this.channel = null;
}

require ("utilities.js");
require ("printer.js");
require ("teamChanger.js");
pokeinfo = require ("pokeinfo.js");
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

afterLogIn : function(source, chan) {
    var user = SESSION.users(source);
    user.channel = sys.channelId(chan);
    user.print("Abra", "Type /commands to get a list of commands!");
    user.print("blank", "");
}
,
beforeBattleMatchup : function() {
    sys.stopEvent();
}
,
beforeChatMessage : function(src, msg, chan) {
    SESSION.users(src).channel = chan;

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
}

});
