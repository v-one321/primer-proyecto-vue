<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6 text-center mb-4">
                                <button type="button" class="btn btn-primary" @click="nuevoRegistro">Agregar</button>
                            </div>
                            <div class="col-12">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead class="table-dark">
                                            <tr>
                                                <th>Item</th>
                                                <th>Nombres y apellidos</th>
                                                <th>Nro identificacion</th>
                                                <th>Contacto</th>
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
                                                <td>{{ item.contacto }}</td>
                                                <td><span class="badge" :class="item.estado ? 'bg-success' : 'bg-danger'">{{
                                                        item.estado?'Activo':'Inactivo'}}</span></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
                const { data: { datos } } = await axios.get(urlBase + 'proveedores?page=' + paginacion.value.pagina, { headers });
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
        const nuevoRegistro = () => {
            router.push({ path: '/proveedor-formulario' });
        }
        return {
            items,
            paginacion,
            nuevoRegistro,
        }
    }
}
</script>
<style></style>