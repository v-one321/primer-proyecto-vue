<template>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Nuevo Registro</h4>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="codigo">Codigo <small class="text-danger">*</small></label>
                            <input type="text" class="form-control" name="codigo" id="codigo" v-model="producto.codigo"
                                placeholder="cod-12" :class="{ 'border-danger': detectados.codigo }">
                            <small class="text-danger" v-show="detectados.codigo">{{ detectados.codigo
                                }}</small>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="nombre">Nombre <small class="text-danger">*</small></label>
                            <input type="text" class="form-control" name="nombre" id="nombre" v-model="producto.nombre"
                                placeholder="Escriba..." :class="{ 'border-danger': detectados.nombre }">
                            <small class="text-danger" v-show="detectados.nombre">{{ detectados.nombre
                                }}</small>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="precio_venta">Precio venta <small class="text-danger">*</small></label>
                            <input type="text" class="form-control" name="precio_venta" id="precio_venta"
                                placeholder="12.5" v-model="producto.precio_venta"
                                :class="{ 'border-danger': detectados.precio_venta }">
                            <small class="text-danger" v-show="detectados.precio_venta">{{
                                detectados.precio_venta }}</small>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="precio_compra">Precio compra <small class="text-danger">*</small></label>
                            <input type="text" class="form-control" name="precio_compra" id="precio_compra"
                                placeholder="12.5" v-model="producto.precio_compra"
                                :class="{ 'border-danger': detectados.precio_compra }">
                            <small class="text-danger" v-show="detectados.precio_compra">{{
                                detectados.precio_compra }}</small>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="form-group">
                            <label for="descripcion">Descripcion</label>
                            <textarea class="form-control" name="descripcion" id="descripcion" placeholder="Escriba"
                                v-model="producto.descripcion"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-end bg-primary">
                <button type="button" class="btn btn-danger me-1" @click="cancelar">Cancelar</button>
                <button type="button" class="btn btn-success ms-1 text-white" @click="guardarProducto">Guardar</button>
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
        const productoId = router.currentRoute.value.params.idProducto;
        const producto = ref({
            codigo: '',
            nombre: '',
            descripcion: '',
            precio_venta: '',
            precio_compra: '',
        });
        const detectados = ref({});
        let token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        // let urlBase = "https://api.repuestosangel.net/api/";
        let urlBase = "http://hamilobackuno.test/api/";
        onMounted(() => {
            if (token == null) {
                router.push({ path: '/login' });
            } else if (productoId != '') {
                editarProducto();
            }
        })
        const cancelar = () => {
            router.push({ path: '/productos' });
        }
        const guardarProducto = async () => {
            detectados.value = {};
            try {
                if (productoId != '') {
                    const { data } = await axios.put(urlBase + 'productos/' + productoId, producto.value, { headers });
                } else {
                    const { data } = await axios.post(urlBase + 'productos', producto.value, { headers });
                }
                cancelar();
            } catch (error) {
                if (error.response.status == 422) {
                    detectados.value = error.response.data.errors;
                } else {// if (condicion) {
                    alert('Contacte con el soporte de sistemas, Gracias')
                }
            }
        }
        const editarProducto = async () => {
            try {
                const { data: { datos } } = await axios.get(urlBase + 'productos/' + productoId, { headers });
                producto.value = {
                    codigo: datos.codigo,
                    nombre: datos.nombre,
                    descripcion: datos.descripcion,
                    precio_venta: datos.precio_venta,
                    precio_compra: datos.precio_compra,
                };
            } catch (error) {
                console.log(error)
            }
        }
        return {
            producto,
            detectados,
            cancelar,
            guardarProducto,
        }
    }
}
</script>
<style lang="">

</style>