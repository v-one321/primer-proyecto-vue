<template class="bg-danger">
    <div class="container-fluid">
        <div class="row">
            <div class="col-8 offset-2 mb-4">
                <div class="input-group mb-3">
                    <input type="text" class="form-control form-control-lg" placeholder="Buscar personaje..." v-model="search" @keyup="buscar">
                    <button class="btn btn-danger" type="button" id="button-addon2" @click="limpiar">x</button>
                </div>
            </div>
            <div class="col-12 col-md-6" v-for="item in items" :key="item.id">
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img :src="item.image" class="img-fluid rounded-start" style="width: 100%; height: 100%;"
                                alt="...">
                        </div>
                        <div class="col-md-8" style="background-color: #cfe2ff;">
                            <div class="card-body ">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text"><span class="text-success font-weight-bold">*
                                        {{ item.status }}</span>
                                    | {{ item.species }}</p>
                                <div class="text-center">
                                    <button type="button" class="btn btn-info text-white" data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop" @click="detalle(item.id)">Ver mas</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 d-grid gap-2" v-if="paginacion.limite">
                <button class="btn btn-outline-primary btn-lg" type="button" @click="siguientePagina">Ver mas</button>
            </div>
        </div>
    </div>
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-8 offset-2 text-center">
                            <img :src="personaje.image" alt="" style="width: 100%; height: 100%;"
                                class="rounded-circle border"
                                :class="personaje.status == 'Alive' ? 'border-success' : 'border-danger'">
                            <span class="badge" :class="personaje.status == 'Alive' ? 'bg-success' : 'bg-danger'">{{
                                personaje.status }}</span>
                        </div>
                        <div class="col-12 text-center"><br>
                            <span class="h5">{{ personaje.name }}</span>
                        </div>
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td><span class="badge bg-primary">Genero</span></td>
                                            <td>{{ personaje.gender }}</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-primary">Especie</span></td>
                                            <td>{{ personaje.species }}</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-primary">Estado</span></td>
                                            <td>{{ personaje.status }}</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-primary">Origen</span></td>
                                            <td>{{ personaje.origin?.name }}</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-primary">Locacion</span></td>
                                            <td>{{ personaje.location?.name }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        @click="cerrarDetalle">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
export default {
    setup() {
        const items = ref([]);
        let url = 'https://rickandmortyapi.com/api/';
        const paginacion = ref({
            pagina: 1,
            totalPaginas: null,
            limite: true
        })
        const personaje = ref({})
        const search = ref('');
        onMounted(() => {
            listar();
        })
        const listar = async () => {
            try {
                const { data } = await axios.get(url + '/character?page=' + paginacion.value.pagina + '&name=' + search.value);
                paginacion.value.totalPaginas = data.info.pages;
                items.value = [...items.value, ...data.results];
                if (paginacion.value.totalPaginas == paginacion.value.pagina) {
                    paginacion.value.limite = false;
                }
            } catch (error) {
                console.log(error)
            }
        }
        const detalle = async (param) => {
            try {
                const { data } = await axios.get(url + '/character/' + param);
                personaje.value = data
            } catch (error) {
                console.log(error)
            }
        }
        const cerrarDetalle = () => {
            personaje.value = {};
        }
        const siguientePagina = () => {
            paginacion.value.pagina++;
            listar();
        }
        const buscar = () => {
            items.value = [];
            paginacion.value.pagina = 1
            listar();
        }
        const limpiar = () => {
            items.value = [];
            paginacion.value.pagina = 1
            search.value = ''
            listar();
        }
        return {
            items,
            detalle,
            personaje,
            cerrarDetalle,
            siguientePagina,
            search,
            buscar,
            paginacion,
            limpiar,
        }
    }
}
</script>

<style></style>