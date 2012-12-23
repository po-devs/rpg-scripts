var pokeinfo = {};

Pokemon.prototype.generate = function (id, level) {
    this.num = id;
    this.level = level;
    this.evs = new EVs(0, 0, 0, 0, 0, 0);
    this.ivs = new IVs(rand(0, 31), rand(0, 31), rand(0, 31), rand(0, 31), rand(0, 31), rand(0, 31));
    this.nick = sys.pokemon(id);
    this.happiness = pokeinfo.getBaseHappiness(id);
    this.item = 0;
    this.nature = rand(0, 24);
    this.shiny = (0 === rand(0, 8192));
    if (sys.pokeAbility(id, 1) === 0) {
        this.ability = sys.pokeAbility(id, 0);
    }
    else {
        this.ability = sys.pokeAbility(id, rand(0, 1));
    }
    var ratio = sys.pokeGenders(id);
    var gender = 0;
    if (ratio.hasOwnProperty("male") && ratio.hasOwnProperty("female")) {
        if (ratio.male >= rand(1, 100)) {
            gender = 1;
        }
        else {
            gender = 2;
        }
    }
    else if (ratio.hasOwnProperty("male") && !ratio.hasOwnProperty("female")) {
        gender = 1;
    }
    else if (!ratio.hasOwnProperty("male") && ratio.hasOwnProperty("female")) {
        gender = 2;
    }
    this.gender = gender;
    var moves = pokeinfo.levelupMoves(id);
    var movelist = [];
    var i = moves.length;
    var j = 0;
    while (i-- && j < 4) {
        var line = moves[i].split(' - ');
        if (line[0].indexOf('_') !== -1) {
            line[0] = line[0].substring(0, line[0].indexOf('_'));
        }
        if (level >= line[0] && movelist.indexOf(line[1]) === -1) {
            movelist.push(line[1]);
            j++;
        }
    }
    this.moves = movelist;
};

pokeinfo.loadData = function loadData() {
    pokeinfo.loadLevelMoves();
    pokeinfo.loadEVs();
    pokeinfo.loadBaseStats();
    pokeinfo.loadHappiness();
    pokeinfo.loadBaseExperience();
    pokeinfo.loadExperienceGroups();
};

pokeinfo.loadLevelMoves = function loadLevelMoves() {
    pokeinfo.levelMoves = {};
    pokeinfo.maxOrder = 0;
    var moves = sys.getFileContent('data/pokemon_moves.csv').split('\n');
    for (var x = 0; x < moves.length; x++) {
        var line = moves[x].split(',');
        var pokemon = line[0];
        if (!pokeinfo.levelMoves.hasOwnProperty(pokemon)) {
            pokeinfo.levelMoves[pokemon] = {};
        }
        var level = line[4];
        var move = line[2];
        var order = parseInt(line[5], 10);
        if (!isNaN(order)) {
            if (order > pokeinfo.maxOrder) {
                pokeinfo.maxOrder = order;
            }
            pokeinfo.levelMoves[pokemon][level + "_" + order] = move;
        }
        else {
            pokeinfo.levelMoves[pokemon][level] = move;
        }
    }
};

pokeinfo.levelupMovesAt = function levelupMovesAt(num, level) {
    if (!pokeinfo.levelMoves.hasOwnProperty(num)) {
        return "No Moves";
    }
    if (pokeinfo.levelMoves[num].hasOwnProperty(level)) {
        return pokeinfo.levelMoves[num][level];
    }
    var moves = [];
    for (var x = 1; x < pokeinfo.maxOrder + 1; x++) {
        if (pokeinfo.levelMoves[num].hasOwnProperty(level + "_" + x)) {
            moves.push(pokeinfo.levelMoves[num][level + "_" + x]);
        }
        else {
            break;
        }
    }
    if (moves.length > 0) {
        return moves;
    }
    else {
        return "No Moves";
    }
};

pokeinfo.levelupMoves = function levelupMoves(num) {
    if (!pokeinfo.levelMoves.hasOwnProperty(num)) {
        return "No Moves";
    }
    var data = pokeinfo.levelMoves[num];
    var moves = [];
    for (var x in data) {
        if (data.hasOwnProperty(x)) {
            moves.push(x + " - " + data[x]);
        }
    }
    var sortMoves = function (a, b) {
        a = a.substring(0, a.indexOf(" - "));
        b = b.substring(0, b.indexOf(" - "));
        var c, d;
        if (a.indexOf('_') !== -1) {
            c = a.substring(a.indexOf('_') + 1);
            a = a.substring(0, a.indexOf('_'));
        }
        if (b.indexOf('_') !== -1) {
            d = b.substring(b.indexOf('_') + 1);
            b = b.substring(0, b.indexOf('_'));
        }
        if (c !== undefined && d !== undefined) {
            return c - d;
        }
        return a - b;
    };
    return moves.sort(sortMoves);
};

pokeinfo.loadEVs = function loadEVs() {
    pokeinfo.effortValues = {};
    var values = sys.getFileContent('data/pokemon_effort_values.csv').split('\n');
    for (var x = 0; x < values.length; x++) {
        var line = values[x].split(',');
        var pokemon = line[0];
        if (!pokeinfo.effortValues.hasOwnProperty(pokemon)) {
            pokeinfo.effortValues[pokemon] = {};
        }
        pokeinfo.effortValues[pokemon] = line.slice(1);
    }
};

pokeinfo.loadBaseStats = function loadBaseStats() {
    var pokelist = sys.getFileContent("db/pokes/stats.txt");
    var pokes = pokelist.split("\n");
    var pokedb = {};
    for (var x = 0; x < pokes.length; x++) {
        var data = pokes[x].split(" ");
        if (data.length != 7) {
            continue;
        }
        var thepokeid = data[0].split(":");
        var thepoke = parseInt(thepokeid[0],10) + 65536*parseInt(thepokeid[1],10);
        pokedb[thepoke] = [parseInt(data[1],10), parseInt(data[2],10), parseInt(data[3],10), parseInt(data[4],10), parseInt(data[5],10), parseInt(data[6],10)];
    }
    pokeinfo.baseStats = pokedb;
};

// Gets base stat
// To call: pokeinfo.baseStat(pokeid, stat [0-5])
pokeinfo.baseStat = function baseStat(num, stat) {
    var retnum = num;
    if (stat < 0 || stat > 5 || isNaN(stat)) {
        return "Incorrect Stat";
    }
    if (!pokeinfo.baseStats.hasOwnProperty(num)) {
        // Check for forms
        if (pokeinfo.baseStats.hasOwnProperty(num%65536)) {
            retnum = num%65536;
        }
        else {
            return "Incorrect Pokemon";
        }
    }
    return pokeinfo.baseStats[retnum][stat];
};

pokeinfo.baseEffortValueStat = function baseEffortValueStat(num, stat) {
    if (stat < 0 || stat > 5 || isNaN(stat)) {
        return "Incorrect Stat";
    }
    if (!pokeinfo.effortValues.hasOwnProperty(num)) {
        return "Incorrect Pokemon";
    }
    return pokeinfo.effortValues[num][stat];
};

pokeinfo.baseEffortValues = function baseEffortValues(num) {
    if (!pokeinfo.effortValues.hasOwnProperty(num)) {
        return "Incorrect Pokemon";
    }
    var data = pokeinfo.effortValues[num];
    var evs = [];
    for (var x in data) {
        if (data.hasOwnProperty(x)) {
            evs.push(data[x]);
        }
    }
    return evs;
};

pokeinfo.loadHappiness = function loadHappiness() {
    pokeinfo.baseHappiness = {};
    var values = sys.getFileContent('data/pokemon_base_happiness.csv').split('\n');
    for (var x = 0; x < values.length; x++) {
        var line = values[x].split(',');
        pokeinfo.baseHappiness[line[0]] = line[1];
    }
};

pokeinfo.getBaseHappiness = function getBaseHappiness(num) {
    if (!pokeinfo.baseHappiness.hasOwnProperty(num)) {
        return "Incorrect Pokemon";
    }
    return pokeinfo.baseHappiness[num];
};

pokeinfo.loadBaseExperience = function loadBaseExperience() {
    pokeinfo.baseExperience = {};
    var values = sys.getFileContent('data/pokemon_base_experience.csv').split('\n');
    for (var x = 0; x < values.length; x++) {
        var line = values[x].split(',');
        pokeinfo.baseExperience[line[0]] = line[1];
    }
}

pokeinfo.getBaseExperience = function getBaseExperience(num) {
    if (!pokeinfo.baseExperience.hasOwnProperty(num)) {
        return "Incorrect Pokemon";
    }
    return pokeinfo.baseExperience[num];
}

pokeinfo.loadExperienceGroups = function loadExperienceGroups() {
    pokeinfo.experienceGroups = {};
    var values = sys.getFileContent('data/pokemon_experience_type.csv').split('\n');
    for(var x = 0; x < values.length; x++) {
        var line = values[x].split(',');
        pokeinfo.experienceGroups[line[0]] = line[1];
    }
}

pokeinfo.getExperienceGroup = function getExperienceGroup(num) {
    if (!pokeinfo.experienceGroups.hasOwnProperty(num)) {
        return "Incorrect Pokemon";
    }
    return pokeinfo.experienceGroups[num];
}

ret = pokeinfo;