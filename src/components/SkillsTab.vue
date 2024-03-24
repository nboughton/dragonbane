<template>
  <!-- file deepcode ignore PureFunctionReturnValueIgnored: The return value is passed to the component -->
  <div class="row q-ml-sm items-center">
    <div class="col text-h6 text-bold">Primary Skills</div>
    <div class="q-px-none">
      <q-toggle v-model="editSkills" icon="mdi-pencil" />
    </div>
  </div>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.priSkills" :key="`priSkill-${k}`">
      <div v-if="show(k as string)">
        <char-skill
          v-model="app.char.priSkills[k]"
          :label="`${k}`"
          :edit-skills="editSkills"
          :skill-type="ERollType.Primary"
        />
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
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in app.char.secSkills" :key="`secSkill-${k}`">
      <char-skill
        v-model="app.char.secSkills[k]"
        :label="`${k}`"
        :edit-skills="editSkills"
        show-delete
        @delete="removeSecSkill"
        :skill-type="ERollType.Secondary"
      />
    </div>
  </div>

  <q-dialog v-model="showAddSkill">
    <q-card>
      <q-card-section class="column">
        <q-input label="Skill Name" v-model="newSkillName" dense />
        <q-select label="Attribute" :options="Object.values(EAttr)" v-model="newSkillAttr" dense />
      </q-card-section>
      <q-card-actions class="row justify-evenly">
        <q-btn
          class="col"
          color="red"
          label="Cancel"
          @click="
            newSkillName = '';
            showAddSkill = false;
          "
          flat
        />
        <q-btn
          class="col"
          color="green"
          label="Add"
          @click="
            app.char.secSkills[newSkillName] = skill(newSkillAttr);
            newSkillName = '';
            showAddSkill = false;
          "
          flat
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { EAttr, ERollType } from './models';

import CharSkill from './CharSkill.vue';
import { useQuasar } from 'quasar';
import { skill } from 'src/lib/defaults';
import { useCharacterStore } from 'src/stores/character';

export default defineComponent({
  name: 'SkillsTab',
  components: { CharSkill },
  setup() {
    const app = useCharacterStore();

    const $q = useQuasar();
    const showAddSkill = ref(false);
    const editSkills = ref(false);
    const newSkillName = ref('');
    const newSkillAttr = ref(EAttr.STR);
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

    return {
      app,
      skill,
      showAddSkill,
      newSkillName,
      newSkillAttr,
      removeSecSkill,
      filter,
      show,
      EAttr,
      ERollType,
      editSkills,
    };
  },
});
</script>
