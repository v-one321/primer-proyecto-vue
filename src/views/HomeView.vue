<template>
  <div class="home">
    <div class="container">

      <div class="row">
        <div class="col-md-12 m-1">
          <h2>Bienvenido {{ usuario.name }}</h2>
        </div>

        <div class="col-md-3">
          <div class="card card-primary card-outline">
            <div class="card-body">
              <div class="text-center">
                <img :src="'https://ui-avatars.com/api/?background=cef2ef&color=00685f&name=' + usuario.name" alt=""
                  class="rounded-circle border border-dark">
                  <h4 class="mt-2">{{ usuario.name }}</h4>
                  <h6 class="text-muted">Dev. Fullstack</h6>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <b>Email: </b> {{ usuario.email }}
                </li>
                <li class="list-group-item">
                  <b>Estado: </b> 
                  <span v-if="(usuario.estado == 1)" class="badge bg-success">Activo</span>
                  <span v-else class="badge bg-danger">Inactivo</span>
                </li>
                <li class="list-group-item">
                  <b>Fecha registro:</b> {{ new Date(usuario.created_at).toLocaleDateString('es-BO', { weekday:"long", year:"numeric", month:"long", day:"numeric", hour:"numeric", minute:"numeric"}) }}
                </li>
                <li class="list-group-item">
                  <div class="d-grid">
                    <button @click="mostrarPerfil()" class="btn btn-primary">Actualizar datos</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter} from 'vue-router';

export default {
    setup() {
      const router  = useRouter();
      const usuario = ref({});

      onMounted(() => {
        // verificar si existe usuario y token en el localStorage
        let usuarioStorage = localStorage.getItem('usuario');
        let token = localStorage.getItem('token');
        if(usuarioStorage == null && token == null){
            router.push('/login');
        }
        usuario.value = JSON.parse(usuarioStorage);
      });

      const mostrarPerfil = () => {
        router.push('/perfil');
      }


      return {
        usuario,
        mostrarPerfil
      }
    }
}
</script>

<style scoped>
  .card-primary.card-outline {
      border-top: 3px solid #007bff;
  }
</style>
