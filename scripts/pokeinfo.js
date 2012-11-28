var pokeinfo = {};

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
ret = pokeinfo;