<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">🛒 Compras registradas</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6 text-center mb-4">
                                <button type="button" class="btn btn-primary" @click="nuevaCompra">Nueva Compra</button>
                            </div>
                            <div class="col-12 table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Item</th>
                                            <th>Proveedor</th>
                                            <th>Total</th>
                                            <th>Usuario</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, indice1) in items" :key="item.id">
                                            <td>{{ indice1 + 1 }}</td>
                                            <td>{{ item.proveedores.nombre }} {{ item.proveedores.apellido ?
                                                item.proveedores.apellido : '' }}</td>
                                            <td>{{ item.total }}</td>
                                            <td>{{ item.usuario.name }}</td>
                                            <td><span class="badge" :class="item.estado ? 'bg-success' : 'bg-danger'">{{
                                                item.estado ? 'Activo' : 'Inactivo' }}</span></td>
                                            <td class="text-center">
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-warning btn-sm"
                                                        @click="verDetalle(item.id)" data-bs-toggle="modal"
                                                        data-bs-target="#staticBackdrop">🔥</button>
                                                    <button type="button" class="btn btn-sm"
                                                        :class="item.estado ? 'btn-danger' : 'btn-success'"
                                                        @click="estado(item.id)">{{ item.estado ?
                                                            '🚫' : '✔' }}</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <nav aria-label="...">
                                    <ul class="pagination">
                                        <li class="page-item" :class="{ 'disabled': paginacion.prev == false }">
                                            <button type="button" class="page-link"
                                                @click="anteriorPagina">Anterior</button>
                                        </li>
                                        <li class="page-item" :class="{ 'disabled': paginacion.next == false }">
                                            <button type="button" class="page-link"
                                                @click="siguientePagina">Siguiente</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Detalle de venta</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="detalle.detalle_compra" class="table-responsive">
                        <table class="table  table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Item</th>
                                    <th>Producto</th>
                                    <th>Codigo</th>
                                    <th>Precio unitario</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, indice) in detalle.detalle_compra" :key="item.id">
                                    <td>{{ indice + 1 }}</td>
                                    <td>{{ item.producto.nombre }}</td>
                                    <td>{{ item.producto.codigo }}</td>
                                    <td>{{ item.precio_unitario }}</td>
                                    <td>{{ item.cantidad }}</td>
                                    <td>{{ item.total }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th class="text-center" colspan="5">TOTAL</th>
                                    <th class="text-end">{{ detalle.total }}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        @click="cerrarModal">Cerrar</button>
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
        const items = ref([]);
        const router = useRouter();
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        // let urlBase = "https://api.repuestosangel.net/api/";
        let urlBase = "http://hamilobackuno.test/api/";
        const paginacion = ref({
            pagina: 1,
            next: true,
            prev: false,
            last_page: null
        });
        const detalle = ref({});
        onMounted(() => {
            if (token == null) {
                router.push({ path: '/login' });
            } else {
                listar();
            }
        })
        const listar = async () => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'compras?page=' + paginacion.value.pagina, { headers });
                // console.log(datos);
                items.value = datos.data;
                console.log(items.value);
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
                console.log(error);
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
        const estado = async (param) => {
            let confirmacion = confirm('¿Desea modificar el estado de este registro?');
            if (!confirmacion) {
                return;
            }
            try {
                const { data } = await axios.delete(urlBase + 'compras/' + param, { headers });
                listar();
            } catch (error) {
                console.log(error)
            }
        }
        const verDetalle = async (param) => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'compras/' + param, { headers });
                detalle.value = datos;
            } catch (error) {
                console.log(error);
            }
        }
        const cerrarModal = () => {
            detalle.value = {};
        }
        const nuevaCompra = () =>{
            router.push({path:'/nuevaCompra'});
        }
        return {
            items,
            paginacion,
            siguientePagina,
            anteriorPagina,
            estado,
            verDetalle,
            detalle,
            cerrarModal,
            nuevaCompra,
        }
    }
}
</script>
<style></style>