import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Contactos from "../views/ContactsView.vue";
import ApiRick from "../views/ApiRickMortyView.vue";
import ProductosComponent from "../views/SistemaVentas/Productos.vue";
import FormularioComponent from "../views/SistemaVentas/Formulario.vue";
import VentasComponent from "../views/SistemaVentas/Ventas.vue";
import NuevaVentaComponent from "../views/SistemaVentas/Carrito.vue";
import PageNotFound from "../views/errors/404.vue";
import LayoutApp from "@/layout/LayoutApp.vue";
import LoginPage from "@/views/Auth/LoginPage.vue"

const routes = [
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: "/",
    component: LayoutApp,
    children: [
      {
        path: "/home",
        name: "home",
        component: HomeView,
      },
      {
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("../views/AboutView.vue"),
      },
      {
        path: "/contactos",
        name: "contactos",
        component: Contactos,
      },
      {
        path: "/api-rick",
        component: ApiRick,
      },
      {
        path: "/productos",
        name: "productos",
        component: ProductosComponent,
      },
      {
        path: "/formulario/:idProducto?",
        name: "formulario",
        component: FormularioComponent,
      },
      {
        path: "/ventas",
        name: "ventas",
        component: VentasComponent,
      },
      {
        path: "/nuevaVenta",
        component: NuevaVentaComponent,
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
