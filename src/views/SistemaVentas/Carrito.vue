<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">🏠 Lista de Productos</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Item</th>
                                        <th>Nombre</th>
                                        <th>Codigo</th>
                                        <th>Cantidad</th>
                                        <th>Precio Venta</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, indice) in items" :key="item.id">
                                        <td>{{ indice + 1 }}</td>
                                        <td>{{ item.nombre }}</td>
                                        <td>{{ item.codigo }}</td>
                                        <td>{{ item.cantidad }}</td>
                                        <td>{{ item.precio_venta }}</td>
                                        <td class="text-center">
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-primary btn-sm"
                                                    @click="obtenerProducto(item.id)">
                                                    ➕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="...">
                            <ul class="pagination">
                                <li class="page-item" :class="{ disabled: paginacion.prev == false }">
                                    <button type="button" class="page-link" @click="anteriorPagina">
                                        Anterior
                                    </button>
                                </li>
                                <li class="page-item" :class="{ disabled: paginacion.next == false }">
                                    <button type="button" class="page-link" @click="siguientePagina">
                                        Siguiente
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">🛒 Carrito</h4>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-4">
                            <label for="cliente_id">Clientes</label>
                            <select id="cliente_id" v-model="cliente_id" class="form-control">
                                <option :value="null">Seleccione</option>
                                <option :value="cliente.id" v-for="cliente in clientes" :key="cliente.id">{{
                                    cliente.nombre }} {{ cliente.apellido ? cliente.apellido : '' }}</option>
                            </select>
                        </div>
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Item</th>
                                        <th>Nombre</th>
                                        <th>Cantidad</th>
                                        <th>
                                            Precio <small class="text-danger">(Unitario)</small>
                                        </th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, indice) in carrito" :key="item.id">
                                        <td>{{ indice + 1 }}</td>
                                        <td>{{ item.nombre }}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-danger btn-sm"
                                                    @click="reducirCantidad(indice)">
                                                    ➖
                                                </button>
                                                <button type="button" class="btn btn-outline-primary btn-sm">
                                                    {{ item.cantidad }}
                                                </button>
                                                <button type="button" class="btn btn-success btn-sm"
                                                    @click="incrementarCantidad(indice)">
                                                    ➕
                                                </button>
                                            </div>
                                        </td>
                                        <td>{{ item.precio_unitario }}</td>
                                        <td>{{ item.precio_total }}</td>
                                        <td>
                                            <button type="button" class="btn btn-danger btn-sm"
                                                @click="eliminarCarrito(indice)">
                                                🚫
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th class="text-center" colspan="4">TOTAL</th>
                                        <th>{{ total }}</th>
                                        <th></th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer text-end">
                        <button type="button" class="btn btn-danger text-white btn-lg me-2" @click="cancelar">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-warning text-white btn-lg ms-2" @click="terminarProceso">
                            Terminar Proceso
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
    setup() {
        const router = useRouter();
        const items = ref([]);
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        let urlBase = "https://api.repuestosangel.net/api/";
        const paginacion = ref({
            pagina: 1,
            next: true,
            prev: false,
            last_page: null,
        });
        const total = ref(0);
        const carrito = ref([]);
        const clientes = ref([]);
        const cliente_id = ref(null);
        onMounted(() => {
            if (token == null) {
                router.push({ path: '/login' });
            } else {
                listar();
                listarClientes();
            }
        });
        const listar = async () => {
            try {
                const {
                    data: { datos },
                } = await axios.get(
                    urlBase + "productos-activos?page=" + paginacion.value.pagina,
                    { headers }
                );
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
                if (localStorage.getItem("carrito")) {
                    carrito.value = JSON.parse(localStorage.getItem("carrito"));
                    sumarTotal();
                }
            } catch (error) {
                console.log(error);
            }
        };
        const siguientePagina = () => {
            if (paginacion.value.last_page > paginacion.value.pagina) {
                paginacion.value.pagina++;
                listar();
            }
        };
        const anteriorPagina = () => {
            if (paginacion.value.pagina > 1) {
                paginacion.value.pagina--;
                listar();
            }
        };
        const cancelar = () => {
            router.push({ path: "/ventas" });
        };
        const obtenerProducto = async (param) => {
            try {
                const {
                    data: { datos }, } = await axios.get(urlBase + "productos/" + param, { headers });
                if (!evaluarIdProducto(datos.id)) {
                    if (datos.cantidad > 0) {
                        carrito.value.push({
                            producto_id: datos.id,
                            nombre: datos.nombre,
                            precio_unitario: datos.precio_venta,
                            cantidad: 1,
                            precio_total: datos.precio_venta,
                            stock: datos.cantidad,
                        });
                        localStorage.setItem("carrito", JSON.stringify(carrito.value));
                        sumarTotal();
                    } else {
                        alert("El stock del producto es 0");
                    }
                } else {
                    alert("El producto ya se encuentra registrado en la tabla Carrito");
                }
            } catch (error) {
                console.log(error);
            }
        };
        const evaluarIdProducto = (parametro) => {
            let existe = false;
            carrito.value.forEach((item) => {
                if (item.producto_id === parametro) {
                    existe = true;
                }
            });
            return existe;
        };
        const sumarTotal = () => {
            total.value = 0;
            if (carrito.value.length > 0) {
                carrito.value.forEach((item) => {
                    total.value += parseFloat(item.precio_total);
                    total.value = total.value;
                });
            }
        };
        const eliminarCarrito = (indice) => {
            const confirmacion = confirm(
                "¿Esta seguro de eliminar el PRODUCTO de la lista CARRITO?"
            );
            if (confirmacion) {
                carrito.value.splice(indice, 1);
                if (carrito.value.length > 0) {
                    localStorage.setItem("carrito", JSON.stringify(carrito.value));
                } else {
                    localStorage.removeItem("carrito");
                }
                sumarTotal();
            }
        };
        const incrementarCantidad = (param) => {
            if (carrito.value[param].cantidad < carrito.value[param].stock) {
                carrito.value[param].cantidad++;
                carrito.value[param].precio_total = (
                    carrito.value[param].cantidad * carrito.value[param].precio_unitario
                ).toFixed(2);
                localStorage.setItem("carrito", JSON.stringify(carrito.value));
                sumarTotal();
            } else {
                alert('La cantidad requerida es mayor al STOCK del producto.');
            }
        };
        const reducirCantidad = (param) => {
            if (carrito.value[param].cantidad > 1) {
                carrito.value[param].cantidad--;
                carrito.value[param].precio_total = (
                    carrito.value[param].cantidad * carrito.value[param].precio_unitario
                ).toFixed(2);
                localStorage.setItem("carrito", JSON.stringify(carrito.value));
                sumarTotal();
            }
        };
        const terminarProceso = () => {
            if (carrito.value.length > 0) {
                if (cliente_id.value == null) {
                    alert("Debe seleccionar un cliente, Gracias");
                    return;
                }
                let informacion = {
                    total: total.value,
                    cliente_id: cliente_id.value,
                    detalle: carrito.value,
                };
                const confirmacion = confirm("¿Está seguro de Finalizar la VENTA?");
                if (confirmacion) {
                    try {
                        const respuesta = axios.post(urlBase + "ventas", informacion, {
                            headers,
                        });
                        localStorage.removeItem("carrito");
                        cancelar();
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                alert("Debe agregar al menos 1 producto a la tabla carrito, Gracias");
            }
        };
        const listarClientes = async () => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'clientes-activos', { headers });
                clientes.value = datos;
            } catch (error) {
                console.log(error);
            }
        }
        return {
            items,
            paginacion,
            siguientePagina,
            anteriorPagina,
            cancelar,
            obtenerProducto,
            reducirCantidad,
            incrementarCantidad,
            eliminarCarrito,
            carrito,
            total,
            terminarProceso,
            clientes,
            cliente_id
        };
    },
};
</script>
<style></style>
