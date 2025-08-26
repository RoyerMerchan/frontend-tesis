<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <Toast />

        <!-- Título -->
        <h1 class="text-2xl font-bold text-teal-900 mb-6">Gestión de Equipos</h1>

        <!-- Buscador -->
        <div class="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <InputText v-model="search" placeholder="Buscar equipos..." class="w-full md:w-1/2" />
            <Button label="Buscar" icon="pi pi-search" @click="fetchTeams" class="bg-blue-500 text-white" />
        </div>

        <!-- Equipo actual -->
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-teal-800 mb-2">Tu equipo</h2>
            <div v-if="userTeam.length && userTeam[0]">
                <div class="bg-white shadow-md rounded-lg p-4">
                    <h3 class="text-lg font-bold text-teal-400">{{ userTeam[0].na_team || 'Sin asignar'}}</h3>
                    <p class="text-gray-600">Deporte: {{ userTeam[0].na_sport || 'Sin asignar'}}</p>
                    <p class="text-gray-600">Institución: {{ userTeam[0].na_institucion || 'Sin asignar' }}</p>
                    <div class="mt-4 flex gap-2">
                      <Button label="Editar equipo" icon="pi pi-pencil"
        @click="openEdit(userTeam[0])"
        class="bg-yellow-500 text-white" />
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-500 italic">No tienes equipo asignado.</div>
        </div>
        <!-- Equipo al que pertenece -->

        <div class="mb-6">
            <h2 class="text-xl font-semibold text-teal-800 mb-2">Equipo al que perteneces</h2>
            <div v-if="userTeamNa.length && userTeamNa[0]">
                <div class="bg-white shadow-md rounded-lg p-4">
                    <h3 class="text-lg font-bold text-teal-700">{{ userTeamNa[0].na_team }}</h3>
                    <p class="text-gray-600">Deporte: {{ userTeamNa[0].na_sport || 'Sin asignar' }}</p>
                    <p class="text-gray-600">Institución: {{ userTeamNa[0].na_institucion || 'Sin asignar' }}</p>

                </div>
            </div>
            <div v-else class="text-gray-500 italic">No tienes equipo asignado.</div>
        </div>

        <!-- Crear equipo -->
        <div class="mb-6">
            <Button label="Crear nuevo equipo" icon="pi pi-plus" @click="showCreate = true"
                class="bg-green-500 text-white" />
        </div>

        <!-- Lista de resultados -->
        <div><h1>Resultado de busqueda </h1></div>
        <div v-if="teams.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="team in teams" :key="team.team_id" class="bg-white shadow-sm p-4">
                <h3 class="text-lg font-bold text-teal-700">{{ team.na_team }}</h3>
                <p class="text-gray-600">Deporte: {{ team.na_sport || 'Sin asignar' }}</p>
                <p class="text-gray-600">Institución: {{ team.na_institucion || 'Sin asignar' }}</p>
            </div>
        </div>


        <!-- Modal crear equipo -->
        <Dialog v-model:visible="showCreate" header="Crear equipo" :modal="true" :closable="false"
            class="w-full md:w-1/2">
            <Form @submit="submit" :validation-schema="teamSchema" class="flex flex-col gap-4">
                <Field name="na_team" v-slot="{ field }">
                    <InputText v-bind="field" placeholder="Nombre del equipo" class="w-full" />
                </Field>
                <Field name="sport_id" v-slot="{ field }">
                    <Dropdown v-bind="field" :options="sports" optionLabel="na_sport"
                        :optionValue="option => Number(option.sport_id)" placeholder="Selecciona un deporte"
                        class="w-full" id="sport_id" />
                </Field>

                <Field name="institution_id" v-slot="{ field }">
                    <Dropdown v-bind="field" :options="institutions" optionLabel="na_institucion"
                        :optionValue="option => Number(option.institucion_id)" placeholder="Selecciona una institución"
                        class="w-full" id="institution_id" />
                </Field>
                <div class="flex justify-end gap-2 mt-4">
                    <Button label="Cancelar" @click="showCreate = false" class="bg-gray-300 text-gray-800" />
                    <Button label="Crear" type="submit" class="bg-green-500 text-white" />
                </div>
            </Form>
        </Dialog>

        <!-- Modal editar equipo -->
        <Dialog v-model:visible="showEdit" header="Editar equipo" :modal="true" :closable="false"
        class="w-full md:w-1/2">
  <Form
    :key="editTeam.team_id"
    @submit="updateTeam"
    :validation-schema="teamSchemaedit"
    :initial-values="editTeam"
    class="flex flex-col gap-4"
  >
    <Field name="na_team" v-slot="{ value, handleChange, handleBlur }">
      <InputText
        :modelValue="value"
        @update:modelValue="handleChange"
        @blur="handleBlur"
        placeholder="Nombre del equipo"
        class="w-full"
      />
    </Field>

    <Field name="sport_id" v-slot="{ value, handleChange, handleBlur }">
      <Dropdown
        :modelValue="value"
        @update:modelValue="handleChange"
        @blur="handleBlur"
        :options="sports"
        optionLabel="na_sport"
        optionValue="sport_id"
        placeholder="Selecciona un deporte"
        class="w-full"
        inputId="sport_id"
      />
    </Field>

    <Field name="institution_id" v-slot="{ value, handleChange, handleBlur }">
      <Dropdown
        :modelValue="value"
        @update:modelValue="handleChange"
        @blur="handleBlur"
        :options="institutions"
        optionLabel="na_institucion"
        optionValue="institucion_id"
        placeholder="Selecciona una institución"
        class="w-full"
        inputId="institution_id"
      />
    </Field>

    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancelar" @click="showEdit = false" class="bg-gray-300 text-gray-800" />
      <Button label="Actualizar" type="submit" as="button" class="bg-green-500 text-white" />
    </div>

    <Button label="Añadir jugadores" icon="pi pi-user-plus" @click="showAddPlayers = true"
            class="bg-blue-500 text-white" />
  </Form>
</Dialog>

        <!-- Modal añadir jugadores -->
        <Dialog v-model:visible="showAddPlayers" header="Añadir jugadores al equipo" :modal="true"
            class="w-full md:w-2/3">
            <div class="flex flex-col gap-4">
                <!-- Buscador -->
                <div class="flex gap-2 items-center">
                    <InputText v-model="personSearch" placeholder="Buscar personas..." class="w-full" />
                    <Button label="Buscar" icon="pi pi-search" @click="fetchPersons" class="bg-blue-500 text-white" />
                </div>
                <!-- jugadores ya añadidos-->

               <div v-if="currentPlayers.length" class="mt-6">
  <h4 class="text-xl font-semibold text-gray-700 mb-4">Jugadores actuales</h4>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="player in currentPlayers"
      :key="player.person_id"
      class="bg-white shadow-md rounded-lg p-4 border border-gray-200"
    >
      <h3 class="text-lg font-bold text-teal-800 mb-1">
        {{ player.ln_person }} {{ player.na_person }}
      </h3>
      <p class="text-gray-600 mb-2">
        Numero de Camiseta: <span class="font-semibold">{{ player.num_team_member || 'N/A' }}</span>
      </p>

      <div class="flex gap-2 items-center">
        <InputText
          v-model="player.newNumber"
          placeholder="Asignar número"
          class="w-1/2"
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          @click="assignNumber(player)"
          class="bg-green-500 text-white"
        />
      </div>
    </div>
  </div>
</div>

                <!-- Lista de resultados -->


                 <div v-if="personResults.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                     <div
                     v-for="person in personResults"
                     :key="person.person_id"
                     class="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow"
                     >

    <div class="flex items-center gap-4">
      <div class="bg-blue-100 text-green-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
        {{ person.na_person.charAt(0) }}
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-800">
          {{ person.na_person }} {{ person.ln_person || '' }}
        </h3>

      </div>
    </div>

    <div class="mt-4 flex justify-end">
      <Button
        label="Añadir al equipo"
        icon="pi pi-user-plus"
        @click="addPlayerToTeam(person)"
        class="bg-green-500 text-white px-4 py-2"
      />
    </div>
  </div>
</div>

                <div v-else class="text-gray-500 italic mt-4">No se encontraron personas.</div>
            </div>
        </Dialog>

    </div>
</template>

<script setup>
import { send } from '@/api/send';
import { toTypedSchema } from '@vee-validate/yup';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { Field, Form } from 'vee-validate';
import { onMounted, ref } from 'vue';
import * as yup from 'yup';

const search = ref('');
const   teams = ref([]);
const userTeam = ref([]); // equipo actual del usuario
const userTeamNa = ref([])
const showCreate = ref(false);
const showEdit = ref(false);
const editTeam = ref({
    team_id: null,
    na_team: '',
    sport_id: null,
    institution_id: null
});
const toast = useToast();

const sports = ref([]);
const institutions = ref([]);

const showAddPlayers = ref(false);
const personSearch = ref('');
const personResults = ref([]);
const currentPlayers = ref([]);

const addPlayerToTeam = async (person) => {
    try {
        await send({
            endpoint: 'teammember',
            method: 'post',
            body: {
                team_id: editTeam.value.team_id,
                person_id: person.person_id
            }
        });
        currentPlayers.value.push(person);
        toast.add({ severity: 'success', summary: 'Jugador añadido', detail: `${person.full_name} fue añadido al equipo.` });
           try {
    const res = await send({ endpoint: `teammember`, method: 'get' });
    currentPlayers.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los jugadores del equipo.' });
  }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el jugador.' });
    }
};

const assignNumber = async (player) => {
  if (!player.newNumber) {
    toast.add({ severity: 'warn', detail: 'Debes ingresar un número' });
    return;
  }

  try {
    await send({
      endpoint: 'teammember',
      method: 'put',
      body: {
        team_member_id: player.team_member_id,
        team_id: player.team_id,
        num_team_member: player.newNumber
      }
    });

    player.num_team_member = player.newNumber;
    toast.add({ severity: 'success', detail: `Número asignado a ${player.na_person}` });


  } catch (error) {
    toast.add({ severity: 'error', detail: 'No se pudo asignar el número' });
  }
};




const teamSchema = toTypedSchema(
    yup.object({
        na_team: yup.string().required('Nombre requerido'),
        sport_id: yup
            .object({
                value: yup
                    .number()
                    .typeError('Debe seleccionar un deporte válido')
                    .required('deporte requerido')
            })
            .required('deporte requerido'),
        institution_id: yup
            .object({
                value: yup
                    .number()
                    .typeError('Debe seleccionar una institución válida')
                    .required('institución requerida')
            }).required('institución requerida')
    })
);

const teamSchemaedit = toTypedSchema(
  yup.object({
    na_team: yup.string().required('Nombre requerido'),
    sport_id: yup.number().required('Deporte requerido'),
    institution_id: yup.number().required('Institución requerida')
  })
);


onMounted(async () => {
    try {
        const userOwner = await send({ endpoint: 'team/owner', method: 'get' });

        userTeam.value = userOwner.data || [];
        console.log("datosssss:", userOwner.data);


        console.log(userTeam.value, "este es el result")
        toast.add({ severity: 'success', summary: 'success', detail: 'equipo cargado' })
    } catch (error) {
       console.log(error)
    }

    try {
 const userPert = await send({endpoint: 'team/pert', method: 'get'})

        userTeamNa.value = userPert.data || [];
    } catch (error) {
error
    }



    try {
        const sportRes = await send({ endpoint: 'sport', method: 'get' });
        sports.value = sportRes.data || [];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los deportes.' });
    }

    try {
        const instRes = await send({ endpoint: 'institution', method: 'get' });
        institutions.value = instRes.data || [];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las instituciones.' });
    }
});

const fetchPersons = async () => {
    try {
        const res = await send({ endpoint: `person/search?person=${personSearch.value}`, method: 'get' });
        personResults.value = res.data || res || [];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las personas.' });
    }
};

const fetchTeams = async () => {
    const res = await send({ endpoint: `team/buscar?team=${search.value}`, method: 'get' });

    // REVISAR ESTO PORQUE NO SE SI SI ESTA BIEN
    teams.value = res.data || res || [];
    console.log('Equipos encontrados:', teams.value);

    console.log(teams.value)
};
const submit = async (values) => {

    const payload = {
        na_team: values.na_team,
        sport_id: values.sport_id.value,
        institution_id: values.institution_id.value,
    };
    console.log('Payload:', payload);

    try {
        await send({
            endpoint: 'team/owner',
            method: 'post',
            body: payload
        });
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Equipo creado correctamente.' });

    } catch (error) {

        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el equipo.' });
    }
};

const openEdit = async (team) => {
  // Si por accidente llega un array, toma el primero
  const t = Array.isArray(team) ? team[0] : team;

  editTeam.value = {
    team_id: t.team_id,
    na_team: t.na_team,
    sport_id: t.sport_id,                 // <-- número
    institution_id: t.institution_id      // <-- número
  };

  showEdit.value = true;

  try {
    const res = await send({ endpoint: `teammember`, method: 'get' });
    currentPlayers.value = res.data || [];
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los jugadores del equipo.' });
  }
};


const updateTeam = async (values, { resetForm }) => {
  try {
    const payload = {
      team_id: editTeam.value.team_id,
      na_team: values.na_team,
      sport_id: Number(values.sport_id),
      institution_id: Number(values.institution_id)
    };

    console.log("Payload enviado:", payload);
    await send({ endpoint: 'team', method: 'put', body: payload });

    toast.add({ severity: 'success', detail: "Equipo actualizado" });
    showEdit.value = false;
    resetForm();

     try {
        const userOwner = await send({ endpoint: 'team/owner', method: 'get' });
        userTeam.value = userOwner.data || [];
        console.log("datosssss:", userOwner.data);


        console.log(userTeam.value, "este es el result")
        toast.add({ severity: 'success', summary: 'success', detail: 'equipo cargado' })
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los owner.' });
    }

  } catch (error) {
    toast.add({ severity: 'error', detail: "Error al actualizar" });
  }
};



</script>
