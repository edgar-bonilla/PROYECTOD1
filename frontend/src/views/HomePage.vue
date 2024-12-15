<template>
  <div class="home-page d-flex justify-content-center align-items-center vh-100 p-0">

    <div class="d-flex justify-content-center gap-3 w-100" style="max-width: 900px;">
      <div class="card custom-card text-center p-4 cursor-pointer shadow-lg" @click="navigateTo('/automoviles')">
        <h2 class="text-warning mb-3">Automóviles</h2>
        <p class="text-white">Explora la colección completa de automóviles superdeportivos.</p>
      </div>

      <div class="card custom-card text-center p-4 cursor-pointer shadow-lg" @click="navigateTo('/fabricantes')">
        <h2 class="text-warning mb-3">Fabricantes</h2>
        <p class="text-white">Conoce las marcas icónicas que producen estos vehículos.</p>
      </div>

      <div class="card custom-card text-center p-4 cursor-pointer shadow-lg" @click="navigateTo('/diseñadores')">
        <h2 class="text-warning mb-3">Diseñadores</h2>
        <p class="text-white">Descubre a los visionarios detrás de cada diseño impresionante.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.custom-card {
  background-color: #222; 
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.custom-card:hover {
  background-color: #FF8C00; 
  transform: translateY(-8px); 
}

.custom-card h2, .custom-card p {
  transition: color 0.3s ease;
}

.custom-card:hover h2, .custom-card:hover p {
  color: white; 
}
</style>
