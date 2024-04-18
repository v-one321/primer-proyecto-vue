<template>
    <div>
        <div class="container mt-5">
        <div class="row">

            <div class="col-md-6">
                <div class="card border-dark">
                  <div class="card-body">
                    <h4 class="card-title">Productos</h4>
                    
                    <div class="row">
                        <div class="col-md-8">
                            <input type="search" class="form-control" placeholder="Buscar producto">
                        </div>

                        <div class="col-md-4">
                            <button class="btn btn-primary">Nuevo</button>
                        </div>
                    </div>

                    <table class="table mt-3">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Stock</th>
                                <th>Agregar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in items" :key="item.id">
                                <td scope="row">{{ item.codigo }}</td>
                                <td>{{ item.nombre }}</td>
                                <td>{{ item.cantidad }}</td>
                                <td class="text-center">
                                    <button @click="agregarCarrito(item)" class="btn btn-primary btn-sm">+</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="text-center">
                        <nav aria-label="Page navigation">
                          <ul class="pagination justify-content-center">
                            <li class="page-item disabled">
                              <a class="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">«</span>
                                <span class="sr-only">Previous</span>
                              </a>
                            </li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item">
                              <a class="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">»</span>
                                <span class="sr-only">Next</span>
                              </a>
                            </li>
                          </ul>
                        </nav>
                    </div>
                    

                  </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card border-dark">
                  <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h4 class="card-title">Carrito</h4>
                        </div>
                        <div class="col-md-6 text-right text-end">
                            <h5 class="card-title  text-primary">Total: <b>{{ total }}</b></h5>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-8">
                            <div class="form-group">
                                <label for="proveedor">Proveedor:</label>
                                <select v-model="proveedor_id" id="proveedor" class="form-control">
                                    <option>Seleccione...</option>
                                    <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">{{ prov.identificacion }} - {{ prov.nombre + ' ' + prov.apellido }}</option>
                                </select>
                            </div>
                        </div>
                        <!-- <div class="col-md-4">
                            <div class="form-group">
                                <label for="movimiento">Nro. de movimiento</label>
                                <input type="text" class="form-control" placeholder="xxx01001">
                            </div>
                        </div> -->
                    </div>

                    <table class="table mt-3">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Quitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(car, indice) in carrito" :key="car.id">
                                <td scope="row">
                                    {{ car.nombre }} <br> 
                                    <small class="text-mutted">{{ car.codigo }}</small>
                                </td>
                                <td>
                                    <input type="number" class="form-control" :value="car.stock" min="1">
                                </td>
                                <td class="text-right">
                                    {{ car.precio_total }}
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-danger btn-sm">X</button>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="2" class="text-right">Total</th>
                                <th class="text-right">{{ total }}</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>

                    <div class="text-right text-end">
                        <button @click="guardarCompra()" class="btn btn-success">Guardar</button>                      
                    </div>
                   
                  </div>
                </div>
            </div>
        </div>

    </div>
    </div>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        const items = ref([]);
        const proveedores = ref([]);
        const carrito = ref([]);
        const total = ref(0);
        const proveedor_id = ref(0);
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        let urlBase = 'https://api.repuestosangel.net/api/';
        onMounted(() => {
            if(token == null){
                router.push({path: '/login'});
            }else{
                listar();
                cargarProveedores();
            }
        });
        const paginacion = ref({
            pagina: 1,
            next: true,
            prev: false,
            last_page: null
        })
        const listar = async () => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'productos?page=' + paginacion.value.pagina, { headers });
                items.value = datos.data;
                paginacion.value.last_page = datos.last_page;
                if (paginacion.value.last_page == paginacion.value.pagina) {
                    paginacion.value.next = false;
                } else {
                    paginacion.value.next = true;
                }
                if (paginacion.value.pagina == 1) {
                    paginacion.value.prev = false;
                } else {
                    paginacion.value.prev = true;
                }
            } catch (error) {
                console.log(error)
            }
        }
        const siguientePagina = () => {
            if (paginacion.value.last_page > paginacion.value.pagina) {
                paginacion.value.pagina++;
                listar();
            }
        }
        const anteriorPagina = () => {
            if (paginacion.value.pagina > 1) {
                paginacion.value.pagina--;
                listar();
            }
        }

        const cargarProveedores = async () => {
            try {
                const { data } = await axios.get(urlBase + 'proveedores-activos', { headers });
                proveedores.value = data.datos;
                // console.log(proveedores.value);
            } catch (error) {
                console.log(error);
            }
        }

        const agregarCarrito = (item) => {
            // console.log(item);
            // verificar qeu el item no exista en el carrito
            let existe = carrito.value.find(elem => elem.id == item.id);
            if(existe){
                // incrementamos en 1 la cantidad
                existe.stock++;
                existe.precio_total = parseFloat(existe.precio_compra) * parseFloat(existe.stock);
            } else {
                // agregar el item al carrito
                item.stock = 1;
                item.producto_id = item.id;
                item.precio_unitario = item.precio_compra;
                item.precio_total = item.precio_compra;
                carrito.value.push(item);
            }
            calcularTotal();
            // console.log(carrito.value);
        }

        const calcularTotal = () => {
            let suma = 0;
            carrito.value.forEach(item => {
                suma += parseFloat(item.precio_compra) * parseFloat(item.stock);
            })
            total.value = suma;
        }

        const guardarCompra = async () => {
            // validamos el proveedor
            if(proveedor_id.value == 0 || proveedor_id.value == null){
                alert('Seleccione un proveedor');
                return;
            }
            // validamos el carrito
            if(carrito.value.length == 0){
                alert('Agregar productos al carrito!');
                return;
            }

            let detalleArray = [];
            carrito.value.forEach(item => {
                detalleArray.push({
                    producto_id: item.producto_id,
                    cantidad: item.stock,
                    precio_unitario: item.precio_unitario,
                    precio_total: item.precio_total
                });
            })


            let compra = {
                proveedor_id: proveedor_id.value,
                total: total.value,
                detalle: detalleArray
            }

            try {
                const { data } = await axios.post(urlBase + 'compras', compra,{ headers });
                // console.log(data);
                alert('Compra registrada con éxito');
                carrito.value = [];
                proveedor_id.value = 0;
                calcularTotal();
                listar();
            } catch (error) {
                console.log(error);
            }


        }

        return {
            items,
            paginacion,
            proveedores,
            proveedor_id,
            siguientePagina,
            anteriorPagina,

            agregarCarrito,
            carrito,
            total,

            guardarCompra
        }
    }
}
</script>

<style scoped>
</style>