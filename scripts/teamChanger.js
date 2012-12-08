/*
NOTE: ALL SYNCING WILL ONLY WORK WITH THE TEAM AT THE 0 SLOT SO FAR
*/

/*
DATA
*/
//pokemon is an array of up to 6 pokemon
var Team = function (pokes){
    this.pokes=pokes;
};

//All of the information is stored as numbers
Pokemon = function (num,nick,gender,ability,item,level,ivs,evs,moves,nature,shiny,happiness){
    this.num=num;
    this.nick=nick;
    this.gender=gender;
    this.ability=ability;
    this.item=item;
    this.level=level;
    this.ivs=ivs;
    this.evs=evs;
    this.moves=moves;
    this.nature=nature;
    this.shiny=shiny;
    this.happiness=happiness;
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
FUNCTIONS
*/

/*
This function takes in teamData
At the end of this function, the user's team at the 0 slot number will be set to the given teamData
*/
User.prototype.setTeam = function(team){
    team.syncToUser(this.id);
}


/*
This function will return the Team equivalent of the given 0 team slot of a user
*/
User.prototype.getTeam = function (){
    var pokes=[]
    for(var i=0;i<6;i++){
        pokes.push(makePokemon(this.id,i));
    }
    return new Team(pokes);
}


/*
This Function will output the pokemon equivilent for the given user's 0th team at the given slot
*/
function makePokemon(id,slot){
    return new Pokemon(
        sys.teamPoke(id,0,slot),
        sys.teamPokeName(id,0,slot),
        sys.teamPokeGender(id,0,slot),
        sys.teamPokeAbility(id,0,slot),
        sys.teamPokeItem(id,0,slot),
        sys.teamPokeLevel(id,0,slot),
        makeIVs(id,slot),
        makeEVs(id,slot),
        makeMovesArray(id,slot),
        sys.teamPokeNature(id,0,slot),
        sys.teamPokeShine(id,0,slot),
        sys.teamPokeHappiness(id,0,slot)
        );
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
}

/*
syncToUser will sync the given EVs to the given pokemon slot of the given user id
*/
EVs.prototype.syncToUser=function(id,slot){
    var i=0
    for(stat in this){
        sys.changeTeamPokeEV(id,0,slot,i,stat);
        i++;
    }
}

/*
syncToUser will sync the given EVs to the given pokemon slot of the given user id
*/
IVs.prototype.syncToUser=function(id,slot){
    var i=0;
    for(stat in this){
        sys.changeTeamPokeDV(id,0,slot,i,stat);
        i++;
    }
}

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
}



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
}

IVs.prototype.toString = function() {
    /* Max IVs */
    if (this.hp + this.att + this.def + this.spAtt + this.spDef + this.speed === 6*31) {
        return "";
    }
    return "IVs: " + this.hp + " HP / " + this.att + " Atk / " + this.def + " Def / " + this.spAtt + " SAtk / " + this.spDef + " SDef / " + this.speed + " Spd";
}

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
}
