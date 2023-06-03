function enviar() {
    var http = new XMLHttpRequest();
// Aqui pondremos donde queremos que se vaya enviando la informacion 
// (ordenador localhost,port 3000,projecta tomcat,clase Login, true es que me deixa fer coses una vegada enviat, 
// no necesit esperar a que me contesti)

    let mail = document.getElementById("mail").value
    let pass = document.getElementById("pass").value
    http.open("GET", "http://localhost:3000/XatLLM/Login?mail="+mail+"&pass="+pass,true);
    // peticio des atributs segons es tipus arxiu

    // enviam
    http.send();

    http.onreadystatechange = function() {
        console.log("ready state:" + this.readyState)
        console.log("ready state:" + this.status)
        if(this.readyState==4 && this.status==200) {   // es numero 4 es es darrer pas de verificacio i 200 es que ha anat tot be
            let session = this.responseText;
            if (session != "0") {
                window.sessionStorage.setItem("mail",mail);
                window.sessionStorage.setItem("session",session);
                console.log("Estoy en el login")
                document.getElementById("resultat").innerHTML="Loggin Correcta";
                window.location.href = 'chat.html';
            } else {
                document.getElementById("resultat").innerHTML="Loggin Incorrecta";
            }

        }
    }
}