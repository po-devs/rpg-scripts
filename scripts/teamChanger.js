/*
NOTE: ALL SYNCING WILL ONLY WORK WITH THE TEAM AT THE 0 SLOT SO FAR
*/

/*
DATA
*/
//pokemon is an array of up to 6 pokemon
var Team = function (pokes){
	this.pokes=pokemon;
};

//All of the information is stored as numbers
var Pokemon = function (num,nick,gender,ability,item,level,ivs,evs,moves,nature,shiny,happy){
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
	this.happiness=happy;
};

//IVs are numbers between 0 and 31
var IVs = function(hp,att,def,spAtt,spDef,speed){
	this.hp=hp;
	this.att=att;
	this.def=def;
	this.spAtt=spAtt;
	this.spDef=spDef;
	this.speed=speed;
};

//EVs are numbers between 0 and 31
var EVs = function(hp,att,def,spAtt,spDef,speed){
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
User.prototype.getTeam = function (){}

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
	sys.changePokeLevel(id,0,slot,this.level);
	sys.changePokeNum(id,0,slot,this.num);
	sys.changePokeGender(id,0,slot,this.gender);
	sys.changePokeName(id,0,slot,this.nick);
	sys.changePokeItem(id,0,slot,this.item);
	sys.changePokeNature(id,0,slot,this.nature);
	this.ivs.syncToUser(id,slot);
	this.evs.synchToUser(id,slot);
	sys.changePokeAbility(id,0,slot,this.ability);
	sys.changePokeShine(id,0,slot,this.shiny);
	sys.changePokeHappiness(id,0,slot,this.happiness);
	syncMovesToUser(id,slot,this.moves)
}