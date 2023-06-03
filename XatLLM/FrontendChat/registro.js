function registerUser(user, pass, mail, codeCountry) {
    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/XatLLM/Register';
    
    var params =
        'user=' +
        encodeURIComponent(user) +
        '&pass=' +
        encodeURIComponent(pass) +
        '&mail=' +
        encodeURIComponent(mail) +
        '&codeCountry=' +
        encodeURIComponent(codeCountry);
    
    http.open('POST', url, true);
    
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
        var response = http.responseText;
        console.log('Registration response:', response);
        if (response == 'true') {
            // Si la respuesta es verdadera, redirigir al usuario a la página de inicio de sesión
            window.location.href = './login.html';
        } else {
            alert('Error en el registro.');
        }
        }
    };
    
    http.send(params);
    }
    
    // Obtener lista de países
    function getCountries(callback) {
    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/XatLLM/Register';
    
    http.open('GET', url, true);
    
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
        var data = JSON.parse(http.responseText);
        console.log('Country list:', data);
    
        var countrySelect = document.getElementById('codeCountry');
        data.forEach(function (country) {
            var option = document.createElement('option');
            option.value = country.code;
            option.text = country.name;
            countrySelect.appendChild(option);
        });
    
        // Llamar al callback después de cargar la lista de países
        if (typeof callback === 'function') {
            callback();
        }
        }
    };
    
    http.send();
    }
    
    function init() {
    // Llamada a getCountries con registerUser como callback
    getCountries(function () {
        // Llamada a registerUser cuando el usuario presiona el botón
        var btnRegister = document.getElementById('submit');
        btnRegister.addEventListener('click', function (e) {
        e.preventDefault();
        var user = document.getElementById('user').value;
        var pass = document.getElementById('pass').value;
        var mail = document.getElementById('mail').value;
        var codeCountry = document.getElementById('codeCountry').value;
    
        registerUser(user, pass, mail, codeCountry);
        });
    });
    }
    
    // Llamar a init para iniciar el proceso
    init();