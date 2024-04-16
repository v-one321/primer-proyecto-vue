<template>
    <div class="container-fluid d-flex justify-content-center">
        <div class="row">
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <h1>404</h1>
                    <p>La pagina no existe 😥</p>
                    <router-link class="btn btn-primary btn-lg" :to="'/productos'">Volver a la pagina principal</router-link>
                </div>
                <img src="https://th.bing.com/th/id/OIP.yYBFzWZ0R970KK2bJhwO9AHaEi?rs=1&pid=ImgDetMain" style="width: 100%; " alt="">
            </div>
        </div>
    </div>
</template>