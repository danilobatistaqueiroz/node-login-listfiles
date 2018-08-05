
var logar = document.getElementById('logar')

function Secrets() {
	
	this.getRoundedMinutes = function (){
		var h = (new Date().getMinutes());
		if(h<10) return  0;
		if(h>=10 && h<20) return 10;
		if(h>=20 && h<30) return 20;
		if(h>=30 && h<40) return 30;
		if(h>=40 && h<50) return 40;
		if(h>=50 && h<60) return 50;
	}
	
	this.getSecret = function (){
		return "Secret" + this.getRoundedMinutes();
	}
}


logar.addEventListener('click', function () {
	var identities = { username: '', password: '', token: '' };
	identities.username = document.getElementById('username').value;
	identities.password = document.getElementById('password').value;
	identities.token = document.getElementById('token').value;
	var s = new Secrets();
	var crypto = new Crypto(CryptoJS, s.getSecret(), s.getSecret());
	crypto.encrypt(identities);
	document.getElementById('username').value = identities.username;
	document.getElementById('password').value = identities.password;
	document.getElementById('token').value = identities.token;
	document.getElementById('enviar').submit();
})