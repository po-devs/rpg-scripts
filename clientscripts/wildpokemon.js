var poke = function(spot) { return battle.data.team(spot).poke(0);};
var fpoke = function(spot) { return battle.data.field.poke(spot);};
var tpoke = function(ind) { return battle.data.team(battle.me).poke(ind);};

wildpokemon = ({
onChoiceSelection: function(player) {
    if (player!=battle.me) {
        return;
    }
    var switches = [];
    for (var i = 1; i < 6; i++) {
        if (!tpoke(i).isKoed()) {
           switches.push(i);
        }
    }

   var r = sys.rand(0, 8);

    if (r == 0 || (fpoke(battle.me).onTheField && !poke(battle.me).isKoed() && (r != 1 || switches.length == 0))) {
        var moves = [];
        var p = poke(battle.me);
        for (var i = 0; i < 4; i++) {
            if (p.move(i).num) {
                moves.push(i);
            }
        }
        choice = {"slot": battle.me, "type":"attack", "attackSlot":moves[sys.rand(0,moves.length)]};
    } else {
        var cswitch = switches[sys.rand(0,switches.length)];
   
        choice = {"slot": battle.me, "type":"switch", "pokeSlot": cswitch};
    }
    battle.battleCommand(battle.id, choice);
},
onBattleEnd : function (res, winner) {
    battle.close();
}
});
