<template>
  <footer class="app-footer">
    <p>&copy; 2024 Automóviles Superdeportivos. Todos los derechos reservados.</p>
  
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #1B1B1B;
  color: white;
  padding: 20px 10px; 
  text-align: center;
  font-size: 1rem; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-top: 2px solid #FF8C00;
  flex-wrap: wrap; 
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem; 
  text-align: center;
  flex: 1;
}

@media (max-width: 768px) {
  .app-footer {
    flex-direction: column; 
    align-items: center; 
    padding: 20px 0; 
  }

  .app-footer p {
    margin-bottom: 10px; 
    text-align: center; 
  }

  
}
</style>
