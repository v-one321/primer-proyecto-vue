<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body mb-3" data-bs-theme="dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/home">Navbar</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/home">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">About</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/contactos">Contactos</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/api-rick">Rick y Morty</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Sistema de Ventas
                        </a>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/productos">Productos</router-link></li>
                            <li><router-link class="dropdown-item" to="/ventas">Ventas</router-link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container d-flex justify-content-end mb-4">
        <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page">Library</li>
            </ol>
        </nav>
    </div>

    <!-- ABRE CONTENIDO DE LAS VISTAS-->
    <router-view />
    <!-- CIERRA CONTENIDO DE LAS VISTAS-->
</template>