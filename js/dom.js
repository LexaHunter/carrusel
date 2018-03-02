var figcaption = null,
    comentarios;

const urlComentarios = "http://localhost:3000/comentarios";

$.ajax({
    url: urlComentarios,
    type: "GET",
    dataType: "json"
}).then(
    function(datos) {
        comentarios = datos;
    },
    function(xhr) {
        alert("Se ha producido un error: ".concat(xhr.status, " ", xhr.statusText));
    }
);

function crearCajaComentario() {
    'use strict';
    var contenedorComentarios = document.createElement("div"),
        botonCerrar = $("<input />").attr({type: "button", value: "Cerrar", onclick: "borrar()"}),
        cincoComentarios = comentarios.shuffle().slice(4);
    
    figcaption = document.createElement("figcaption"); //$("<figcaption></figcaption>").attr({class: "caja_comentarios"}).get()[0];
    
    figcaption.setAttribute("class", "comentarios");
    
    cincoComentarios.forEach(function (object) {
        var parrafoComentario = document.createElement("p");
        parrafoComentario.innerHTML = object.usuario.concat(": ", object.comentario);
        contenedorComentarios.appendChild(parrafoComentario);
    });
    
    figcaption.appendChild(contenedorComentarios);
    
    if (getCookie("user")) {
        var formComentarios = document.createElement("form"),
            textarea = $("<textarea></textarea>").attr({cols: "20", rows: "1"}).get()[0], //document.createElement("textarea"), //$("<textarea></textarea>").attr({cols: "20", rows: "5"}).get()[0],
            submit = $("<input />").attr({type: "submit", value: "Comentar", class: "boton"}).get()[0];//document.createElement("submit");
            

        $(formComentarios).append(textarea, submit);
        figcaption.appendChild(formComentarios);
    }
    
    $(figcaption).append(botonCerrar);
    
    return figcaption;
    
}

function borrar() {
    'use strict';
    $(figcaption).remove();
}

$(".boton").click(function (event) {
    'use strict';
    $(event.target).parent().parent().parent().append(crearCajaComentario());
});

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}

