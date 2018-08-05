var CryptoJS = require('./public/crypto-js.js');

module.exports = function() {
	
	this.getRoundedMinutes = function (){
		var h = (new Date().getMinutes());
		if(h<10) return  0;
		if(h>=10 && h<20) return 10;
		if(h>=20 && h<30) return 20;
		if(h>=30 && h<40) return 30;
		if(h>=40 && h<50) return 40;
		if(h>=50 && h<60) return 50;
	}
	
	this.getRandom = function (count){
		var d = new Date();
		var d1 = d.getDate();
		var h = d.getHours();
		d1 = d1 * 3;
		h = h * 2;
		var n = this.getRoundedMinutes();
		var random = d1 + h + n + count;
		return random;
	}
	
	this.getSecret = function (){
		return "Secret" + this.getRoundedMinutes();
	}
	
	this.getHashFromRandom = function (count){
		var hash = CryptoJS.SHA3(this.getRandom(count).toString());
		return hash;
	}
}
