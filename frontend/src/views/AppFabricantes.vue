<template>
  <div class="container py-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando fabricantes...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
      {{ error }}
      <button @click="loadFabricantes" class="btn btn-sm btn-outline-danger ms-3">Reintentar</button>
    </div>

    <!-- Success state -->
    <div v-else>
      <h1 class="title mb-4">Fabricantes</h1>

      <div class="d-flex justify-content-end mb-4">
        <button class="btn btn-success" @click="showCreateForm">Crear Fabricante</button>
      </div>

      <div v-if="showTab === 'table'">
        <div v-if="fabricantes.length === 0" class="alert alert-warning">
          No hay fabricantes disponibles.
        </div>
        <table v-else class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th class="text-danger">ID</th>
              <th>Nombre</th>
              <th>País</th>
              <th>Año de Fundación</th>
              <th>Número de Empleados</th>
              <th>Sede Principal</th>
              <th class="d-flex justify-content-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fabricante in fabricantes" :key="fabricante._id">
              <td>{{ fabricante._id }}</td>
              <td>{{ fabricante.nombre }}</td>
              <td>{{ fabricante.pais }}</td>
              <td>{{ fabricante.anio_fundacion }}</td>
              <td>{{ fabricante.num_empleados }}</td>
              <td>{{ fabricante.sede_principal }}</td>
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
                    <input
                      type="text"
                      v-model.trim="nuevoFabricante.nombre"
                      id="nombre"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.nombre }"
                      placeholder="Ingrese el nombre"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.nombre }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="pais" class="col-sm-2 col-form-label">País</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoFabricante.pais"
                      id="pais"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.pais }"
                      placeholder="Ingrese el país"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.pais }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="anio_fundacion" class="col-sm-2 col-form-label">Año de Fundación</label>
                  <div class="col-sm-7">
                    <input
                      type="number"
                      v-model.number="nuevoFabricante.anio_fundacion"
                      id="anio_fundacion"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.anio_fundacion }"
                      placeholder="Ingrese el año de fundación"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.anio_fundacion }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="num_empleados" class="col-sm-2 col-form-label">Número de Empleados</label>
                  <div class="col-sm-7">
                    <input
                      type="number"
                      v-model.number="nuevoFabricante.num_empleados"
                      id="num_empleados"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.num_empleados }"
                      placeholder="Ingrese el número de empleados"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.num_empleados }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="sede_principal" class="col-sm-2 col-form-label">Sede Principal</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoFabricante.sede_principal"
                      id="sede_principal"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.sede_principal }"
                      placeholder="Ingrese la sede principal"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.sede_principal }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="imagen" class="col-sm-2 col-form-label">Imagen</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoFabricante.imagen"
                      id="imagen"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.imagen }"
                      placeholder="Ingrese el nombre del archivo de imagen"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.imagen }}</div>
                  </div>
                </div>
                <div class="d-flex gap-3">
                  <button type="submit" class="btn btn-primary" :disabled="loading">Crear</button>
                  <button type="button" class="btn btn-secondary" @click="cancelCreate" :disabled="loading">
                    Cancelar
                  </button>
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
                    <input
                      type="text"
                      v-model.trim="fabricanteEditado.nombre"
                      id="nombre"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.nombre }"
                      placeholder="Ingrese el nombre"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.nombre }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="pais" class="col-sm-2 col-form-label">País</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="fabricanteEditado.pais"
                      id="pais"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.pais }"
                      placeholder="Ingrese el país"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.pais }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="anio_fundacion" class="col-sm-2 col-form-label">Año de Fundación</label>
                  <div class="col-sm-7">
                    <input
                      type="number"
                      v-model.number="fabricanteEditado.anio_fundacion"
                      id="anio_fundacion"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.anio_fundacion }"
                      placeholder="Ingrese el año de fundación"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.anio_fundacion }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="num_empleados" class="col-sm-2 col-form-label">Número de Empleados</label>
                  <div class="col-sm-7">
                    <input
                      type="number"
                      v-model.number="fabricanteEditado.num_empleados"
                      id="num_empleados"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.num_empleados }"
                      placeholder="Ingrese el número de empleados"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.num_empleados }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="sede_principal" class="col-sm-2 col-form-label">Sede Principal</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="fabricanteEditado.sede_principal"
                      id="sede_principal"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.sede_principal }"
                      placeholder="Ingrese la sede principal"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.sede_principal }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="imagen" class="col-sm-2 col-form-label">Imagen</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="fabricanteEditado.imagen"
                      id="imagen"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.imagen }"
                      placeholder="Ingrese el nombre del archivo de imagen"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.imagen }}</div>
                  </div>
                </div>
                <div class="d-flex gap-3">
                  <button type="submit" class="btn btn-primary" :disabled="loading">Actualizar</button>
                  <button type="button" class="btn btn-secondary" @click="cancelEdit" :disabled="loading">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';

export default {
  data() {
    return {
      fabricantes: [],
      nuevoFabricante: {
        _id: '',
        nombre: '',
        pais: '',
        anio_fundacion: null,
        num_empleados: null,
        sede_principal: '',
        imagen: ''
      },
      fabricanteEditado: null,
      showTab: 'table',
      loading: false,
      error: null,
      formErrors: {
        nombre: '',
        pais: '',
        anio_fundacion: '',
        num_empleados: '',
        sede_principal: '',
        imagen: ''
      }
    };
  },

  async mounted() {
    await this.loadFabricantes();
  },

  methods: {
    async loadFabricantes() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get(`${API_URL}/api/fabricantes`);
        this.fabricantes = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        this.error = 'Error al cargar fabricantes: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    showCreateForm() {
      this.showTab = 'create';
      this.clearFormErrors();
    },

    cancelCreate() {
      this.showTab = 'table';
      this.nuevoFabricante = {
        _id: '',
        nombre: '',
        pais: '',
        anio_fundacion: null,
        num_empleados: null,
        sede_principal: '',
        imagen: ''
      };
      this.clearFormErrors();
    },

    validateForm(fabricante) {
      this.clearFormErrors();
      let isValid = true;
      const currentYear = new Date().getFullYear();
      const imageRegex = /\.(jpeg|jpg|png|webp|gif)$/i;

      if (!fabricante.nombre.trim()) {
        this.formErrors.nombre = 'El nombre es requerido';
        isValid = false;
      }

      if (!fabricante.pais.trim()) {
        this.formErrors.pais = 'El país es requerido';
        isValid = false;
      }

      if (!fabricante.anio_fundacion || isNaN(fabricante.anio_fundacion) || fabricante.anio_fundacion < 1800 || fabricante.anio_fundacion > currentYear) {
        this.formErrors.anio_fundacion = `Ingrese un año válido entre 1800 y ${currentYear}`;
        isValid = false;
      }

      if (
        !fabricante.num_empleados ||
        isNaN(fabricante.num_empleados) ||
        !Number.isInteger(fabricante.num_empleados) ||
        fabricante.num_empleados < 1
      ) {
        this.formErrors.num_empleados = 'Ingrese un número entero válido mayor a 0';
        isValid = false;
      }

      if (!fabricante.sede_principal.trim()) {
        this.formErrors.sede_principal = 'La sede principal es requerida';
        isValid = false;
      }

      if (!fabricante.imagen.trim()) {
        this.formErrors.imagen = 'La URL de la imagen es requerida';
        isValid = false;
      } else if (!imageRegex.test(fabricante.imagen.trim())) {
        this.formErrors.imagen = 'La imagen debe ser una URL válida (.jpg, .png, .webp, etc.)';
        isValid = false;
      }

      return isValid;
    },

    clearFormErrors() {
      this.formErrors = {
        nombre: '',
        pais: '',
        anio_fundacion: '',
        num_empleados: '',
        sede_principal: '',
        imagen: ''
      };
    },

    async createFabricante() {
      if (!this.validateForm(this.nuevoFabricante)) return;

      try {
        this.loading = true;
        this.error = null;
        this.nuevoFabricante._id = (this.fabricantes.length + 1).toString();
        const response = await axios.post(`${API_URL}/api/fabricantes`, this.nuevoFabricante);
        this.fabricantes.push(response.data);
        this.cancelCreate();
      } catch (error) {
        this.error = 'Error al crear fabricante: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    editFabricante(fabricante) {
      this.fabricanteEditado = {
        ...fabricante,
        anio_fundacion: Number(fabricante.anio_fundacion),
        num_empleados: Number(fabricante.num_empleados)
      };
      this.showTab = 'edit';
      this.clearFormErrors();
    },

    cancelEdit() {
      this.showTab = 'table';
      this.fabricanteEditado = null;
      this.clearFormErrors();
    },

    async updateFabricante() {
      if (!this.validateForm(this.fabricanteEditado)) return;

      try {
        this.loading = true;
        this.error = null;
        const response = await axios.put(
          `${API_URL}/api/fabricantes/${this.fabricanteEditado._id}`,
          this.fabricanteEditado
        );
        const index = this.fabricantes.findIndex(f => f._id === response.data._id);
        if (index !== -1) {
          this.fabricantes[index] = response.data;
        }
        this.cancelEdit();
      } catch (error) {
        this.error = 'Error al actualizar fabricante: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    async deleteFabricante(fabricante) {
      if (!confirm(`¿Estás seguro de eliminar ${fabricante.nombre}?`)) return;

      try {
        this.loading = true;
        this.error = null;
        await axios.delete(`${API_URL}/api/fabricantes/${fabricante._id}`);
        this.fabricantes = this.fabricantes.filter(f => f._id !== fabricante._id);
      } catch (error) {
        this.error = 'Error al eliminar fabricante: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>


<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  color: #0a0a0a;
  text-align: center;
}

.table-dark th {
  background-color: #333;
  color: white;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.alert {
  margin: 20px auto;
  max-width: 600px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  visibility: visible !important;
}

th,
td {
  padding: 10px;
  text-align: left;
}

form input {
  padding: 5px;
  margin: 10px 0;
  width: 100%;
  max-width: 300px;
}

form button {
  padding: 10px;
  border: none;
  cursor: pointer;
}

button.active {
  background-color: #4CAF50;
  color: white;
}

.alert-danger {
  max-width: 600px;
  margin: 0 auto;
}
</style>