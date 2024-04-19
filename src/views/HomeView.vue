<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <div class="alert alert-info text-center">
          <span class="h4">Bienvenido: {{ usuario.name }}</span>
        </div>
      </div>
      <div class="col-12 col-md-3 mb-4">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="row">
              <div class="col-md-7">
                <span>Total ventas</span><br><b>{{ totales.total_ventas }}</b>
              </div>
              <div class="col-md-5 text-center">
                <i class="fas fa-shopping-cart" style="font-size: 3em;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3 mb-4">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="row">
              <div class="col-md-7">
                <span>Total compras</span><br><b>{{ totales.total_compras }}</b>
              </div>
              <div class="col-md-5 text-center">
                <i class="fas fa-cart-plus" style="font-size: 3em;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3 mb-4">
        <div class="card bg-secondary text-white">
          <div class="card-body">
            <div class="row">
              <div class="col-md-7">
                <span>Total Prductos</span><br><b>{{ totales.total_productos }}</b>
              </div>
              <div class="col-md-5 text-center">
                <i class="fas fa-box" style="font-size: 3em;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3 mb-4">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="row">
              <div class="col-md-7">
                <span>Total Clientes</span><br><b>{{ totales.total_clientes }}</b>
              </div>
              <div class="col-md-5 text-center">
                <i class="fas fa-users" style="font-size: 3em;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-4">
        <div class="card card-primary card-outline">
          <div class="card-header"> <!--mr-->
            <h4 class="card-title"><i class="fas fa-cart-plus me-2"></i>Total Compras</h4>
          </div>
          <div class="card-body">
            <Bar id="my-chart-id" :options="barOptions" :data="barData" style="width: 100%;" />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-4">
        <div class="card card-primary card-outline">
          <div class="card-header">
            <h4 class="card-title"><i class="fas fa-shopping-cart me-2"></i>Total Ventas</h4>
          </div>
          <div class="card-body">
            <Pie :data="pieData" :options="pieOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)
export default {
  name: 'BarChart',
  components: { Bar, Pie },
  setup() {
    const totales = ref({});
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('usuario'));
    const usuario = ref(user);
    const pieData = ref({
      labels: [],
      datasets: [
        {
          label: 'Total Ventas',
          backgroundColor: [],
          data: []
        }
      ]
    });
    const pieOptions = ref({
      responsive: true,
      maintainAspectRatio: false
    });
    const barData = ref({
      labels: [],
      datasets: [{
        label: 'Total Compras',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    })
    const barOptions = ref({
      responsive: true
    })
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
    onMounted(() => {
      dashboard();

    });
    const dashboard = async () => {
      let dataTorta = [];
      let labelTorta = [];
      let colorTorta = [];
      let dataBarra = [];
      let labelBarra = [];
      let colorBarra = [];
      let bordeBarra = [];
      try {
        const { data } = await axios.get('https://api.repuestosangel.net/api/dashboard', { headers });
        totales.value = {
          total_ventas: data.total_ventas,
          total_compras: data.total_compras,
          total_productos: data.total_productos,
          total_clientes: data.total_clientes,
          total_proveedores: data.total_prorveedores
        }
        data.chartVentas.forEach(item => {
          dataTorta.push(item.total_ventas);
          labelTorta.push(item.nombre_producto);
          let aleatorio = Math.floor(Math.random() * 0xFFFFFF);
          colorTorta.push('#' + aleatorio.toString(16).padStart(6, 0));
        });
        pieData.value = {
          labels: labelTorta,
          datasets: [
            {
              label: 'Total Ventas',
              backgroundColor: colorTorta,
              data: dataTorta,
              hoverOffset: 5
            }
          ]
        };
        data.chartCompras.forEach(item => {
          dataBarra.push(item.total_compras);
          labelBarra.push(item.nombre_producto);
          let aleatorio = Math.floor(Math.random() * 0xFFFFFF);
          colorBarra.push('#' + aleatorio.toString(16).padStart(6, 0));
          let borde = Math.floor(Math.random() * 0xFFFFFF);
          bordeBarra.push('#' + borde.toString(16).padStart(6, 0));
        });
        barData.value = {
          labels: labelBarra,
          datasets: [{
            label: 'Total Compras',
            data: dataBarra,
            backgroundColor: colorBarra,
            borderColor: bordeBarra,
            borderWidth: 3
          }]
        }
      } catch (error) {
        console.log(error);
      }
    }
    return {
      totales,
      barData,
      barOptions,
      pieData,
      pieOptions,
      usuario
    }
  }
}
</script>

<style scoped>
.card-primary.card-outline {
  border-top: 3px solid #007bff;
}
</style>
