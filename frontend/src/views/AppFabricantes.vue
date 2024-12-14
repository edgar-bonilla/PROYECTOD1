<template>
  <div class="container py-4">
    <h1 class="title mb-4">Fabricantes</h1>

    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-success" @click="showCreateForm">Crear Fabricante</button>
    </div>

    <div v-if="showTab === 'table'">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th class="text-danger">ID</th>
            <th>Nombre</th>
            <th>País</th>
            <th>Año de Fundación</th>
            <th class="d-flex justify-content-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fabricante in fabricantes" :key="fabricante.id">
            <td>{{ fabricante.id }}</td>
            <td>{{ fabricante.nombre }}</td>
            <td>{{ fabricante.pais }}</td>
            <td>{{ fabricante.anio_fundacion }}</td>
            <td class="action-buttons d-flex justify-content-center gap-3">
              <button class="btn btn-warning btn-sm" @click="editFabricante(fabricante)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="deleteFabricante(fabricante)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showTab === 'create'">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Crear Fabricante</h1>

            <form @submit.prevent="createFabricante" class="needs-validation" novalidate>
              <div class="mb-3 row">
                <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoFabricante.nombre" id="nombre" class="form-control"
                    placeholder="Ingrese el nombre" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="pais" class="col-sm-2 col-form-label">País</label>
                <div class="col-sm-7">
                  <input type="text" v-model="nuevoFabricante.pais" id="pais" class="form-control"
                    placeholder="Ingrese el país" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="anio_fundacion" class="col-sm-2 col-form-label">Año de Fundación</label>
                <div class="col-sm-7">
                  <input type="number" v-model="nuevoFabricante.anio_fundacion" id="anio_fundacion" class="form-control"
                    placeholder="Ingrese el año de fundación" required />
                </div>
              </div>
              <div class="d-flex gap-3">
                <button type="submit" class="btn btn-primary">Crear</button>
                <button type="button" class="btn btn-secondary" @click="cancelCreate">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTab === 'edit' && fabricanteEditado">
      <div class="container py-4 d-flex justify-content-center">
        <div class="card" style="width: 50rem;">
          <div class="card-body">
            <h1 class="title mb-4">Editar Fabricante</h1>

            <form @submit.prevent="updateFabricante" class="needs-validation" novalidate>
              <div class="mb-3 row">
                <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                <div class="col-sm-7">
                  <input type="text" v-model="fabricanteEditado.nombre" id="nombre" class="form-control"
                    placeholder="Ingrese el nombre" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="pais" class="col-sm-2 col-form-label">País</label>
                <div class="col-sm-7">
                  <input type="text" v-model="fabricanteEditado.pais" id="pais" class="form-control"
                    placeholder="Ingrese el país" required />
                </div>
              </div>
              <div class="mb-3 row">
                <label for="anio_fundacion" class="col-sm-2 col-form-label">Año de Fundación</label>
                <div class="col-sm-7">
                  <input type="number" v-model="fabricanteEditado.anio_fundacion" id="anio_fundacion" class="form-control"
                    placeholder="Ingrese el año de fundación" required />
                </div>
              </div>
              <div class="d-flex gap-3">
                <button type="submit" class="btn btn-primary">Actualizar</button>
                <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fabricantes: [],
      nuevoFabricante: { nombre: '', pais: '', anio_fundacion: '' },
      fabricanteEditado: null,
      showTab: 'table',
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:3000/api/fabricantes');
      this.fabricantes = await response.json();
    } catch (error) {
      console.error("Error al obtener los fabricantes:", error);
    }
  },
  methods: {
    showCreateForm() {
      this.showTab = 'create';
    },
    cancelCreate() {
      this.showTab = 'table';
      this.nuevoFabricante = { nombre: '', pais: '', anio_fundacion: '' }; 
    },
    async createFabricante() {
      try {
        const response = await fetch('http://localhost:3000/api/fabricantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.nuevoFabricante),
        });

        const newFabricante = await response.json();
        this.fabricantes.push(newFabricante);
        this.cancelCreate();
      } catch (error) {
        console.error('Error al crear el fabricante:', error);
      }
    },
    async editFabricante(fabricante) {
      this.fabricanteEditado = { ...fabricante };
      this.showTab = 'edit';
    },
    cancelEdit() {
      this.showTab = 'table';
      this.fabricanteEditado = null; 
    },
    async updateFabricante() {
      try {
        const response = await fetch(`http://localhost:3000/api/fabricantes/${this.fabricanteEditado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.fabricanteEditado),
        });

        const updatedFabricante = await response.json();
        const index = this.fabricantes.findIndex(f => f.id === updatedFabricante.id);
        if (index !== -1) {
          this.fabricantes[index] = updatedFabricante;
        }
        this.cancelEdit();
      } catch (error) {
        console.error('Error al actualizar el fabricante:', error);
      }
    },
    async deleteFabricante(fabricante) {
      try {
        await axios.delete(`http://localhost:3000/api/fabricantes/${fabricante.id}`);
          this.fabricantes = this.fabricantes.filter(a => a.id !== fabricante.id);
      } catch (error) {
        console.error('Error de red al eliminar el fabricante:', error);
      }
    },
  },
};
</script>


<style scoped>
.container {
  max-width: 1200px;
}

button.active {
  background-color: #4CAF50;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

form {
  margin: 20px 0;
}

form input {
  padding: 5px;
  margin: 10px 0;
  width: 100%;
  max-width: 300px;
}

form button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.card-body {
  padding: 20px;
}
</style>
