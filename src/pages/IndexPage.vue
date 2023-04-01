<template>
  <q-page padding class="column">
    <div class="row justify-between q-gutter-sm">
      <div class="col">
        <q-input class="row" label="Name" v-model="st.chars[st.conf.char].name" dense />

        <div class="row">
          <q-select class="col" label="Age" v-model="st.chars[st.conf.char].age" :options="Object.values(EAge)" dense />
          <q-input class="col" label="Movement" type="number" v-model.number="st.chars[st.conf.char].movement" dense />
        </div>
      </div>

      <div class="col">
        <div class="row">
          <q-input class="col" label="Kin" v-model="st.chars[st.conf.char].kin" dense />
          <q-input class="col" label="Profession" v-model="st.chars[st.conf.char].profession" dense />
        </div>
        <q-input class="row" label="Weakness" v-model="st.chars[st.conf.char].weakness" dense />
      </div>
    </div>

    <q-input class="row" label="Appearance" v-model="st.chars[st.conf.char].appearance" dense autogrow />

    <div class="row justify-evenly q-mt-md">
      <q-btn v-if="statsRolled" class="col-12 q-mb-sm" icon="mdi-dice-d20" flat @click="rollStats" label="Roll stats">
        <q-tooltip>Roll stats</q-tooltip>
      </q-btn>
      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.STR" v-model="st.chars[st.conf.char].attributes.STR" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.CON" v-model="st.chars[st.conf.char].attributes.CON" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.AGL" v-model="st.chars[st.conf.char].attributes.AGL" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.INT" v-model="st.chars[st.conf.char].attributes.INT" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.WIL" v-model="st.chars[st.conf.char].attributes.WIL" />
      </div>

      <div class="col-xs-4 col-md-2">
        <char-attr :label="EAttr.CHA" v-model="st.chars[st.conf.char].attributes.CHA" />
      </div>
    </div>

    <div class="row justify-between q-mt-sm">
      <div class="col-xs-12 col-sm-5 col-md-4">
        <points-block v-model="st.chars[st.conf.char].hp" label="HP" show-max />
      </div>
      <div class="col-xs-12 col-sm-5 col-md-4">
        <points-block v-model="st.chars[st.conf.char].wp" label="WP" show-max />
      </div>
    </div>

    <q-tabs v-model="tab" align="justify" class="q-mt-md">
      <q-tab name="skills" label="Skills" />
      <q-tab name="combat" label="Combat" />
      <q-tab name="abilities" label="Abilities & Spells" />
      <q-tab name="gear" label="Gear" />
    </q-tabs>

    <q-tab-panels v-model="tab" class="rounded-borders">
      <!--SKILLS-->
      <q-tab-panel name="skills">
        <div class="row">
          <div class="col-12 text-h5 text-bold">Primary Skills</div>
          <div
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            v-for="(sk, k) in st.chars[st.conf.char].priSkills"
            :key="`priSkill-${k}`"
          >
            <char-skill v-model="st.chars[st.conf.char].priSkills[k]" :label="`${k}`" />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-12 text-h5 text-bold">
            Secondary Skills
            <q-btn icon="add_circle" flat dense rounded @click="showAddSkill = true" />
          </div>
          <div
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            v-for="(sk, k) in st.chars[st.conf.char].secSkills"
            :key="`secSkill-${k}`"
          >
            <char-skill
              v-model="st.chars[st.conf.char].secSkills[k]"
              :label="`${k}`"
              show-delete
              secondary
              @delete="removeSecSkill"
            />
          </div>
        </div>
      </q-tab-panel>

      <!--COMBAT-->
      <q-tab-panel name="combat">
        <div class="row justify-between items-center text-center q-mt-md">
          <div class="col-xs-12 col-sm-5">
            <armour-block label="Armour" v-model="st.chars[st.conf.char].armour" />
          </div>

          <div class="col-xs-12 col-sm-5">
            <armour-block label="Helmet" v-model="st.chars[st.conf.char].helmet" />
          </div>
        </div>

        <div class="row q-mt-md text-h5 text-bold items-center">
          Weapons
          <q-btn icon="add_circle" flat dense rounded @click="addWeapon" />
        </div>
        <div class="row text-bold q-mt-xs">
          Dmg Bonus: STR:
          {{ DmgBonus(st.chars[st.conf.char].attributes.STR.score) }}, AGL:
          {{ DmgBonus(st.chars[st.conf.char].attributes.AGL.score) }}
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
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            v-for="(sk, k) in st.chars[st.conf.char].wepSkills"
            :key="`skill-${k}`"
          >
            <char-skill v-model="st.chars[st.conf.char].wepSkills[k]" :label="`${k}`" />
          </div>
        </div>
      </q-tab-panel>

      <!--ABILITIES & SPELLS-->
      <q-tab-panel name="abilities">
        <div class="row justify-between">
          <div class="col-xs-12 col-sm-12 col-md-6 q-px-xs">
            <div class="row q-mt-md text-h5 text-bold items-center">
              Heroic Abilities
              <q-btn icon="add_circle" flat dense rounded @click="addAbl" />
            </div>
            <ability-block
              v-for="(ab, i) in st.chars[st.conf.char].abilities"
              :key="`abl-${i}`"
              v-model="st.chars[st.conf.char].abilities[i]"
              @delete="removeAbl(i)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 q-px-xs">
            <div class="row q-mt-md text-h5 text-bold items-center justify-between">
              <div class="col-shrink">
                Spells
                <q-btn icon="add_circle" flat dense rounded @click="addSpell" />
              </div>
              <div class="col-shrink">
                <q-btn icon="sort" flat dense rounded @click="sortSpells">
                  <q-tooltip>Sort spells by rank</q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row items-center justify-evenly">
              <div class="col text-bold">Known by rank:</div>
              <div class="col-shrink" v-for="(r, i) in spellsByRank" :key="`ranked-spells-${i}`">
                <span class="q-ml-sm q-pa-xs bg-grey-9 rounded-borders" v-if="r > 0">
                  &nbsp;{{ i }} : {{ r }}&nbsp;
                </span>
              </div>
            </div>
            <div class="row items-center justify-evenly q-mt-xs">
              <div class="col text-bold">Prepared:</div>
              <div class="col-shrink">
                {{ spellsPrepared }}/{{ BaseChance(st.chars[st.conf.char].attributes.INT.score) }}
              </div>
            </div>
            <spell-block
              v-for="(sp, i) in st.chars[st.conf.char].spells"
              :key="`spell-${i}`"
              v-model="st.chars[st.conf.char].spells[i]"
              @delete="removeSpell(i)"
            />
          </div>
        </div>
      </q-tab-panel>

      <!--GEAR-->
      <q-tab-panel name="gear">
        <div class="row justify-between">
          <money-field label="GOLD" v-model="st.chars[st.conf.char].money.gold" />
          <money-field label="SILVER" v-model="st.chars[st.conf.char].money.silver" />
          <money-field label="COPPER" v-model="st.chars[st.conf.char].money.copper" />
        </div>

        <div class="row text-h6 text-bold q-mt-md">
          <div class="col">Inventory ({{ encumberance }} / {{ encumberMax }})</div>
          <q-btn class="col-shrink" icon="add_circle" flat dense rounded @click="addInvItem" />
        </div>
        <item-row
          v-for="(it, i) in st.chars[st.conf.char].inventory"
          :key="`inv-${i}`"
          v-model="st.chars[st.conf.char].inventory[i]"
          @delete="removeInvItem(i)"
        />

        <q-input class="row" label="Memento" v-model="st.chars[st.conf.char].memento" dense autogrow />
        <q-input class="row" label="Tiny Items" v-model="st.chars[st.conf.char].tinyItems" dense autogrow />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>

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
            st.chars[st.conf.char].secSkills[newSkillName] = skill(newSkillAttr);
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
import { defineComponent, ref, computed } from 'vue';

import { EAge, EAttr } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { BaseChance, DmgBonus, NewAbility, NewSpell, NewWeapon, skill } from 'src/lib/defaults';

import CharAttr from 'src/components/CharAttr.vue';
import CharSkill from 'src/components/CharSkill.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import MoneyField from 'src/components/MoneyField.vue';
import PointsBlock from 'src/components/PointsBlock.vue';
import SpellBlock from 'src/components/SpellBlock.vue';
import AbilityBlock from 'src/components/AbilityBlock.vue';
import ArmourBlock from 'src/components/ArmourBlock.vue';
import ItemRow from 'src/components/ItemRow.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    CharAttr,
    CharSkill,
    WeaponBlock,
    MoneyField,
    PointsBlock,
    SpellBlock,
    AbilityBlock,
    ArmourBlock,
    ItemRow,
  },
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

    const addSpell = () => st.chars[st.conf.char].spells.push(NewSpell());
    const removeSpell = (index: number) =>
      $q
        .dialog({
          message: 'Delete this spell?',
          cancel: true,
        })
        .onOk(() => st.chars[st.conf.char].spells.splice(index, 1));
    const sortSpells = () =>
      st.chars[st.conf.char].spells.sort((a, b) => {
        if (a.rank < b.rank) return -1;
        if (a.rank > b.rank) return 1;
        else return 0;
      });
    const spellsByRank = computed((): number[] => {
      const spells = [0, 0, 0, 0, 0, 0];
      st.chars[st.conf.char].spells.forEach((sp) => {
        spells[sp.rank]++;
      });
      return spells;
    });
    const spellsPrepared = computed((): number => {
      let t = 0;
      st.chars[st.conf.char].spells.forEach((sp) => {
        if (sp.rank > 0 && sp.prepared) t++;
      });
      return t;
    });

    const addAbl = () => st.chars[st.conf.char].abilities.push(NewAbility());
    const removeAbl = (index: number) =>
      $q
        .dialog({
          message: 'Delete this ability?',
          cancel: true,
        })
        .onOk(() => st.chars[st.conf.char].abilities.splice(index, 1));

    const addInvItem = () => st.chars[st.conf.char].inventory.push({ text: '', wt: 1 });
    const removeInvItem = (index: number) =>
      $q
        .dialog({
          message: 'Delete this item?',
          cancel: true,
        })
        .onOk(() => st.chars[st.conf.char].inventory.splice(index, 1));
    const encumberance = computed((): number => {
      let total = 0;
      st.chars[st.conf.char].inventory.forEach((item) => {
        total += item.wt;
      });
      return total;
    });
    const encumberMax = computed((): number => Math.ceil(st.chars[st.conf.char].attributes.STR.score / 2));

    const rollStats = () =>
      $q
        .dialog({
          message: 'Roll and apply Character Stats?',
          cancel: true,
        })
        .onOk(() => {
          const r = (): number => {
            let sum = 0;
            let rolls: number[] = [];
            for (let i = 0; i < 4; i++) {
              rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            rolls = rolls.sort();
            console.log(rolls);
            rolls.shift();
            rolls.forEach((roll) => (sum += roll));
            return sum;
          };

          Object.keys(EAttr).forEach((attr) => (st.chars[st.conf.char].attributes[attr as EAttr].score = r()));
        });
    const statsRolled = computed((): boolean => {
      let total = 0;
      Object.keys(EAttr).forEach((attr) => (total += st.chars[st.conf.char].attributes[attr as EAttr].score));
      return total == 0;
    });

    return {
      st,
      tab,
      EAttr,
      EAge,
      DmgBonus,
      BaseChance,
      rollStats,
      statsRolled,

      showAddSkill,
      removeSecSkill,
      newSkillName,
      newSkillAttr,
      skill,

      addWeapon,
      removeWeapon,

      addSpell,
      removeSpell,
      sortSpells,
      spellsByRank,
      spellsPrepared,

      addAbl,
      removeAbl,

      addInvItem,
      removeInvItem,
      encumberance,
      encumberMax,
    };
  },
});
</script>
