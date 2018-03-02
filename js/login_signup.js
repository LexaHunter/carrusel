// Objetos de DOM

var formLogin = document.forms["form_login"],
    formSignup = document.forms["form_signup"],
    password = formSignup.elements["password"],
    password_conf = formSignup.elements["password_conf"],
    direccion = formSignup.elements["direccion"],
    selectPaises = formSignup.elements["pais"],
    contenedorTarjeta = document.getElementById("contenedor_tarjeta"),
    numTarjeta = null,
    marcaTarjeta = null;


// Al cargar el documento:

window.addEventListener("load", function(event) {
    
    /* 
    Arrancando en json-server el fichero json/paises.json ene l puerto 3002 mediante el comando: 
    
    json-server -p 3002 --watch paises.json
    */
    
    /*$.getJSON("http://localhost:3002/paises", function(data, status) {
        if (status == "success") {
            $.each(data, function(i, pais) {
                option = $("<option></option>").text(pais.nombre).attr("value", pais.nombre);
                $(selectPaises).append(option);
            });
            $("[value=España]").attr("selected", "selected");
        }
    });*/
    
    var url = "http://localhost:3002/paises",
        open = null,
        promesa = new Promise(function(resolve, reject) {
        
            // Con el objeto XMLHtpRequest
            
            // 1º) Instanciación del objeto XMLHttpRequest = representa la petición.
            let xhr = new XMLHttpRequest();

            // 2º) Configuración de la petición - Se realiza mediante el método .open()
            xhr.open("get", url, true);
                // Si se va a recibir un archivo JSON, se establece con la propiedad .responseType
            xhr.responseType = "json";

            // 3º) Configuración de la respuesta del objeto XMLHttpRequest = se define mediante las propiedades onreadystatechange u onload
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) { // Cuando la petición se haya completado. => Puede adoptar 5 valores: 0 (unsent), 1 (opened), 2 (headers_received), 3 (loading) y 4 (done).
                    if (xhr.status == 200) { // Estado de la petición representado mediante el código del protocolo HTTP - El código 200 indica que la petición ha tenido éxito.
                        resolve(xhr.response); // !!! La propiedad response es la que contiene el cuerpo de la respuesta = los datos que nos interesan, que tendrán el formato que hayamos determinado en la propiedad responseType * !!! Cuando lo que se espera son datos en XML o HTML, hay que recuperarlos de la propoiedad responseXML -> la propiedad responseType NO tiene valores "xml" o "html".
                    } else {
                        reject({codigoError: xhr.status, textoError: xhr.statusText}); // Sólo se le pasa UN parámetro, más uno y sólo usará el primero.
                    }
                } 
            }
            
            // 4º) Envío de la petición.
            xhr.send();
            
            
            // Con jQuery
            /*$.getJSON("http://localhost:3000/paises", function(data, status) {
                if (status == "success") {
                    resolve(data);
                } else {
                    reject(status);
                }
            });*/
            
        });
    
    promesa.then(
        function(paises) { // == Esta es la función resolve
            paises.forEach(function(pais) {
                /*open = document.createElement("option");
                open.setAttribute("value", pais.nombre);
                open.innerHTML = pais.nombre;
                selectPaises.appendChild(open);
                console.log(pais.nombre);*/
                option = $("<option></option>").text(pais.nombre).attr("value", pais.nombre);
                $(selectPaises).append(option);
            });
            $("[value=España]").attr("selected", "selected");
        }, 
        function(fallo) { // == Esta es la función reject
            alert("Ha ocurrido un error: ".concat(fallo.codigoError, " ", fallo.textoError));
        }
    );
    
});

// Menú de Pestañas

function mostrar(event, formId) {
    
    var tabContent, tabLinks;
    
    tabContent = document.getElementsByClassName("tab_content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(formId).style.display = "block";
    event.currentTarget.className += " active";
    
}

// Validaciones de Formulario

password.addEventListener("input", function(event) {
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}/.test(password.value)) {
        password.setCustomValidity("La contraseña no tiene el formato correcto.");
    } else {
        password.setCustomValidity("");
    }
});

password_conf.addEventListener("input", function(event) {
    if (password.value != password_conf.value) {
        password_conf.setCustomValidity("Las contraseñas no coinciden.");
    } else {
        password_conf.setCustomValidity("");
    }
});

direccion.addEventListener("keyup", function(event) {
    if (direccion.value != "") {
        if (contenedorTarjeta.childElementCount == 0) {
            crearControlesTarjeta();
        }
    } else {
        $(contenedorTarjeta).empty(); //.children().remove();
    }
});

formLogin.addEventListener("submit", function(event) {
    
    var nombreUsuario = formLogin.elements["nombre"].value.trim(),
        password = formLogin.elements["password"].value,
        logged = false;
    
    if (getCookie(nombreUsuario) == sha256(password)) {
        logged = true;
        setCookie("user", nombreUsuario, "/");
        alert("¡Bienvenido/a ".concat(nombreUsuario, "!"));
    } else {
        alert("El usuario y/o la contraseña no son correctos");
    }
    
    if (!logged) {
        this.reset();
        event.preventDefault();
    }
    
    return logged;
    
});

formSignup.addEventListener("submit", function(event) {
    
    var nombreUsuario = formSignup.elements["nombre"].value;
    
    setCookie(nombreUsuario, sha256(password.value), "/", 365);
    
    setCookie("user", nombreUsuario, "/");
    
});

function crearControlesTarjeta() {
    
    var radio = [];
    
    numTarjeta = $("<input />").attr({type: "text", id: "num_tarjeta", name: "num_tarjeta", placeholder: "Número de Tajeta de Crédito"}).get()[0];
    
    $(contenedorTarjeta).append($("<div></div>").append(numTarjeta));
    
    $.each(["visa", "mastercard", "americanexpress"], function(index, tipoTarjeta) {
        radio.push($("<label></label>").attr("for", tipoTarjeta).text(tipoTarjeta.capitalize()), $("<input />").attr({type: "radio", class: "radio", id: tipoTarjeta, name: "marca_tarjeta"}));
    });
    
    $(contenedorTarjeta).append($("<div></div>").append(radio));
    
    $("[type=radio]").css("margin", "5px");
    
    $("#visa").attr("checked", "checked");
    
    marcaTarjeta = $("[name=marca_tarjeta]");
    
    establecerValidacionTarjeta();
    
}

function establecerValidacionTarjeta() {
    
    numTarjeta.addEventListener("input", function(event) {
        if (marcaTarjeta[0].checked) {
            validarTarjeta(/^4[0-9]{12}(?:[0-9]{3})?$/);
        } else if (marcaTarjeta[1].checked) {
            validarTarjeta(/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/);
        } else if (marcaTarjeta[2].checked) {
            validarTarjeta(/^3[47][0-9]{13}$/);
        }
    });
    
}

function validarTarjeta(regexp) {
    if (!regexp.test(numTarjeta.value)) {
        numTarjeta.setCustomValidity("El número de tarjeta no es correcto.");
    } else {
        numTarjeta.setCustomValidity("");
    }
}

String.prototype.capitalize = function() {
    return this.replace(/\w+/g, function(w) {
        return w.replace(/^[a-z]/, function(l) {
            return l.toUpperCase();
        })
    });
}