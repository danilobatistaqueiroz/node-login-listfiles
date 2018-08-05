class Crypto {
	
	constructor( CryptoJS, secretAES, secretDES){
		this.CryptoJS = CryptoJS;
		this.secretAES = secretAES;
		this.secretDES = secretDES;
	}
	
	decrypt(identities) {
		var bytes = this.CryptoJS.AES.decrypt(identities.password, this.secretAES);
		var plaintext = bytes.toString(this.CryptoJS.enc.Utf8);
		identities.password = plaintext;
		plaintext = this.decryptByDESModeCBC(identities.username, this.secretDES);
		identities.username = plaintext;
	}
	
	encrypt(identities) {
		var pass = document.getElementById('password').value;
		pass = this.CryptoJS.AES.encrypt(pass, this.secretAES);
		identities.password = pass;
		
		var usr = document.getElementById('username').value;
		var ciphertext = this.encryptByDESModeCBC(usr, this.secretDES);
		identities.username = ciphertext;
		
		var token = document.getElementById('token').value;
		identities.token = document.getElementById('token').value;
	}

	encryptByDESModeCBC(message, key) {
		var keyHex = this.CryptoJS.enc.Utf8.parse(key);
		var encrypted = this.CryptoJS.TripleDES.encrypt(message, keyHex, {
			mode: this.CryptoJS.mode.ECB,
			padding: this.CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();

	}

	decryptByDESModeCBC(ciphertext, key) {
		var keyHex = this.CryptoJS.enc.Utf8.parse(key);
		var decrypted = this.CryptoJS.TripleDES.decrypt({
			ciphertext: this.CryptoJS.enc.Base64.parse(ciphertext)
		}, keyHex, {
			mode: this.CryptoJS.mode.ECB,
			padding: this.CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(this.CryptoJS.enc.Utf8);
	}
	
}

exports.Crypto = Crypto;