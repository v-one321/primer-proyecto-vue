<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-md-3 p-1">
                    <div class="card card-primary card-outline">
                        <div class="card-body">
                            <div class="text-center">

                                <img v-if="usuario.foto_perfil != null" :src="usuario.foto_perfil" alt="" style="width: 150px; height: 150px;">

                                <img v-else :src="'https://ui-avatars.com/api/?background=cef2ef&color=00685f&name=' +
                                    usuario.name
                                    " alt="" class="rounded-circle border border-dark" />
                                <h4 class="mt-2">{{ usuario.name }}</h4>
                                <h6 class="text-muted">Dev. Fullstack</h6>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><b>Email: </b> {{ usuario.email }}</li>
                                <li class="list-group-item">
                                    <b>Estado: </b>
                                    <span v-if="usuario.estado == 1" class="badge bg-success">Activo</span>
                                    <span v-else class="badge bg-danger">Inactivo</span>
                                </li>
                                <li class="list-group-item">
                                    <b>Fecha registro:</b>
                                    {{
                                    new Date(usuario.created_at).toLocaleDateString("es-BO", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    })
                                }}
                                </li>
                                <li class="list-group-item">
                                    <b>Fecha actualizacion:</b>
                                    {{
                                        new Date(usuario.updated_at).toLocaleDateString("es-BO", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                    minute: "numeric",
                                    })
                                    }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-md-9 p-1">
                    <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true">
                                Actualizar datos
                            </button>
                            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                                aria-selected="false">
                                Cambiar foto
                            </button>
                        </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                        <div class="tab-pane fade show active" id="nav-home" role="tabpanel"
                            aria-labelledby="nav-home-tab">
                            <!-- Formulario para actualizar datos: name, email, password, password_confirmation -->

                            <div v-show="mensaje != null" class="alert alert-success m-1" role="alert">
                                {{ mensaje }}
                            </div>

                            <div class="form-group mb-2">
                                <label for="nombre">Nombre</label>
                                <input type="text" v-model="nombre" class="form-control" />
                            </div>
                            <div class="form-group mb-2">
                                <label for="email">Email</label>
                                <input type="email" v-model="email" class="form-control" />
                            </div>

                            <div class="row mb-2">
                                <div class="col">
                                    <div class="form-group">
                                        <label for="password">Contraseña</label>
                                        <input type="password" v-model="password" class="form-control" />
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="form-group">
                                        <label for="password_confirmation">Confirmar contraseña</label>
                                        <input type="password" v-model="password_confirmation" class="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div class="text-center mt-3">
                                <button type="button" @click="actualizar()" class="btn btn-primary">
                                    Actualizar datos
                                </button>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">

                            <div class="form-grou">
                                <label for="imagen">Foto de perfil</label>
                                <input type="file" id="imagen" @change="subirImagen($event)" class="form-control">
                            </div>

                            <div class="text-center">
                                <img :src="urlImagen" class="border border-dark rounded-circle" alt="Img" style="width: 150px; height: 150px;">
                            </div>

                            <div class="text-center mt-3">
                                <button type="button" @click="actualizarFoto()" class="btn btn-primary">Actualizar foto</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
    setup() {
        const router = useRouter();
        const usuario = ref({});
        const nombre = ref("");
        const email = ref("");
        const password = ref("");
        const password_confirmation = ref("");
        let urlBase = "https://api.repuestosangel.net/";
        const mensaje = ref(null);
        // para url de la imagen
        const imagen = ref(null);
        const urlImagen = ref(null);

        onMounted(() => {
            // verificar si existe usuario y token en el localStorage
            let usuarioStorage = localStorage.getItem("usuario");
            let token = localStorage.getItem("token");
            if (usuarioStorage == null && token == null) {
                router.push("/login");
            }
            usuario.value = JSON.parse(usuarioStorage);

            nombre.value = usuario.value.name;
            email.value = usuario.value.email;
        });

        const actualizar = async () => {
            if (
                nombre.value == null &&
                email.value == null &&
                password.value == null &&
                password_confirmation.value == null
            ) {
                alert("Todos los campos son requeridos");
                return;
            }

            if (password.value != password_confirmation.value) {
                alert("Las contraseñas no coinciden");
                return;
            }

            // armamos el objeto para la peticion
            let objeto = {
                name: nombre.value,
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value,
            };

            let token = localStorage.getItem("token");

            // cabecera de la peticion
            let cabecera = {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            };

            try {
                const { data } = await axios.put(
                    urlBase + "api/usuario/" + usuario.value.id,
                    objeto,
                    { headers: cabecera }
                );

                mensaje.value = data.mensaje;
                setTimeout(() => {
                    mensaje.value = null;
                }, 5000);

                // console.log(data);

                // actualizar los datos del localStorage
                let usuarioStorage = localStorage.getItem("usuario");
                let user = JSON.parse(usuarioStorage);
                user.name = nombre.value;
                user.email = email.value;
                localStorage.setItem("usuario", JSON.stringify(user));

                usuario.value.name = nombre.value;
                usuario.value.email = email.value;
            } catch (error) {
                console.log(error);
            }
        };

        // subirImagen
        const subirImagen = async (event) => {
            console.log(event.target.files);
            // obtener los archivos del input
            let archivo = event.target.files[0];
            if(archivo != null){
                imagen.value = archivo;
                const reader = new FileReader();
                reader.onload = (e) => {
                    urlImagen.value = e.target.result;
                };
                reader.readAsDataURL(archivo);
            }
        }

        // actualizarFoto  
        const actualizarFoto = async () => {
            const formData = new FormData();
            formData.append('imagen', imagen.value);
            formData.append('id', usuario.value.id);

            let token = localStorage.getItem("token");

            // cabecera de la peticion
            let cabecera = {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
            };

            const { data } = await axios.post(urlBase + 'api/actualizar-imagen', formData, { headers: cabecera });
            console.log(data);
            
            usuario.value.foto_perfil = urlImagen.value;

        }

        return {
            usuario,
            nombre,
            email,
            password,
            password_confirmation,
            actualizar,
            mensaje,

            urlImagen,
            subirImagen,
            actualizarFoto
        };
    },
};
</script>

<style scoped>
.card-primary.card-outline {
    border-top: 3px solid #007bff;
}
</style>
