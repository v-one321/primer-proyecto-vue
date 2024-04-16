<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="card alert alert-info">
                    <div class="card-body">
                        <h4 class="card-title">Nuevo registro</h4>
                        <div class="form-group">
                            <label for="nombre">Nombre</label>
                            <input type="text" id="nombre" class="form-control" v-model="nombre">
                        </div>
                        <div class="form-group">
                            <label for="apellido">Apellido</label>
                            <input type="text" id="apellido" class="form-control" v-model="apellido">
                        </div>
                        <p>{{ nombre }} {{ apellido }}</p>
                        <button type="button" class="btn btn-info text-white" @click="agregar">Agregar</button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="card alert alert-warning">
                    <div class="card-body">
                        <h4 class="card-title">Lista de registros</h4>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between" v-for="(item, indice) in usuario"
                                :key="indice">{{ item.nombre }} {{ item.apellido }}
                                <button type="button" class="btn btn-danger" @click="eliminar(indice)">x</button>
                            </li>
                        </ul>
                    </div>
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
        const usuario = ref([
            {
                nombre: 'Vladimir',
                apellido: 'Luna'
            }
        ]);
        onMounted(()=>{
            listar();
        });
        const nombre = ref('');
        const apellido = ref('');
        const agregar = () => {
            usuario.value.push({
                nombre: nombre.value,
                apellido: apellido.value
            });
            nombre.value = '';
            apellido.value = '';
        }
        const eliminar = (param) => {
            let confirmacion = confirm('Esta seguro de eliminar este registro?');
            if (confirmacion) {
                usuario.value.splice(param, 1);
            }
        }
        const listar = async () => {
            try{
                const { data } = await axios.get('https://rickandmortyapi.com/api/character');
                console.log(data)
            }catch(error){
                console.log(error)
            }
        }
        return {
            usuario,
            nombre,
            apellido,
            agregar,
            eliminar
        }
    }
}
</script>