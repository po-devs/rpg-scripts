/*
NOTE: ALL SYNCING WILL ONLY WORK WITH THE TEAM AT THE 0 SLOT SO FAR
*/

/*
DATA
*/
//pokemon is an array of up to 6 pokemon
Team = function (pokes){
    this.pokes = pokes || [new Pokemon(), new Pokemon(), new Pokemon(), new Pokemon(), new Pokemon(), new Pokemon()];
};

Team.prototype.poke = function(i)
{
    return this.pokes[i];
};

//All of the information is stored as numbers
Pokemon = function (params){
    for (var x in params) {
        this[x] = params[x];
    }
    this.ivs = this.ivs||new IVs();
    this.evs = this.evs||new EVs();
    this.level = this.level || 1;
    this.moves = this.moves||[0,0,0,0];
};

Pokemon.prototype.isValid = function()
{
    return (this.num || 0) != 0;
};

/*
 syncMovesToUser will sync the given moves to the given pokemon slot of the given user id
 */
function syncMovesToUser(id,slot,movesArray){
    for(var i=0;i<4;i++){
        sys.changePokeMove(id,0,slot,i,movesArray[i]);
    }
}

/*
 syncToUser will sync the given pokemon to the given user at the given slot
 */
Pokemon.prototype.syncToUser=function(id,slot){
    sys.changePokeNum(id,0,slot,this.num);
    sys.changePokeName(id,0,slot,this.nick);
    sys.changePokeGender(id,0,slot,this.gender);
    sys.changePokeAbility(id,0,slot,this.ability);
    sys.changePokeItem(id,0,slot,this.item);
    sys.changePokeLevel(id,0,slot,this.level);
    this.ivs.syncToUser(id,slot);
    this.evs.syncToUser(id,slot);
    syncMovesToUser(id,slot,this.moves);
    sys.changePokeNature(id,0,slot,this.nature);
    sys.changePokeShine(id,0,slot,this.shiny);
    sys.changePokeHappiness(id,0,slot,this.happiness);
    if ("hp" in this) {sys.changePokeHp(id,0,slot,this.hp);}
    if ("status" in this) {sys.changePokeStatus(id,0,slot,this.status);}
};

Pokemon.prototype.toString = function() {
    var str = [];
    var name = sys.pokemon(this.num);
    var gender = this.gender === 0 ? "" : (this.gender===1?"(M)":"(F)");
    if (name === this.nick) {
        str.push(name + " " + gender + " lv. " + this.level + " @ " + sys.item(this.item) + (this.shiny? " [Shiny]" : ""));
    } else {
        str.push(this.nick + " ("+ name + ") " + gender + " lv. " + this.level + " @ " + sys.item(this.item) + (this.shiny? " [Shiny]" : ""));
    }

    str.push("Trait: " + sys.ability(this.ability));
    str.push(this.evs.toString());
    str.push(this.ivs.toString());
    str.push(sys.nature(this.nature)+ " nature, " + this.happiness + " happiness");
    for (var i =0; i < this.moves.length; i++) {
        str.push("- " + sys.move(this.moves[i]));
    }

    return str.clean("").join("\n");
};

/*
FUNCTIONS
*/

/*
This function takes in teamData
At the end of this function, the user's team at the 0 slot number will be set to the given teamData
*/
User.prototype.setTeam = function(team){
    team.syncToUser(this.id);
};


/*
This function will return the Team equivalent of the given 0 team slot of a user
*/
User.prototype.getTeam = function (){
    var pokes=[];
    for(var i=0;i<6;i++){
        pokes.push(makePokemon(this.id,i));
    }
    return new Team(pokes);
};


/*
This Function will output the pokemon equivalent for the given user's 0th team at the given slot
*/
function makePokemon(id,slot){
    if (slot === 0) sys.sendAll("HP: " + sys.teamPokeHp(id, 0, slot));
    return new Pokemon( {
        "num":sys.teamPoke(id,0,slot),
        "hp":sys.teamPokeHp(id, 0, slot),
        "status":sys.teamPokeStatus(id, 0, slot),
        "nick":sys.teamPokeName(id,0,slot),
        "gender":sys.teamPokeGender(id,0,slot),
        "ability":sys.teamPokeAbility(id,0,slot),
        "item":sys.teamPokeItem(id,0,slot),
        "level":sys.teamPokeLevel(id,0,slot),
        "ivs":makeIVs(id,slot),
        "evs":makeEVs(id,slot),
        "moves":makeMovesArray(id,slot),
        "nature":sys.teamPokeNature(id,0,slot),
        "shiny":sys.teamPokeShine(id,0,slot),
        "happiness":sys.teamPokeHappiness(id,0,slot)
    });
}

/*
This function will output the IVs representative of a given user's 0th team pokemon at the given slot
*/
function makeIVs(id,slot){
    return new IVs(
            sys.teamPokeDV(id,0,slot,0),
            sys.teamPokeDV(id,0,slot,1),
            sys.teamPokeDV(id,0,slot,2),
            sys.teamPokeDV(id,0,slot,3),
            sys.teamPokeDV(id,0,slot,4),
            sys.teamPokeDV(id,0,slot,5)
            );
}

/*
This function will output the EVs representative of a given user's 0th team pokemon at the given slot
*/
function makeEVs(id,slot){
    return new EVs(
            sys.teamPokeEV(id,0,slot,0),
            sys.teamPokeEV(id,0,slot,1),
            sys.teamPokeEV(id,0,slot,2),
            sys.teamPokeEV(id,0,slot,3),
            sys.teamPokeEV(id,0,slot,4),
            sys.teamPokeEV(id,0,slot,5)
            );
}


/*
This function will output the moves Array representative of a given user's 0th team pokemon at the given slot
*/
function makeMovesArray(id,slot){
    var moves=[];
    for(var j=0;j<4;j++){
        moves.push(sys.teamPokeMove(id,0,slot,j));
    }
    return moves;
}

/*
syncToUser will sync the given team to the given user id
*/
Team.prototype.syncToUser=function(id){
    for(var i=0;i<6;i++){
        this.pokes[i].syncToUser(id,i);
    }
};

//EVs are numbers between 0 and 31
EVs = function(hp,att,def,spAtt,spDef,speed){
    this.hp=hp;
    this.att=att;
    this.def=def;
    this.spAtt=spAtt;
    this.spDef=spDef;
    this.speed=speed;
};

/*
syncToUser will sync the given EVs to the given pokemon slot of the given user id
*/
EVs.prototype.syncToUser=function(id,slot){
    var i=0;
    for(var stat in this){
        sys.changeTeamPokeEV(id,0,slot,i,this[stat]);
        i++;
    }
};

EVs.prototype.toString = function() {
    /* No EVs */
    if (this.hp + this.att + this.def + this.spAtt + this.spDef + this.speed === 0) {
        return "";
    }
    var array = [];
    if (this.hp) array.push(this.hp + " HP");
    if (this.att) array.push(this.hp + " Atk");
    if (this.def) array.push(this.hp + " Def");
    if (this.spAtt) array.push(this.hp + " SAtk");
    if (this.spDef) array.push(this.hp + " SDef");
    if (this.speed) array.push(this.hp + " Spd");

    return "EVs: " + array.join(" / ");
};

//IVs are numbers between 0 and 31
IVs = function(hp,att,def,spAtt,spDef,speed){
    this.hp=hp;
    this.att=att;
    this.def=def;
    this.spAtt=spAtt;
    this.spDef=spDef;
    this.speed=speed;
};

/*
syncToUser will sync the given EVs to the given pokemon slot of the given user id
*/
IVs.prototype.syncToUser=function(id,slot){
    var i=0;
    for(var stat in this){
        sys.changeTeamPokeDV(id,0,slot,i,this[stat]);
        i++;
    }
};

IVs.prototype.toString = function() {
    /* Max IVs */
    if (this.hp + this.att + this.def + this.spAtt + this.spDef + this.speed === 6*31) {
        return "";
    }
    return "IVs: " + this.hp + " HP / " + this.att + " Atk / " + this.def + " Def / " + this.spAtt + " SAtk / " + this.spDef + " SDef / " + this.speed + " Spd";
};

