<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6 mb-4">
                                <h4>Clientes</h4>
                            </div>
                            <div class="col-12 col-md-6 mb-4 text-end">
                                <button type="button" class="btn btn-primary " @click="nuevoRegistro">Agregar</button>
                            </div>
                            <div class="col-12">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead class="table-dark">
                                            <tr>
                                                <th>Item</th>
                                                <th>Nombres y apellidos</th>
                                                <th>Nro identificacion</th>
                                                <th>Estado</th>
                                                <th>Operaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, indice) in items" :key="item.id">
                                                <td>{{ indice + 1 }}</td>
                                                <td>{{ item.nombre }} {{ item.apellido != null ? item.apellido : '' }}
                                                </td>
                                                <td>{{ item.identificacion }}</td>
                                                <td><span class="badge" :class="item.estado ? 'bg-success' : 'bg-danger'">{{
                                                        item.estado?'Activo':'Inactivo'}}</span></td>
                                                <td>
                                                    <button @click="editar(item.id)" class="btn btn-warning btn-sm">
                                                        ✍️
                                                    </button>
                                                    <button v-if="item.estado" @click="cambiarEstado(item.id, 'Inactivar')" class="btn btn-danger btn-sm">
                                                        🚫
                                                    </button>
                                                    <button v-else @click="cambiarEstado(item.id, 'Activar')" class="btn btn-primary btn-sm">
                                                        ✔
                                                    </button>
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
        let urlBase = 'https://api.repuestosangel.net/api/';
        onMounted(() => {
            if (token == null) {
                router.push({ path: '/login' });
            } else {
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
                const { data: { datos } } = await axios.get(urlBase + 'clientes?page=' + paginacion.value.pagina, { headers });
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


        const nuevoRegistro = () => {
            router.push({ path: '/cliente-formulario' });
        }

        const editar = (param) => {
            router.push({ path: '/cliente-formulario/' + param });
        }

        const cambiarEstado = async (elid, tipo) => {
            let confirmacion = confirm('Esta seguro de ' + tipo + ' el Cliente?');
            if(!confirmacion){
                return;
            }
            try {
                const { data } = await axios.delete(urlBase + 'clientes/' + elid , { headers });
                listar();
            } catch (error) {
                console.log(error);
            }
        }

        return {
            items,
            paginacion,
            nuevoRegistro,
            editar,
            cambiarEstado,
            siguientePagina,
            anteriorPagina
        }
    }
}
</script>
<style></style>