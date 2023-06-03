let currentChatArea = "chatArea1";
// Variable donde agignaremos a cada amigo
let conversations = {};
let maxChats = 5;
let chatCount = 1;

// Función para añadir a un amigo
function addFriend() {
    let http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    let friend = document.getElementById("friend").value;

    http.open("POST", "http://localhost:3000/XatLLM/Friend", true);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send("mail="+mail+"&session="+session+"&friend="+friend);

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            let res = http.responseText;
            // Los diferentes resultados posibles
            if(res == 0) {
                console.log("Error en el servidor");
            } else if(res == 1) {
                console.log("Amigo añadido");
                getFriends();
            } else if(res == 2) {
                console.log("Amigos no encontrados");
            } else if (res == 3){
                console.log("Reinicia la sesion");
            }
        }
    };
}
//  Función para la lista de amigos
function getFriends() {
    let http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3000/XatLLM/Friend?mail=" + mail + "&session=" + session);
    http.send();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let jsonAmigos = JSON.parse(http.responseText);

            let select = document.getElementById("selectFriend");
            select.innerHTML = "";

            for (let i = 0; i < jsonAmigos.length; i++) {
                let option = document.createElement("option");

                option.text = jsonAmigos[i];
                option.value = jsonAmigos[i];
                select.add(option);
                // Si alguno de los amigos no tiene una conversacion asignada, le asignamos una
                if(!(jsonAmigos[i] in conversations) && chatCount <= maxChats) {
                    conversations[jsonAmigos[i]] = "chatArea" + chatCount++;
                }
            }
        }
    }
}
// Función para enviar mensajes
function sendMessage() {
    let http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    let receptor = document.getElementById("selectFriend").value;
    let sms = document.getElementById("message").value;

    http.open("POST", "http://localhost:3000/XatLLM/Xat", true);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send("mail="+mail+"&session="+session+"&receptor="+receptor+"&sms="+sms);

    let chatArea = document.getElementById(conversations[receptor]);
    let messageElement = document.createElement("p");
    messageElement.className = "sentMessage";
    messageElement.innerText = "Yo: " + sms;
    chatArea.appendChild(messageElement);
    document.getElementById("message").value = "";
}

// Función para recibir mensajes
function receiveMessage() {
    let http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3000/XatLLM/Xat?mail=" + mail + "&session=" + session);
    http.send();

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            let message = JSON.parse(http.responseText);
            let chatArea = document.getElementById(conversations[message.emisor]);
            let messageElement = document.createElement("p");
            messageElement.className = "receivedMessage";
            messageElement.innerText = message.emisor + ": " + message.text;
            chatArea.appendChild(messageElement);
            receiveMessage();
        }
    }
}
// Función para manejar el cambio de area de chat
function selectFriend() {
    let friend = document.getElementById("selectFriend").value;
    if(friend in conversations) {
        document.getElementById(currentChatArea).style.display = "none";
        currentChatArea = conversations[friend];
        document.getElementById(currentChatArea).style.display = "block";
    }
}

// Función para logOut
function logoutUser() {
    // Borramos los elementos del sessionStorage
    sessionStorage.removeItem('mail');
    sessionStorage.removeItem('session');

    window.location.href = './login.html'; 
}

// Para manejar los eventos cuando cargamos la página
window.onload = function() {
    getFriends();
    receiveMessage();
    document.getElementById("selectFriend").onchange = selectFriend;
    document.getElementById("addFriendButton").onclick = addFriend;
    document.getElementById("sendMessageButton").onclick = sendMessage;
    document.getElementById("logout").onclick = logoutUser;
}
