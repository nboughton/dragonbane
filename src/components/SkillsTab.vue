<template>
  <div class="row">
    <div class="col-12 text-h5 text-bold">Primary Skills</div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in char.priSkills" :key="`priSkill-${k}`">
      <char-skill v-model="char.priSkills[k]" :label="`${k}`" />
    </div>
  </div>

  <div class="row q-mt-md">
    <div class="col-12 text-h5 text-bold">
      Secondary Skills
      <q-btn icon="add_circle" flat dense rounded @click="showAddSkill = true" />
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(sk, k) in char.secSkills" :key="`secSkill-${k}`">
      <char-skill v-model="char.secSkills[k]" :label="`${k}`" show-delete secondary @delete="removeSecSkill" />
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
            char.secSkills[newSkillName] = skill(newSkillAttr);
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
import { PropType, defineComponent, ref, watch } from 'vue';

import { ICharacter, EAttr } from './models';

import CharSkill from './CharSkill.vue';
import { useQuasar } from 'quasar';
import { skill } from 'src/lib/defaults';

export default defineComponent({
  name: 'SkillsTab',
  components: { CharSkill },
  props: {
    modelValue: {
      type: Object as PropType<ICharacter>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const char = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => (char.value = props.modelValue),
      { deep: true }
    );
    watch(
      () => char.value,
      () => emit('update:modelValue', char.value),
      { deep: true }
    );

    const $q = useQuasar();
    const showAddSkill = ref(false);
    const newSkillName = ref('');
    const newSkillAttr = ref(EAttr.STR);
    const removeSecSkill = (val: string) =>
      $q
        .dialog({
          message: 'Delete this skill?',
          cancel: true,
        })
        .onOk(() => delete char.value.secSkills[val]);

    return {
      char,
      skill,
      showAddSkill,
      newSkillName,
      newSkillAttr,
      removeSecSkill,
      EAttr,
    };
  },
});
</script>
