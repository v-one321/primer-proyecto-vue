<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6 mb-4">
                                <h4>Productos</h4>
                            </div>
                            <div class="col-12 col-md-6 mb-4 text-end">
                                <button type="button" class="btn btn-primary " @click="nuevoRegistro">Agregar</button>
                            </div>
                            <div class="col-12">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead class="table-dark">
                                            <tr>
                                                <th>Item</th>
                                                <th>Codigo</th>
                                                <th>Nombre</th>
                                                <th>Precio <small class="text-danger">(Compra)</small></th>
                                                <th>Precio <small class="text-danger">(Venta)</small></th>
                                                <th>Stock</th>
                                                <th>Descripcion</th>
                                                <th>Estado</th>
                                                <th>Operaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, indice) in items" :key="item.id">
                                                <td>{{ indice + 1 }}</td>
                                                <td>{{ item.codigo }}</td>
                                                <td>{{ item.nombre }}</td>
                                                <td>{{ item.precio_compra }}</td>
                                                <td>{{ item.precio_venta}}</td>
                                                <td>{{ item.cantidad}}</td>
                                                <td>{{ item.descripcion }}</td>
                                                <td><span class="badge"
                                                        :class="item.estado ? 'bg-success' : 'bg-danger'">{{
                                                        item.estado ? 'Activo' : 'Inactivo' }}</span></td>
                                                <td>
                                                    <div class="btn-group">
                                                        <button type="button" class="btn btn-warning btn-sm"
                                                            @click="obtenerProducto(item.id)">✴</button>
                                                        <button type="button" class="btn btn-danger btn-sm"
                                                            @click="eliminarProducto(item.id, 'Inactivar')"
                                                            v-if="item.estado">🚫</button>
                                                        <button type="button" class="btn btn-success btn-sm"
                                                            @click="eliminarProducto(item.id, 'Activar')"
                                                            v-else>✔</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col-12">
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
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios'
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
        // let urlBase = "https://api.repuestosangel.net/api/";
        let urlBase = "http://hamilobackuno.test/api/";
        onMounted(() => {
            if(token == null){
                router.push({path: '/login'});
            }else{
                listar();
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
        const nuevoRegistro = () => {
            router.push('formulario')
        }
        const obtenerProducto = (param) => {
            router.push({ path: '/formulario/' + param })
        }
        const eliminarProducto = async (param, texto) => {
            const confirmacion = confirm('¿Esta seguro de ' + texto + ' el registro?')
            if (confirmacion) {
                try {
                    const { data } = await axios.delete(urlBase + 'productos/' + param, { headers });
                    listar();
                } catch (error) {
                    console.log(error)
                }
            }
        }
        return {
            items,
            paginacion,
            anteriorPagina,
            siguientePagina,
            nuevoRegistro,
            obtenerProducto,
            eliminarProducto,
        }
    }
}
</script>

<style></style>