<template>
  <div class="container py-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando diseñadores...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
      {{ error }}
      <button @click="loadDisenadores" class="btn btn-sm btn-outline-danger ms-3">Reintentar</button>
    </div>

    <!-- Success state -->
    <div v-else>
      <h1 class="title mb-4">Diseñadores</h1>

      <div class="d-flex justify-content-end mb-4">
        <button class="btn btn-success" @click="showCreateForm">Crear Diseñador</button>
      </div>

      <div v-if="showTab === 'table'">
        <div v-if="disenadores.length === 0" class="alert alert-warning">
          No hay diseñadores disponibles.
        </div>
        <table v-else class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th class="text-danger">ID</th>
              <th>Nombre</th>
              <th>Nacionalidad</th>
              <th>Estilo</th>
              <th>Experiencia</th>
              <th class="d-flex justify-content-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="disenador in disenadores" :key="disenador._id">
              <td>{{ disenador._id }}</td>
              <td>{{ disenador.nombre }}</td>
              <td>{{ disenador.nacionalidad }}</td>
              <td>{{ disenador.estilo }}</td>
              <td>{{ disenador.experiencia }}</td>
              <td class="action-buttons d-flex justify-content-center gap-3">
                <button class="btn btn-warning btn-sm" @click="editDisenador(disenador)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteDisenador(disenador)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showTab === 'create'">
        <div class="container py-4 d-flex justify-content-center">
          <div class="card" style="width: 50rem;">
            <div class="card-body">
              <h1 class="title mb-4">Crear Diseñador</h1>
              <form @submit.prevent="createDisenador" class="needs-validation" novalidate>
                <div class="mb-3 row">
                  <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoDisenador.nombre"
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
                  <label for="nacionalidad" class="col-sm-2 col-form-label">Nacionalidad</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoDisenador.nacionalidad"
                      id="nacionalidad"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.nacionalidad }"
                      placeholder="Ingrese la nacionalidad"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.nacionalidad }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="estilo" class="col-sm-2 col-form-label">Estilo</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoDisenador.estilo"
                      id="estilo"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.estilo }"
                      placeholder="Ingrese el estilo"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.estilo }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="experiencia" class="col-sm-2 col-form-label">Experiencia</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoDisenador.experiencia"
                      id="experiencia"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.experiencia }"
                      placeholder="Ingrese la experiencia"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.experiencia }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="imagen" class="col-sm-2 col-form-label">Imagen</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoDisenador.imagen"
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

      <div v-if="showTab === 'edit' && disenadorEditado">
        <div class="container py-4 d-flex justify-content-center">
          <div class="card" style="width: 50rem;">
            <div class="card-body">
              <h1 class="title mb-4">Editar Diseñador</h1>
              <form @submit.prevent="updateDisenador" class="needs-validation" novalidate>
                <div class="mb-3 row">
                  <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="disenadorEditado.nombre"
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
                  <label for="nacionalidad" class="col-sm-2 col-form-label">Nacionalidad</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="disenadorEditado.nacionalidad"
                      id="nacionalidad"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.nacionalidad }"
                      placeholder="Ingrese la nacionalidad"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.nacionalidad }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="estilo" class="col-sm-2 col-form-label">Estilo</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="disenadorEditado.estilo"
                      id="estilo"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.estilo }"
                      placeholder="Ingrese el estilo"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.estilo }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="experiencia" class="col-sm-2 col-form-label">Experiencia</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="disenadorEditado.experiencia"
                      id="experiencia"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.experiencia }"
                      placeholder="Ingrese la experiencia"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.experiencia }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="imagen" class="col-sm-2 col-form-label">Imagen</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="disenadorEditado.imagen"
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

const API_URL = process.env.VUE_APP_API_URL || 'https://backend-kxrn.onrender.com';

export default {
  data() {
    return {
      disenadores: [],
      nuevoDisenador: {
        _id: '',
        nombre: '',
        nacionalidad: '',
        estilo: '',
        experiencia: '',
        imagen: ''
      },
      disenadorEditado: null,
      showTab: 'table',
      loading: false,
      error: null,
      formErrors: {
        nombre: '',
        nacionalidad: '',
        estilo: '',
        experiencia: '',
        imagen: ''
      }
    };
  },

  async created() {
    await this.loadDisenadores();
  },

  mounted() {},

  methods: {
    async loadDisenadores() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get(`${API_URL}/api/disenadores`);
        this.disenadores = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        this.error = 'Error al cargar diseñadores: ' + (error.response?.data?.message || error.message);
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
      this.nuevoDisenador = {
        _id: '',
        nombre: '',
        nacionalidad: '',
        estilo: '',
        experiencia: '',
        imagen: ''
      };
      this.clearFormErrors();
      this.error = null;
    },

    validateForm(disenador) {
      this.clearFormErrors();
      let isValid = true;

      if (!disenador.nombre.trim()) {
        this.formErrors.nombre = 'El nombre es requerido';
        isValid = false;
      }
      if (!disenador.nacionalidad.trim()) {
        this.formErrors.nacionalidad = 'La nacionalidad es requerida';
        isValid = false;
      }
      if (!disenador.estilo.trim()) {
        this.formErrors.estilo = 'El estilo es requerido';
        isValid = false;
      }
      if (!disenador.experiencia.trim()) {
        this.formErrors.experiencia = 'La experiencia es requerida';
        isValid = false;
      }
      if (!disenador.imagen.trim()) {
        this.formErrors.imagen = 'La imagen es requerida';
        isValid = false;
      }

      return isValid;
    },

    clearFormErrors() {
      this.formErrors = {
        nombre: '',
        nacionalidad: '',
        estilo: '',
        experiencia: '',
        imagen: ''
      };
    },

    async createDisenador() {
      if (!this.validateForm(this.nuevoDisenador)) return;

      try {
        this.loading = true;
        this.error = null;
        this.nuevoDisenador._id = (this.disenadores.length + 1).toString();
        const response = await axios.post(`${API_URL}/api/disenadores`, this.nuevoDisenador);
        this.disenadores.push(response.data);
        this.cancelCreate();
      } catch (error) {
        this.error = 'Error al crear diseñador: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    editDisenador(disenador) {
      this.disenadorEditado = { ...disenador };
      this.showTab = 'edit';
      this.clearFormErrors();
      this.error = null;
    },

    cancelEdit() {
      this.showTab = 'table';
      this.disenadorEditado = null;
      this.clearFormErrors();
      this.error = null;
    },

  async updateDisenador() {
  if (!this.disenadorEditado) {
    this.error = 'No hay diseñador seleccionado para editar.';
    return;
  }

  if (!this.validateForm(this.disenadorEditado)) {
    this.error = 'Por favor corrige los errores en el formulario.';
    return;
  }

  try {
    this.loading = true;
    this.error = null;

    const response = await axios.put(
      `${API_URL}/api/disenadores/${this.disenadorEditado._id}`,
      this.disenadorEditado
    );

    const index = this.disenadores.findIndex(d => d._id === response.data._id);
    if (index !== -1) {
      this.disenadores[index] = response.data;
    }
    this.cancelEdit();
  } catch (error) {
    this.error = 'Error al actualizar diseñador: ' + (error.response?.data?.message || error.message);
  } finally {
    this.loading = false;
  }
},


    async deleteDisenador(disenador) {
      if (!confirm(`¿Estás seguro de eliminar a ${disenador.nombre}?`)) {
        return;
      }
      try {
        this.loading = true;
        this.error = null;
        await axios.delete(`${API_URL}/api/disenadores/${disenador._id}`);
        this.disenadores = this.disenadores.filter(d => d._id !== disenador._id);
      } catch (error) {
        this.error = 'Error al eliminar diseñador: ' + (error.response?.data?.message || error.message);
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
</style>