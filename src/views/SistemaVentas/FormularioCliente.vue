<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h4>Formulario de registro</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="form-group">
                                    <label for="nombre">Nombre(s) <small class="text-danger">*</small></label>
                                    <input type="text" id="nombre" v-model="cliente.nombre" class="form-control" placeholder="Escriba.." :class="{'border-danger':errores.nombre}">
                                    <small class="text-danger" v-show="errores.nombre">{{ errores.nombre }}</small>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="form-group">
                                    <label for="apellido">Apellido(s)</label>
                                    <input type="text" id="apellido" v-model="cliente.apellido" class="form-control"
                                        placeholder="Escriba..">
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="form-group">
                                    <label for="identificacion">Identificacion <small class="text-danger">*</small></label>
                                    <input type="text" id="identificacion" v-model="cliente.identificacion" class="form-control" placeholder="Escriba.." :class="{'border-danger':errores.identificacion}">
                                </div>
                                    <small class="text-danger" v-show="errores.identificacion">{{ errores.identificacion }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-end bg-dark">
                        <button type="button" class="btn btn-danger m-2" @click="cancelar">Cancelar</button>
                        <button class="btn btn-success m-2" @click="guardar">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';
export default {
    setup() {
        const cliente = ref({
            nombre: '',
            apellido: '',
            identificacion: '',
        });
        const router = useRouter();
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        // let urlBase = "https://api.repuestosangel.net/api/";
        let urlBase = "http://hamilobackuno.test/api/";
        const errores = ref({});
        // idCliente
        let idCliente = router.currentRoute.value.params.idCliente;

        onMounted(() => {
            if(token == null){
                router.push({ path: '/login' });
            }
            if((idCliente != null || idCliente != undefined) && idCliente > 0){
               editarCliente();
            }
            console.log("idCliente" + idCliente);
        });

        const guardar = async () => {
            try {
                if((idCliente != null || idCliente != undefined) && idCliente > 0){
                    const { data } = await axios.put(urlBase + 'clientes/' + idCliente, cliente.value, { headers });
                } else {
                    const { data } = await axios.post(urlBase + 'clientes', cliente.value, { headers });
                }
                router.push({ path: '/clientes' });
            } catch (error) {
                // if(error.response.status == 422){
                //     errores.value = error.response.data.errors;
                // }else{
                    alert('¿Contacte con el soporte de sistemas, Gracias');
                // }
                console.log(error);
            }
        }

        const editarCliente = async () => {
            try{
                const { data } = await axios.get(urlBase + 'clientes/'+ idCliente, { headers });
                cliente.value = data.datos;
            } catch (error){
                console.log(error);
            }
        }

        const cancelar = () => {
            router.push({ path: '/clientes' });
        }
        return {
            cliente,
            guardar,
            cancelar,
            errores
        }
    }
}
</script>
<style></style>