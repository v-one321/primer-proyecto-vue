<template>
    <div class="paginaLogin">
        <div class="contenedorLogin" :class="{ 'active': contenedor }">
            <div class="form-container sign-up">
                <form action="#">
                    <h1>Crear cuenta</h1>
                    <div class="social-icons">
                        <a href="#" class="icon"><i class='bx bxl-facebook'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-google'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-linkedin'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-github'></i></a>
                    </div>
                    <samp>O usa un email para el registro</samp>
                    <input type="text" placeholder="Name" v-model="registro.name">
                    <input type="email" placeholder="Email" v-model="registro.email">
                    <input type="password" placeholder="Password" v-model="registro.password">
                    <input type="password" placeholder="Password Confirmation" v-model="registro.password_confirmation">
                    <button type="button" @click="nuevoRegistro">Registrar</button>
                </form>
            </div>
            <div class="form-container sign-in">
                <form action="#">
                    <h1>Iniciar Sesion</h1>
                    <div class="social-icons">
                        <a href="#" class="icon"><i class='bx bxl-facebook'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-google'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-linkedin'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-github'></i></a>
                    </div>
                    <samp>O usa un email y contraseña</samp>
                    <input type="email" placeholder="Email" v-model="iniciarSesion.email">
                    <input type="password" placeholder="Password" v-model="iniciarSesion.password">
                    <a href="#" class="fp">Recuperar contraseña?</a>
                    <button type="button" @click="login">Ingresar</button>
                    <button type="button" @click="logout">Cerrar Sesion</button>
                </form>
            </div>
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button class="hidden" @click="contenedor = false">Sign In</button>
                    </div>
                    <div class="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button class="hidden" @click="contenedor = true">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref } from 'vue';
export default {
    setup() {
        const contenedor = ref(false);
        const registro = ref({
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        });
        const iniciarSesion = ref({
            email: '',
            password: '',
        })
        let urlBase = "https://api.repuestosangel.net/api/";
        const nuevoRegistro = async () => {
            if (registro.value.name != '' && registro.value.email != '' && registro.value.password != '' && registro.value.password_confirmation != '') {
                try {
                    const { data } = await axios.post(urlBase + 'usuario', registro.value);
                    registro.value = {
                        name: '',
                        email: '',
                        password: '',
                        password_confirmation: '',
                    }
                    contenedor.value = false;
                } catch (error) {
                    console.log(error);
                    alert('Revise los datos');
                }
            } else {
                alert('Debe llenar todos los campos');
            }
        }
        const login = async () => {
            try {
                let access_token = null;
                let usuario = null;
                const { data } = await axios.post(urlBase + 'login', iniciarSesion.value);
                access_token = data.access_token;
                usuario = data.user;
                localStorage.setItem('token', access_token);
                localStorage.setItem('usuario', JSON.stringify(usuario));
            } catch (error) {
                console.log(error);
            }
        }
        const logout = async () => {
            let token = localStorage.getItem('token');  //obtenemos el token almacenado desde el localStorage
            try {
                let post = {};  //enviamos un objeto vacio de relleno para la peticion POST
                const { data } = await axios.post(urlBase + 'logout', post, {
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    }
                }); //enviamos la peticion axios con el header configurado
                localStorage.removeItem('token'); 
                localStorage.removeItem('usuario'); //removemos el token y el usuario desde el localStorage
                alert('Sesion Finalizada'); //muestra una alerta nativa de js
            } catch (error) {
                console.log(error);
            }
        }
        return {
            contenedor,
            registro,
            nuevoRegistro,
            iniciarSesion,
            login,
            logout
        }
    }
}
</script>
<style>
@import '@/assets/style.css';
</style>