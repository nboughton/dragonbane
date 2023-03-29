<template>
  <q-page padding class="column">
    <div class="row justify-between q-gutter-sm">
      <div class="col">
        <q-input
          class="row"
          label="Name"
          v-model="st.chars[st.conf.char].name"
          dense
        />

        <div class="row">
          <q-input
            class="col"
            label="Kin"
            v-model="st.chars[st.conf.char].kin"
            dense
          />
          <q-input
            class="col"
            label="Age"
            v-model.number="st.chars[st.conf.char].age"
            type="number"
            dense
          />
          <q-input
            class="col"
            label="Movement"
            type="number"
            v-model.number="st.chars[st.conf.char].movement"
            dense
          />
        </div>
      </div>

      <div class="col">
        <q-input
          label="Profession"
          v-model="st.chars[st.conf.char].profession"
          dense
        />
        <q-input
          label="Weakness"
          v-model="st.chars[st.conf.char].weakness"
          dense
        />
      </div>
    </div>

    <q-input
      class="row"
      label="Appearance"
      v-model="st.chars[st.conf.char].appearance"
      dense
      autogrow
    />

    <div class="row justify-evenly q-mt-md">
      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr
          :label="EAttr.STR"
          v-model="st.chars[st.conf.char].attributes.STR"
        />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr
          :label="EAttr.CON"
          v-model="st.chars[st.conf.char].attributes.CON"
        />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr
          :label="EAttr.AGL"
          v-model="st.chars[st.conf.char].attributes.AGL"
        />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr
          :label="EAttr.INT"
          v-model="st.chars[st.conf.char].attributes.INT"
        />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr
          :label="EAttr.WIL"
          v-model="st.chars[st.conf.char].attributes.WIL"
        />
      </div>

      <div class="col-xs-4 col-sm-3 col-md-2">
        <char-attr
          :label="EAttr.CHA"
          v-model="st.chars[st.conf.char].attributes.CHA"
        />
      </div>
    </div>

    <q-tabs v-model="tab">
      <q-tab name="skills" label="Skills" />
      <q-tab name="violence" label="Violence" />
      <q-tab name="gear" label="Gear" />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="skills">
        <div class="row q-mt-md">
          <div class="col-12 text-h5 text-bold">Primary Skills</div>
          <div
            class="col-xs-12 col-sm-4 col-md-4"
            v-for="(sk, k) in st.chars[st.conf.char].priSkills"
            :key="`priSkill-${k}`"
          >
            <char-skill
              v-model="st.chars[st.conf.char].priSkills[k]"
              :label="`${k}`"
            />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-12 text-h5 text-bold">
            Secondary Skills
            <q-btn
              icon="add_circle"
              flat
              dense
              rounded
              @click="showAddSkill = true"
            />
          </div>
          <div
            class="col-xs-12 col-sm-4 col-md-4"
            v-for="(sk, k) in st.chars[st.conf.char].secSkills"
            :key="`secSkill-${k}`"
          >
            <char-skill
              v-model="st.chars[st.conf.char].secSkills[k]"
              :label="`${k}`"
              show-delete
              @delete="removeSecSkill"
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="violence">
        <div class="row justify-between items-center q-mt-md text-center">
          <div class="col text-h5 text-bold">
            Damage Bon. STR:
            {{ DmgBonus(st.chars[st.conf.char].attributes.STR.score) }}
          </div>

          <div class="col text-h5 text-bold">
            Damage Bon. AGL:
            {{ DmgBonus(st.chars[st.conf.char].attributes.AGL.score) }}
          </div>
        </div>

        <div class="row q-mt-md text-h5 text-bold items-center">
          Weapons
          <q-btn icon="add_circle" flat dense rounded @click="addWeapon" />
        </div>
        <weapon-block
          v-for="(w, i) in st.chars[st.conf.char].weapons"
          :key="`wpn-${i}`"
          v-model="st.chars[st.conf.char].weapons[i]"
          @delete="removeWeapon(i)"
        />

        <div class="row q-mt-md">
          <div class="col-12 text-h5 text-bold">Weapon Skills</div>
          <div
            class="col-xs-12 col-sm-4 col-md-4"
            v-for="(sk, k) in st.chars[st.conf.char].wepSkills"
            :key="`skill-${k}`"
          >
            <char-skill
              v-model="st.chars[st.conf.char].wepSkills[k]"
              :label="`${k}`"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>

  <q-dialog v-model="showAddSkill">
    <q-card>
      <q-card-section class="column">
        <q-input label="Skill Name" v-model="newSkillName" dense />
        <q-select
          label="Attribute"
          :options="Object.values(EAttr)"
          v-model="newSkillAttr"
          dense
        />
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
            st.chars[st.conf.char].secSkills[newSkillName] =
              skill(newSkillAttr);
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

import { EAttr } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { DmgBonus, NewWeapon, skill } from 'src/lib/defaults';

import CharAttr from 'src/components/CharAttr.vue';
import CharSkill from 'src/components/CharSkill.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { CharAttr, CharSkill, WeaponBlock },
  setup() {
    const st = useCharacterStore();
    const tab = ref('skills');

    const $q = useQuasar();
    const addWeapon = () => st.chars[st.conf.char].weapons.push(NewWeapon());
    const removeWeapon = (index: number) =>
      $q
        .dialog({
          message: 'Remove this weapon?',
          cancel: true,
        })
        .onOk(() => st.chars[st.conf.char].weapons.splice(index, 1));

    const showAddSkill = ref(false);
    const newSkillName = ref('');
    const newSkillAttr = ref(EAttr.STR);
    const removeSecSkill = (val: string) =>
      $q
        .dialog({
          message: 'Delete this skill?',
          cancel: true,
        })
        .onOk(() => delete st.chars[st.conf.char].secSkills[val]);

    return {
      st,
      tab,
      EAttr,
      DmgBonus,

      showAddSkill,
      removeSecSkill,
      newSkillName,
      newSkillAttr,
      skill,

      addWeapon,
      removeWeapon,
    };
  },
});
</script>
