var figcaption = null;

function crearCajaComentario() {
    'use strict';
    var contenedorComentarios = document.createElement("div"),
        comentarios = [["Pepe", "¡Buen producto!"], ["Paco", "Cool"], ["Pepa", "Buena calidad"], ["Mario", "Me encanta"], ["Cuqui", "I love it <3"]],
        botonCerrar = $("<input />").attr({type: "button", value: "Cerrar", onclick: "borrar()"});
    
    figcaption = document.createElement("figcaption"); //$("<figcaption></figcaption>").attr({class: "caja_comentarios"}).get()[0];
    
    figcaption.setAttribute("class", "comentarios");
    
    comentarios.forEach(function (c) {
        var parrafoComentario = document.createElement("p");
        parrafoComentario.innerHTML = c[0].concat(": ", c[1]);
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

Array.prototype.randomElement = function () {
    'use strict';
    return this[Math.floor(Math.random() * this.length)];
};

