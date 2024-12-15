<template>
  <header class="app-header">
    <div class="logo">
      <nav>
      <ul>
        <li class=""><a href="/">Inicio</a></li>
      
      </ul>
    </nav>
    </div>
    <nav>
      <ul>
       
        <li><a href="/automoviles">Automóviles</a></li>
        <li><a href="/fabricantes">Fabricantes</a></li>
        <li><a href="/disenadores">Diseñadores</a></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #1B1B1B; 
  color: white;
  padding: 20px 30px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 3px solid #FF8C00; 
  box-sizing: border-box;
}
nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav ul li {
  margin: 0 25px; 
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  transition: color 0.3s ease, transform 0.3s ease; 
}

nav ul li a:hover {
  color: #FF8C00; 
  transform: scale(1.1); 
}

</style>
