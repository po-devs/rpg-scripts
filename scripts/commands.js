var commands = {};

var handleCommand = function(src, command, data, tar, channel) {
    var user = SESSION.users(src);

    if (command in commands) {
        commands[command]({"user":user, "data":data, "target":tar, "channel":channel});
    }
};

commands['help'] = function(params) {
    var user = params.user;
    user.print("Meowth", "This is a RPG server in construction! Nothing to see just yet, be patient ~");
};

ret = ({handleCommand: handleCommand});
