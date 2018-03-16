var urlComentarios = "http://localhost:3000/comentarios";

function appendComments(figure) {
    
    $.ajax({
        url: urlComentarios,
        type: "GET",
        dataType: "json"
    }).then(
        function(comentarios) {
            figure.append(crearCajaComentarios(comentarios));
            eventoComentar();
            eventoSalirComentarios();
        },
        function(xhr) {
            alert("Se ha producido un error: ".concat(xhr.status, " ", xhr.statusText));
        }
    );
    
}

function crearCajaComentarios(comentarios) {
    
    var contenedorComentarios = $("<div></div>").attr({"class": "contenedor_comentarios"}),
        botonCerrar = $("<input />").attr({"type": "button", "value": "Cerrar", "onclick": "borrar()"}),
        cincoComentarios = comentarios.slice(comentarios.length - 5, comentarios.length),
        parrafoComentario = null,  // ["Hola", "Hole", "Holi", "Holo", "Holu"];
        figcaption = $("<figcaption></figcaption>").attr({"class": "caja_comentarios"});
    
    cincoComentarios.forEach(function(object) {
        parrafoComentario = $("<p></p>").text(object.usuario.concat(": ", object.comentario)); 
        contenedorComentarios.append(parrafoComentario);
    });
    
    figcaption.append(contenedorComentarios);
    
    if (getCookie("user")) {
        var formComentarios = $("<form></form>").attr({"id": "form_comentarios"}),
            textarea = $("<textarea></textarea>").attr({"cols": "20", "rows": "1"}),
            submit = $("<input />").attr({"type": "submit", "value": "Comentar", "class": "enviar_comentario"});

        formComentarios.append(textarea, submit);
        figcaption.append(formComentarios);
    }
    
    figcaption.append(botonCerrar);
    
    return figcaption;
    
}

function borrar() {
    $(".caja_comentarios").remove();
}

$(".boton").click(function(event) {
    appendComments($(this).parents("figure"));
});

function eventoSalirComentarios() {
    $(".caja_comentarios").on("mouseout", function(event) {
        $(event).stopPropagation();
        borrar();
    });
}

function eventoComentar() {
    
    $(".enviar_comentario").on("click", function(event){

        event.preventDefault();
        
        var figure = $(this).parents("figure");
        
        $.ajax({
            url: urlComentarios,
            type: "POST",
            data: {"usuario": getCookie("user"), "comentario": $(this).siblings("textarea").val()},
            dataType: "json"
        }).then(
            function() {
                borrar();
                appendComments(figure);
            },
            function() {
                alert("Ha ocurrido un error. Tu mensaje no se ha guardado. ".concat(xhr.status, " ", xhr.statusText));
            }
        );

        // Con XMLHttpRequest

        /*var xhr = new XMLHttpRequest();

        xhr.open("post", "http://localhost:3000/comentarios/", true);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) {
                    alert("Los datos se han introducido."); //crearCajaComentario();
                    $(this).parents("figcaption").remove();
                    getComments();
                } else {
                    alert("Ha ocurrido un error. Tu mensaje no se ha guardado. ".concat(xhr.status, " ", xhr.statusText));
                }
            }
        }

        xhr.send(JSON.stringify({"usuario": getCookie("user"), "comentario": $(this).siblings("textarea").val()}));*/
            
    });
}

/*Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}*/

