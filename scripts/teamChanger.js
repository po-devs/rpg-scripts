/*
DATA
*/
//pokemon is an array of up to 6 pokemon
var Team = function (pokes){
	this.pokes=pokemon;
};

//All of the information is stored as numbers
var Pokemon = function (num,nick,gender,ability,item,level,ivs,evs,moves,nature){
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
This function takes in a team slot number and teamData
At the end of this function, the user's team at the given slot number will be set to the given teamData
*/
User.prototype.setTeam = function(team){
	team.syncToUser(this.id)
}


/*
This function will return the team array equivilent of the given team slot number of a user
*/
User.prototype.getTeam = function (slot){}


Team.prototype.syncToUser=function(id){
	for(var i=0;i<6;i++){
		this.pokes[i].syncToUser(id,i);
	}
}



Pokemon.prototype.syncToUser=function(id,slot){}