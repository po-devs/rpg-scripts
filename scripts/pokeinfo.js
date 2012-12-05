var pokeinfo = {};

Pokemon.prototype.generate = function (id, level) {
    this.num = id;
    this.level = level;
    this.evs = new EVs(0, 0, 0, 0, 0, 0);
    this.ivs = new IVs(rand(0, 31), rand(0, 31), rand(0, 31), rand(0, 31), rand(0, 31), rand(0, 31));
    this.nick = sys.pokemon(id);
    var ratio = sys.pokeGenders(id);
    var gender = 0;
    if (ratio.hasOwnProperty("male") && ratio.hasOwnProperty("female")) {
        if (ratio.male >= rand(0, 100)) {
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
    this.nature = rand(0, 24);
    this.shiny = (0 === rand(0, 8192));
    var moves = pokeinfo.levelupMoves(id).sort();
    var movelist = [];
    var i = moves.length - 1;
    var j = 0;
    while (i-- && j < 4) {
        var line = moves[i].split(' - ');
        if (line[0].indexOf('_') !== -1) {
            line[0] = line[0].substring(0, line[0].indexOf('_'));
        }
        if (level >= line[0]) {
            movelist.push(line[1]);
            j++;
        }
    }
    this.moves = movelist;
    if (sys.pokeAbility(id, 1) === 0) {
        this.ability = sys.pokeAbility(id, 0);
    }
    else {
        this.ability = sys.pokeAbility(id, rand(0, 1));
    }
    this.happiness = 70; //placeholder for when base happiness data is added
    this.item = 0;
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
    return moves;
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
        pokeinfo.effortValues[pokemon][0] = line[1]; //hp
        pokeinfo.effortValues[pokemon][1] = line[2]; //atk
        pokeinfo.effortValues[pokemon][2] = line[3]; //def
        pokeinfo.effortValues[pokemon][3] = line[4]; //spatk
        pokeinfo.effortValues[pokemon][4] = line[5]; //spdef
        pokeinfo.effortValues[pokemon][5] = line[6]; //speed
    }
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

ret = pokeinfo;