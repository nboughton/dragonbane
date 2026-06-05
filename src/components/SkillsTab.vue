<template>
  <div class="row no-wrap q-pl-sm justify-between items-center">
    <div class="col-4 text-h6 text-bold">Primary Skills</div>
    <q-input class="col-5" input-class="rounded-borders" label="Filter List" v-model="filter" clearable dense>
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="col-shrink q-px-none">
      <q-toggle v-model="editSkills" icon="mdi-pencil" />
    </div>
  </div>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(_, k) in app.char.priSkills" :key="`priSkill-${k}`">
      <div v-if="show(k as string)">
        <char-skill v-model="app.char.priSkills[k]" :label="`${k}`" :edit-skills="editSkills"
          :skill-type="RollTypes.Primary" />
      </div>
    </div>
  </div>

  <div class="row q-mt-md">
    <div class="col-12 text-h6 text-bold">
      <div class="col-shrink q-pl-sm">
        Secondary Skills
        <q-btn icon="add_circle" flat dense rounded @click="showAddSkill = true" />
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(_, k) in app.char.secSkills" :key="`secSkill-${k}`">
      <char-skill v-model="app.char.secSkills[k]!" :label="`${k}`" :edit-skills="editSkills" show-delete
        @delete="removeSecSkill" :skill-type="RollTypes.Secondary" />
    </div>
  </div>

  <q-dialog v-model="showAddSkill">
    <q-card>
      <q-card-section class="column">
        <q-input label="Skill Name" v-model="newSkillName" dense />
        <q-select options-selected-class="text-purple-2" label="Attribute" :options="Object.values(Attrs)"
          v-model="newSkillAttr" dense />
      </q-card-section>
      <q-card-actions class="row justify-evenly">
        <q-btn class="col" color="red" label="Cancel" @click="
          newSkillName = '';
        showAddSkill = false;
        " flat />
        <q-btn class="col" color="green" label="Add" @click="
          app.char.secSkills[newSkillName] = skill(newSkillAttr);
        newSkillName = '';
        showAddSkill = false;
        " flat />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { Attrs, RollTypes } from './models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { skill } from 'src/lib/defaults';

import CharSkill from './CharSkill.vue';

const app = useCharacterStore();

const $q = useQuasar();
const showAddSkill = ref(false);
const editSkills = ref(false);
const newSkillName = ref('');
const newSkillAttr = ref(Attrs.STR);
const removeSecSkill = (val: string) =>
  $q
    .dialog({
      message: 'Delete this skill?',
      cancel: true,
      maximized: true,
    })
    .onOk(() => delete app.char.secSkills[val]);

const filter = ref('');
const show = (name: string): boolean => {
  if (filter.value == '' || filter.value == null) return true;
  if (RegExp(filter.value, 'i').test(name)) return true;
  return false;
};
</script>
