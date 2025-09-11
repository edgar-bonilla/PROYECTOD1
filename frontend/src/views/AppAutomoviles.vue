<template>
  <div class="container py-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando autos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center">
      {{ error }}
      <button @click="loadAllData" class="btn btn-sm btn-outline-danger ms-3">Reintentar</button>
    </div>

    <!-- Success state -->
    <div v-else>
      <h1 class="title mb-4">Autos</h1>

      <div v-if="fabricantes.length === 0 || disenadores.length === 0" class="alert alert-warning">
        No se pueden crear o editar autos porque no hay fabricantes o diseñadores disponibles.
      </div>

      <div class="d-flex justify-content-end mb-4">
        <button
          class="btn btn-success"
          @click="showCreateForm"
          :disabled="fabricantes.length === 0 || disenadores.length === 0"
        >
          Crear Auto
        </button>
      </div>

      <div v-if="showTab === 'table'">
        <div v-if="autos.length === 0" class="alert alert-warning">
          No hay autos disponibles.
        </div>
        <table v-else class="table table-bordered table-hover">
          <thead class="table-dark">
            <tr>
              <th class="text-danger">ID</th>
              <th>Nombre</th>
              <th>Año</th>
              <th>Velocidad Máxima</th>
              <th>Fabricante</th>
              <th>Diseñador</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="auto in autos" :key="auto._id">
              <td>{{ auto._id }}</td>
              <td>{{ auto.nombre || 'Sin nombre' }}</td>
              <td>{{ auto.año || 'Sin año' }}</td>
              <td>{{ auto.velocidad_maxima || 'Sin velocidad' }}</td>
              <td>{{ getFabricanteName(auto.fabricante_id) }}</td>
              <td>{{ getDisenadorName(auto.disenador_id) }}</td>
              <td class="action-buttons d-flex justify-content-center gap-3">
                <button
                  class="btn btn-warning btn-sm"
                  @click="editAuto(auto)"
                  :disabled="fabricantes.length === 0 || disenadores.length === 0"
                >
                  Editar
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteAuto(auto)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showTab === 'create'">
        <div class="container py-4 d-flex justify-content-center">
          <div class="card" style="width: 50rem;">
            <div class="card-body">
              <h1 class="title mb-4">Crear Auto</h1>
              <form @submit.prevent="createAuto" class="needs-validation" novalidate>
                <div class="mb-3 row">
                  <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoAuto.nombre"
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
                  <label for="año" class="col-sm-2 col-form-label">Año</label>
                  <div class="col-sm-7">
                    <input
                      type="number"
                      v-model.number="nuevoAuto.año"
                      id="año"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.año }"
                      placeholder="Ingrese el año"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.año }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="velocidad_maxima" class="col-sm-2 col-form-label">Velocidad Máxima</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoAuto.velocidad_maxima"
                      id="velocidad_maxima"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.velocidad_maxima }"
                      placeholder="Ingrese la velocidad máxima"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.velocidad_maxima }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="potencia" class="col-sm-2 col-form-label">Potencia</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoAuto.potencia"
                      id="potencia"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.potencia }"
                      placeholder="Ingrese la potencia"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.potencia }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="precio_aproximado" class="col-sm-2 col-form-label">Precio Aproximado</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoAuto.precio_aproximado"
                      id="precio_aproximado"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.precio_aproximado }"
                      placeholder="Ingrese el precio aproximado"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.precio_aproximado }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="tipo_combustible" class="col-sm-2 col-form-label">Tipo Combustible</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoAuto.tipo_combustible"
                      id="tipo_combustible"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.tipo_combustible }"
                      placeholder="Ingrese el tipo de combustible"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.tipo_combustible }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="fabricante_id" class="col-sm-2 col-form-label">Fabricante</label>
                  <div class="col-sm-7">
                    <select
                      v-model="nuevoAuto.fabricante_id"
                      id="fabricante_id"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.fabricante_id }"
                      required
                    >
                      <option value="" disabled>Seleccione un fabricante</option>
                      <option v-for="fabricante in fabricantes" :key="fabricante._id" :value="fabricante._id">
                        {{ fabricante.nombre || 'Sin nombre' }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ formErrors.fabricante_id }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="disenador_id" class="col-sm-2 col-form-label">Diseñador</label>
                  <div class="col-sm-7">
                    <select
                      v-model="nuevoAuto.disenador_id"
                      id="disenador_id"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.disenador_id }"
                      required
                    >
                      <option value="" disabled>Seleccione un diseñador</option>
                      <option v-for="disenador in disenadores" :key="disenador._id" :value="disenador._id">
                        {{ disenador.nombre || 'Sin nombre' }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ formErrors.disenador_id }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="imagen" class="col-sm-2 col-form-label">Imagen</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="nuevoAuto.imagen"
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

      <div v-if="showTab === 'edit' && autoEditado">
        <div class="container py-4 d-flex justify-content-center">
          <div class="card" style="width: 50rem;">
            <div class="card-body">
              <h1 class="title mb-4">Editar Auto</h1>
              <form @submit.prevent="updateAuto" class="needs-validation" novalidate>
                <div class="mb-3 row">
                  <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="autoEditado.nombre"
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
                  <label for="año" class="col-sm-2 col-form-label">Año</label>
                  <div class="col-sm-7">
                    <input
                      type="number"
                      v-model.number="autoEditado.año"
                      id="año"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.año }"
                      placeholder="Ingrese el año"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.año }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="velocidad_maxima" class="col-sm-2 col-form-label">Velocidad Máxima</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="autoEditado.velocidad_maxima"
                      id="velocidad_maxima"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.velocidad_maxima }"
                      placeholder="Ingrese la velocidad máxima"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.velocidad_maxima }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="potencia" class="col-sm-2 col-form-label">Potencia</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="autoEditado.potencia"
                      id="potencia"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.potencia }"
                      placeholder="Ingrese la potencia"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.potencia }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="precio_aproximado" class="col-sm-2 col-form-label">Precio Aproximado</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="autoEditado.precio_aproximado"
                      id="precio_aproximado"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.precio_aproximado }"
                      placeholder="Ingrese el precio aproximado"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.precio_aproximado }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="tipo_combustible" class="col-sm-2 col-form-label">Tipo Combustible</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="autoEditado.tipo_combustible"
                      id="tipo_combustible"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.tipo_combustible }"
                      placeholder="Ingrese el tipo de combustible"
                      required
                    />
                    <div class="invalid-feedback">{{ formErrors.tipo_combustible }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="fabricante_id" class="col-sm-2 col-form-label">Fabricante</label>
                  <div class="col-sm-7">
                    <select
                      v-model="autoEditado.fabricante_id"
                      id="fabricante_id"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.fabricante_id }"
                      required
                    >
                      <option value="" disabled>Seleccione un fabricante</option>
                      <option v-for="fabricante in fabricantes" :key="fabricante._id" :value="fabricante._id">
                        {{ fabricante.nombre || 'Sin nombre' }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ formErrors.fabricante_id }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="disenador_id" class="col-sm-2 col-form-label">Diseñador</label>
                  <div class="col-sm-7">
                    <select
                      v-model="autoEditado.disenador_id"
                      id="disenador_id"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.disenador_id }"
                      required
                    >
                      <option value="" disabled>Seleccione un diseñador</option>
                      <option v-for="disenador in disenadores" :key="disenador._id" :value="disenador._id">
                        {{ disenador.nombre || 'Sin nombre' }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ formErrors.disenador_id }}</div>
                  </div>
                </div>
                <div class="mb-3 row">
                  <label for="imagen" class="col-sm-2 col-form-label">Imagen</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      v-model.trim="autoEditado.imagen"
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
      autos: [],
      fabricantes: [],
      disenadores: [],
      nuevoAuto: {
        _id: '',
        nombre: '',
        año: null,
        velocidad_maxima: '',
        potencia: '',
        precio_aproximado: '',
        tipo_combustible: '',
        fabricante_id: '',
        disenador_id: '',
        imagen: ''
      },
      autoEditado: null,
      showTab: 'table',
      loading: false,
      error: null,
      formErrors: {
        nombre: '',
        año: '',
        velocidad_maxima: '',
        potencia: '',
        precio_aproximado: '',
        tipo_combustible: '',
        fabricante_id: '',
        disenador_id: '',
        imagen: ''
      }
    };
  },

  async created() {
    await this.loadAllData();
  },

  mounted() {},

  methods: {
    async loadAllData() {
      try {
        this.loading = true;
        this.error = null;
        await Promise.all([this.loadAutos(), this.loadFabricantes(), this.loadDisenadores()]);
      } catch (error) {
        this.error = 'Error al cargar datos: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    async loadAutos() {
      try {
        const response = await axios.get(`${API_URL}/api/autos`);
        this.autos = Array.isArray(response.data)
          ? response.data.map(auto => ({
              _id: auto._id || '',
              nombre: auto.nombre || '',
              año: auto.año ?? null,
              velocidad_maxima: auto.velocidad_maxima || '',
              potencia: auto.potencia || '',
              precio_aproximado: auto.precio_aproximado || '',
              tipo_combustible: auto.tipo_combustible || '',
              fabricante_id: auto.fabricante_id?._id || auto.fabricante_id || '',
              disenador_id: auto.disenador_id?._id || auto.disenador_id || '',
              imagen: auto.imagen || ''
            }))
          : [];
      } catch (error) {
        throw new Error('Error al cargar autos: ' + (error.response?.data?.message || error.message));
      }
    },

    async loadFabricantes() {
      try {
        const response = await axios.get(`${API_URL}/api/fabricantes`);
        this.fabricantes = Array.isArray(response.data)
          ? response.data.map(fabricante => ({
              _id: fabricante._id || '',
              nombre: fabricante.nombre || ''
            }))
          : [];
      } catch (error) {
        throw new Error('Error al cargar fabricantes: ' + (error.response?.data?.message || error.message));
      }
    },

    async loadDisenadores() {
      try {
        const response = await axios.get(`${API_URL}/api/disenadores`);
        this.disenadores = Array.isArray(response.data)
          ? response.data.map(disenador => ({
              _id: disenador._id || '',
              nombre: disenador.nombre || ''
            }))
          : [];
      } catch (error) {
        throw new Error('Error al cargar diseñadores: ' + (error.response?.data?.message || error.message));
      }
    },

    getFabricanteName(fabricanteId) {
      const id = typeof fabricanteId === 'object' && fabricanteId?._id ? fabricanteId._id : fabricanteId;
      const fabricante = this.fabricantes.find(f => f._id === id);
      return fabricante ? fabricante.nombre : 'Desconocido';
    },

    getDisenadorName(disenadorId) {
      const id = typeof disenadorId === 'object' && disenadorId?._id ? disenadorId._id : disenadorId;
      const disenador = this.disenadores.find(d => d._id === id);
      return disenador ? disenador.nombre : 'Desconocido';
    },

    showCreateForm() {
      if (this.fabricantes.length === 0 || this.disenadores.length === 0) {
        this.error = 'No se puede crear un auto sin fabricantes o diseñadores disponibles.';
        return;
      }
      this.showTab = 'create';
      this.clearFormErrors();
      this.nuevoAuto = {
        _id: '',
        nombre: '',
        año: null,
        velocidad_maxima: '',
        potencia: '',
        precio_aproximado: '',
        tipo_combustible: '',
        fabricante_id: this.fabricantes[0]?._id || '',
        disenador_id: this.disenadores[0]?._id || '',
        imagen: ''
      };
    },

    cancelCreate() {
      this.showTab = 'table';
      this.clearFormErrors();
      this.error = null;
    },

    validateForm(auto) {
      this.clearFormErrors();
      let isValid = true;

      const nombre = auto.nombre ?? '';
      const año = auto.año;
      const velocidad_maxima = auto.velocidad_maxima ?? '';
      const potencia = auto.potencia ?? '';
      const precio_aproximado = auto.precio_aproximado ?? '';
      const tipo_combustible = auto.tipo_combustible ?? '';
      const fabricante_id = auto.fabricante_id ?? '';
      const disenador_id = auto.disenador_id ?? '';
      const imagen = auto.imagen ?? '';

      if (!nombre.trim()) {
        this.formErrors.nombre = 'El nombre es requerido';
        isValid = false;
      }
      if (año === null || isNaN(año) || año < 1900 || año > new Date().getFullYear() + 1) {
        this.formErrors.año = 'El año debe ser un número válido entre 1900 y ' + (new Date().getFullYear() + 1);
        isValid = false;
      }
      if (!velocidad_maxima.trim()) {
        this.formErrors.velocidad_maxima = 'La velocidad máxima es requerida';
        isValid = false;
      }
      if (!potencia.trim()) {
        this.formErrors.potencia = 'La potencia es requerida';
        isValid = false;
      }
      if (!precio_aproximado.trim()) {
        this.formErrors.precio_aproximado = 'El precio aproximado es requerido';
        isValid = false;
      }
      if (!tipo_combustible.trim()) {
        this.formErrors.tipo_combustible = 'El tipo de combustible es requerido';
        isValid = false;
      }
      if (!fabricante_id || !this.fabricantes.find(f => f._id === fabricante_id)) {
        this.formErrors.fabricante_id = 'Debe seleccionar un fabricante válido';
        isValid = false;
      }
      if (!disenador_id || !this.disenadores.find(d => d._id === disenador_id)) {
        this.formErrors.disenador_id = 'Debe seleccionar un diseñador válido';
        isValid = false;
      }
      if (!imagen.trim()) {
        this.formErrors.imagen = 'La imagen es requerida';
        isValid = false;
      }

      return isValid;
    },

    clearFormErrors() {
      this.formErrors = {
        nombre: '',
        año: '',
        velocidad_maxima: '',
        potencia: '',
        precio_aproximado: '',
        tipo_combustible: '',
        fabricante_id: '',
        disenador_id: '',
        imagen: ''
      };
    },

    async createAuto() {
      if (!this.validateForm(this.nuevoAuto)) return;

      try {
        this.loading = true;
        this.error = null;
        this.nuevoAuto._id = (this.autos.length + 1).toString();
        const response = await axios.post(`${API_URL}/api/autos`, this.nuevoAuto);
        this.autos.push(response.data);
        this.cancelCreate();
      } catch (error) {
        this.error = 'Error al crear auto: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    editAuto(auto) {
      if (this.fabricantes.length === 0 || this.disenadores.length === 0) {
        this.error = 'No se puede editar un auto sin fabricantes o diseñadores disponibles.';
        return;
      }
      this.autoEditado = {
        _id: auto._id || '',
        nombre: auto.nombre || '',
        año: auto.año ?? null,
        velocidad_maxima: auto.velocidad_maxima || '',
        potencia: auto.potencia || '',
        precio_aproximado: auto.precio_aproximado || '',
        tipo_combustible: auto.tipo_combustible || '',
        fabricante_id: auto.fabricante_id?._id || auto.fabricante_id || this.fabricantes[0]?._id || '',
        disenador_id: auto.disenador_id?._id || auto.disenador_id || this.disenadores[0]?._id || '',
        imagen: auto.imagen || ''
      };
      this.showTab = 'edit';
      this.clearFormErrors();
      this.error = null;
    },

    cancelEdit() {
      this.showTab = 'table';
      this.autoEditado = null;
      this.clearFormErrors();
      this.error = null;
    },

    async updateAuto() {
      if (!this.validateForm(this.autoEditado)) return;

      try {
        this.loading = true;
        this.error = null;
        const response = await axios.put(
          `${API_URL}/api/autos/${this.autoEditado._id}`,
          this.autoEditado
        );
        const index = this.autos.findIndex(a => a._id === response.data._id);
        if (index !== -1) {
          this.autos[index] = response.data;
        }
        this.cancelEdit();
      } catch (error) {
        this.error = 'Error al actualizar auto: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    async deleteAuto(auto) {
      if (!confirm(`¿Estás seguro de eliminar el auto ${auto.nombre || 'este auto'}?`)) return;
      try {
        this.loading = true;
        this.error = null;
        await axios.delete(`${API_URL}/api/autos/${auto._id}`);
        this.autos = this.autos.filter(a => a._id !== auto._id);
      } catch (error) {
        this.error = 'Error al eliminar auto: ' + (error.response?.data?.message || error.message);
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

form input,
form select {
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