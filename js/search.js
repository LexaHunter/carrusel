
let searchForm = $("#search"),
    search = $("#search_input");

const urlBase = "http://localhost:3000/items"; // !!! Mirar filtrado desde URL.

search.on("keyup", function(event) {
    
    let nombreItem = this.value,
        //regexp = new RegExp("^".concat(nombreItem), "i");
        url = urlBase.concat("?item_like=^", nombreItem);
        
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json"
        // En la función definida en el atributo dataFilter recibo los datos como una cadena y los tengo que devolver también como una cadena = tal y como los devuelve el servidor = el servidor siempre devuelve los datos como cadena, para sean tratados correctamente por al función que los va a tratar definida en el atributo success.
        // JSON.parse(strins) = transforma una cedena en un objeto JavaScript.
        // JSON.stringify(JS Object) = transforma un objeto JavaScript en una cadena.
        /*dataFilter: function(datos) { 
            return JSON.stringify(JSON.parse(datos).filter(function(item) {
                return regexp.test(item.item);
            }));
        },
        success: function(items) { // No hace falta definir los atributos success ni error si se va a emplear el método .then() u otro método del objeto jqXHR que implementa las funcionalidades de los objetos de tipo Promise.
            conslo.log(items);
        },
        error: function(xhr, status) {
            console.log(xhr.statusText);
        }*/
    }).then( /* !!!!! El método $.ajax() devuelve un objeto de tipo jqXHR, que implementa la interfaz de Promise, por lo que tiene todos los métodos de un objeto de tipo promesa, entre ellos .then() => Si uso el método .then() pasándole 2 funciones = resolve y reject, [por lo que he visto] no hay que definir las porpiedades success y error ene l método $.ajax() = [por lo que veo] asume directemente como acciones las funciones definidasn en el métddo .then() */
        function(items) { // onFulfilled = resolve
            if ($("#items_div")) {
                $("#items_div").remove();
            }
            let contItems = $("<div></div>").attr({"id": "items_div", "class": "items_div"}),
                option;
            if (items.length == 0 || !nombreItem) {
                option = $("<div></div>").attr({"class": "boton_item"}).text("No hay resultados.");
                contItems.append(option);
            } else {
                items.forEach(function(item) {
                    option = $("<div></div>").attr({"id": item.item, "name": item.item, "class": "button search_button"});
                    option.append($("<a></a>").attr({"href": ""}).text(item.item));
                    contItems.append(option);
                });
            }
            searchForm.append(contItems);
        },
        function(razon) { // onRejected = reject
            alert("Ha ocurrido un error: ".concat(razon.status, " ", razon.statusText));
        }
    );
    
});