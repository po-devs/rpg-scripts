function require(file) {
	return sys.eval(sys.getFileContent(file));
}

function User(id)
{
    this.id = id;
    this.team = null;
    this.channel = null;
}

require ("scripts/printer.js");
commands = require ("scripts/commands.js");

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

poScripts = ({

afterLogIn : function(source) {

}
,
beforeBattleMatchup : function() {
    sys.stopEvent();
}
,
beforeChatMessage : function(src, msg, chan) {
    SESSION.users(src).channel = chan;

    if (msg.substr(0, 1) == "/") {
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

        commands.handleCommand(src, command, data, tar);
    }
}

});