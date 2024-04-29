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
                    <input type="email" placeholder="Email" class="border-danger" v-model="iniciarSesion.email">
                    <small class="text-danger" v-show="errores.email">{{ errores.email }}</small>
                    <input type="password" placeholder="Password" v-model="iniciarSesion.password" >                    
                    <small class="text-danger" v-show="errores.password">{{ errores.password }}</small>
                    <a href="#" class="fp">Recuperar contraseña?</a>
                    <button type="button" @click="login">Ingresar</button>
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
import { ref, onMounted } from 'vue';
import { useRouter} from 'vue-router';
export default {
    setup() {
        const router  = useRouter();
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
        // let urlBase = "https://api.repuestosangel.net/api/";
        let urlBase = "http://hamilobackuno.test/api/";
        const errores = ref({});
        onMounted(() => {
            // verificar si existe el usuario y el token en el localStorage
            let usuario = localStorage.getItem('usuario');
            let token = localStorage.getItem('token');
            if(usuario != null && token != null){
                router.push('/home');
            }
        });

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

                // verificar usuario y redireccionar a /home
                if(usuario != null && access_token !=null){
                    router.push('/home');
                }
            } catch (error) {
                if(error.response.status == 422){
                    errores.value = error.response.data.errors;
                    console.log(errores.value.email)
                }else if(error.response.status == 401){
                    alert(error.response.data.mensaje);
                }
            }
        }
        return {
            contenedor,
            registro,
            nuevoRegistro,
            iniciarSesion,
            login,
            errores
        }
    }
}
</script>
<style>
@import '@/assets/style.css';

.text-danger{
  color: red;
}
</style>