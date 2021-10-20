//Variables
const carrito = document.querySelector("#carrito");  //Linea 23 - HTML
const contenedorCarrito = document.querySelector("#lista-carrito tbody"); //Lineas 25 y 35 
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito"); //Linea 42
const listaProductos = document.querySelector("#lista-cursos");  //Linea 84
let articulosCarrito = [] //Es un array que va a inicializarse vacio


registrarEventListeners();
function registrarEventListeners(){ 
    //Cuando se agrega un producto presionando en el botón "Agregar al carrito"
    listaProductos.addEventListener("click", agregarProducto);

    //Eliminar productos del carrito
    carrito.addEventListener("click", eliminarProducto);

    //Mostrar los productos del Local Storage
    document.addEventListener("DOMContentLoaded", () =>{
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || []; //En caso de que no haya nada en el carrito le añada un array vacio

        carritoHtml(); //Mandamos a llamar esa función para que imprima lo que hay en el Local Storage
    });
    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = []; //Reseteamos el array

        limpiarHtml(); //Se elimina todo el HTML
    });
}

//Funciones
//En esta función trabajamos en lo que respecta a añadir un producto al carrito
function agregarProducto(event){
    event.preventDefault(); //De esta manera evitamos que la página se redirija hacía el encabezado al hacer clic

    if( event.target.classList.contains("agregar-carrito")){
       const productoSeleccionado = event.target.parentElement.parentElement;
       leerDatosProducto(productoSeleccionado);
    }
}



//Función para eliminar un producto del carrito
function eliminarProducto(event){
    if( event.target.classList.contains("borrar-producto")){
        const productoId = event.target.getAttribute("data-id");
       
        //Elimina del array de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHtml(); //Iterar sobre el carrito y mostrar su html 
        
    }
}

//Función para leer los datos del HTML al que se hizo clic.
function leerDatosProducto(producto){
    /* console.log(producto); */

    //Crear un objeto con el contenido del curso
    const infoProducto = {
        imagen: producto.querySelector("img").src,
        titulo: producto.querySelector("h4").textContent,
        precio: producto.querySelector(".precio").textContent,
        id: producto.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }

    //Verificar si un producto ya existe en el carrito. Se usa el .some para iterar sobre un array de objetos y verificar si un elemento ya existe
    const verificacion = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if(verificacion){
        //Actualizamos la cantidad de productos. map va a ir iterando sobre todos los elementos del carrito 
        const productos = articulosCarrito.map( producto =>{
            if(producto.id === infoProducto.id){
                producto.cantidad++;
                return producto; //Retorna el objeto actualizado
            }else{
                return producto; //Retorna los objetos no duplicados
            }
        });
        articulosCarrito = [...productos];
        alert(`El producto ${infoProducto.titulo} ha sido añadido correctamente`);
    }else{
        //De esta manera arranca en cero y luego se le van añadiendo los productos
        articulosCarrito = [...articulosCarrito, infoProducto]; 
        alert(`El producto ${infoProducto.titulo} ha sido añadido correctamente`);
    };
    /* console.log(articulosCarrito); */
    carritoHtml();
} 

//Mostrar el carrito en el HTML
function carritoHtml(){
    //Limpiar el HTML
    limpiarHtml();

    //Gracias al forEach vamos a iterar el producto y mostrarlo
    articulosCarrito.forEach(producto => {     
        const { imagen, titulo, precio, cantidad, id } = producto; //Destructuring - Objetos
        const row = document.createElement("tr"); //Se crea una etiqueta "tr" para poder mostrar todo en el "tbody"que está en el archivo html
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href="#" class="borrar-producto" data-id=${id}> X </td>
        `;
        //Agrega el producto seleccionado en el carrito
        contenedorCarrito.appendChild(row); //Va a ir agregando al final del "tbody"
    })

    //LocalStorage
    sincronizarStorage();

}

//Local Storage - Agregar los productos seleccionados
function sincronizarStorage(){
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}


//Con esta función evitamos que se carguen dos veces los productos cuando se elige uno nuevo.
//Limpiamos el carrito de compras
function limpiarHtml(){
    //Forma "lenta"
    /*contenedorCarrito.innerHTML = ""; */

   //Forma optimizada: mientras haya un elemento "hijo"(producto) va a ir eliminando el primero que aparezca en el carrito
   while(contenedorCarrito.firstChild){
       contenedorCarrito.removeChild(contenedorCarrito.firstChild)
   }
};