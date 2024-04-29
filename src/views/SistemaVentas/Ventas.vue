<template>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Ventas registradas</h4>
                <div class="row">
                    <div class="col-12 col-md-6 text-center mb-4">
                        <button type="button" class="btn btn-primary" @click="nuevaVenta">Nueva Venta</button>
                    </div>
                    <div class="col-12">
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Item</th>
                                        <th>Cliente</th>
                                        <th>Total</th>
                                        <th>Usuario</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, indice) in items" :key="item.id">
                                        <td>{{ indice + 1 }}</td>
                                        <td>{{ item.clientes.nombre }} {{ item.clientes.apellido? item.clientes.apellido:'' }}</td>
                                        <td>{{ item.total }}</td>
                                        <td>{{ item.usuario.name }}</td>
                                        <td><span class="badge" :class="item.estado ? 'bg-success' : 'bg-danger'">{{
                                            item.estado ?
                                                'Activo' : 'Inactivo' }}</span></td>
                                        <td class="text-center">
                                            <div class="btn-group">
                                                <button class="btn btn-warning btn-sm" data-bs-toggle="modal"
                                                    data-bs-target="#staticBackdrop"
                                                    @click="verDetalle(item.id)">🛒</button>
                                                <button type="button" class="btn btn-sm" @click="cambiarEstado(item.id)" :class="item.estado?'btn-danger' : 'btn-success'">{{ item.estado? '🚫' : '✅' }}</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="...">
                            <ul class="pagination">
                                <li class="page-item" :class="{ 'disabled': paginacion.prev == false }">
                                    <button type="button" class="page-link" @click="anteriorPagina">Anterior</button>
                                </li>
                                <li class="page-item" :class="{ 'disabled': paginacion.next == false }">
                                    <button type="button" class="page-link" @click="siguientePagina">Siguiente</button>
                                </li>
                            </ul>
                        </nav>
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
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Detalle de la venta</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Item</th>
                                    <th>Nombre</th>
                                    <th>Codigo</th>
                                    <th>Cantidad</th>
                                    <th>Precio <small class="text-danger">(Unitario)</small></th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, indice) in detalle.detalles" :key="item.id">
                                    <td>{{ indice + 1 }}</td>
                                    <td>{{ item.productos.nombre }}</td>
                                    <td>{{ item.productos.codigo }}</td>
                                    <td>{{ item.cantidad }}</td>
                                    <td>{{ item.precio_unitario }}</td>
                                    <td>{{ item.total }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th class="text-center" colspan="4">TOTAL</th>
                                    <th>{{ detalle.total }}</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="cerrarModal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios'
export default {
    setup() {
        const router = useRouter()
        const items = ref([]);
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
            if(token == null){
                router.push({path: '/login'});
            }else{
                listar();
            }
        });
        const listar = async () => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'ventas?page=' + paginacion.value.pagina, { headers });
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
        const verDetalle = async (param) => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'ventas/' + param, { headers });
                detalle.value = datos;
            } catch (error) {
                console.log(error)
            }
        }
        const cambiarEstado = async (param) =>{
            const confirmacion = confirm('¿Esta seguro de cambiar el estado?');
            if(confirmacion){
                try {
                    const { data: { datos } } = await axios.delete(urlBase + 'ventas/' + param, { headers });
                    listar()
                } catch (error) {
                    console.log(error)
                }
            }
        }
        const nuevaVenta = ()=>{
            router.push({path: '/nuevaVenta'})
        }
        const cerrarModal = ()=>{
            detalle.value= {}
        }
        return {
            items,
            detalle,
            siguientePagina,
            anteriorPagina,
            paginacion,
            verDetalle,
            cambiarEstado,
            nuevaVenta,
            cerrarModal,
        }
    }
}
</script>
<style></style>