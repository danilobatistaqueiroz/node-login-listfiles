function decriptar(){
  let total = document.getElementById("total").value;
  let i;
  var crypto = new Crypto(CryptoJS, "segredo123", "segredo123");
  for(i = 0; i < total; i++) {
    try{
      let description = document.getElementById("encText"+i).value;
      let plaintext = crypto.decryptByDESModeCBC(description, "segredo123");
      if(plaintext!='')
        document.getElementById("description"+i).innerHTML = plaintext;
    } catch (e) {
      console.log(e);
    }
  }
}