<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body mb-3"            data-bs-theme="dark">        
            <!--<router-link class="navbar-brand" to="/home">Navbar</router-link>-->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/home"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/productos"><i class="fas fa-cubes me-1"></i>Productos</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/proveedores"><i class="fas fa-user-tag me-1"></i>Proveedores</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/clientes"><i class="fas fa-users me-1"></i>Clientes</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/compras"><i class="fas fa-cart-plus me-1"></i>Compras</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/ventas"><i class="fas fa-shopping-cart me-1"></i>Ventas</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="fas fa-window-restore me-1"></i>Otras paginas
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/contactos">Contactos</router-link></li>
                            <li><router-link class="dropdown-item" to="/api-rick">Rick y Morty</router-link></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <form class="form-inline my-2 my-lg-0">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <img :src="usuario.foto_perfil != null ? urlBase + 'imagenes/' + usuario.foto_perfil : 'https://ui-avatars.com/api/?background=cef2ef&color=00685f&name=' + usuario.name"
                                style="width: 30px; height: 30px;" class="rounded-circle border border-dark" alt="">
                            {{ usuario.name }}
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/perfil"><i class="fas fa-user me-1"></i>Perfil</router-link></li>
                            <li><button type="button" class="dropdown-item" @click="cerrarSesion"><i class="fas fa-power-off me-1"></i>Salir</button></li>
                        </ul>
                    </li>
                </ul>
            </form>
        
    </nav>

    <!-- ABRE CONTENIDO DE LAS VISTAS-->
    <router-view />
    <!-- CIERRA CONTENIDO DE LAS VISTAS-->
</template>
<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
export default {
    setup() {
        const usuario = ref({});
        const router = useRouter()
        const urlBase = ref("https://api.repuestosangel.net/");
        let token = null;
        onMounted(() => {
            // verificar si existe usuario y token en el localStorage
            let usuarioStorage = localStorage.getItem("usuario");
            token = localStorage.getItem("token");
            if (usuarioStorage == null && token == null) {
                router.push("/login");
            }
            usuario.value = JSON.parse(usuarioStorage);
        })
        const cerrarSesion = async () => {
            try{
                let post = {};
                let cabecera = {
                    Authorization: "Bearer " + token,
                };
                const { data } =  await axios.post(urlBase.value+'api/logout', post, { headers: cabecera });
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                router.push("/login");
            }catch(error){
                console.log(error);
            }
        }
        return {
            usuario,
            urlBase,
            cerrarSesion,
        }
    }
}
</script>