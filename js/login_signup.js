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
    Arrancando en json-server el fichero json/paises.json mediante el comando: 
            json-server --watch paises.json
    */
    
    $.getJSON("http://localhost:3000/paises", function(data, status) {
        if (status == "success") {
            $.each(data, function(i, pais) {
                option = $("<option></option>").text(pais.nombre).attr("value", pais.nombre);
                $(selectPaises).append(option);
            });
            $("[value=España]").attr("selected", "selected");
        }
    });
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