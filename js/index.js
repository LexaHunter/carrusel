window.addEventListener("load", function(event) {
    
    var logged = getCookie("user"),
        topRightButton = document.getElementById("top_right_button"),
        topLeftButton = document.getElementById("top_left_button")
        linkRightButton = document.createElement("a"),
        linkLeftButton = document.createElement("a");
    
    if (logged) {
        //linkRightButton.setAttribute("id", "logout");
        linkLeftButton.setAttribute("href", "");
        linkLeftButton.innerHTML = "\ud83d\udc64\t".concat(logged);
        linkRightButton.setAttribute("onclick", "deleteCookie('user')");
        linkRightButton.setAttribute("href", "");
        linkRightButton.innerHTML = "Cerrar Sesión";
    } else {
        linkLeftButton.setAttribute("href", "html/newsletter.html");
        linkLeftButton.innerHTML = "Suscríbete a nuestra Newsletter";
        linkRightButton.setAttribute("href", "html/login_signup.html");
        linkRightButton.innerHTML = "Regístrate / Inicia Sesión";
    }
    
    topRightButton.appendChild(linkRightButton);
    topLeftButton.appendChild(linkLeftButton);
        
});

$(".boton").click(function(event) {
    //var boton = event.target;
    $(event.target).parent().parent().parent().append(crearCajaComentario());
});

/*document.getElementById("foto_1").addEventListener("click", function(event) {
    var figura = document.getElementById("figure_1");
    figura.appendChild(crearCajaComentario());
});*/

document.getElementById("foto_2").addEventListener("click", function(event) {
    
});

document.getElementById("foto_3").addEventListener("click", function(event) {
    
});

function crearCajaComentario() {
    var figcaption = document.createElement("figcaption"),
        contenedorComentarios = document.createElement("div"),
        comentarios = [["Pepe", "Buen preducto!"], ["Paco", "Cool"], ["Pepa", "Buena calidad"], ["Mario", "Me encanta"], ["Cuqui", "I love it <3"]];
    
    figcaption.setAttribute("class", "comentarios");
    comentarios.forEach(function(c){
        var parrafoComentario = document.createElement("p");
        parrafoComentario.innerHTML = c[0].concat(" => ", c[1]);
        contenedorComentarios.appendChild(parrafoComentario);
    });
    figcaption.appendChild(contenedorComentarios);
    if(getCookie("user")){
        var formComentarios = document.createElement("form"),
            textarea = document.createElement("textarea"),
            submit =  document.createElement("submit");

        submit.setAttribute("value", "Comentar");
        formComentarios.appendChild("textarea");
        formComentarios.appendChild("submit");
        figcaption.appendChild(formComentarios);
    }
    return figcaption;
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

