<template>
  <q-card>
    <q-card-section class="text-center text-h4 bg-grey-9">
      {{ name }}
    </q-card-section>

    <q-card-section class="row justify-evenly items-center q-gutter-lg">
      <q-input class="col" type="number" label="Boons" v-model.number="b.boons" standout>
        <template v-slot:before>
          <q-icon name="mdi-emoticon-happy" />
        </template>
      </q-input>
      <q-input class="col" type="number" label="Banes" v-model.number="b.banes" standout>
        <template v-slot:after>
          <q-icon name="mdi-emoticon-sad" />
        </template>
      </q-input>
    </q-card-section>

    <q-card-section class="row justify-evenly items-center q-gutter-lg">
      <q-btn class="col-12" icon="mdi-dice-d20" @click="rollIt" flat rounded size="lg" />
      <div class="col text-center text-h4">{{ d20Result.join(', ') }} vs {{ target }}</div>
    </q-card-section>

    <q-card-section v-if="rolled" class="row justify-evenly items-center q-gutter-lg">
      <div class="col text-center text-h4">
        {{ selectResult() <= target ? 'Success!' : 'Failure.' }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

//import { ERollType } from 'src/components/models';
import { roll, sleep, deepCopy } from 'src/lib/util';

export default defineComponent({
  name: 'DiceRoller',
  props: {
    name: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    boons: {
      type: Number,
      default: 0,
    },
    banes: {
      type: Number,
      default: 0,
    },
    rollType: {
      type: String, // Actually ERollType
      required: true,
    },
  },
  emits: ['close'],
  setup(props) {
    const b = ref({ boons: props.boons, banes: props.banes });
    const rolled = ref(false);

    const mods = computed((): number => b.value.boons - b.value.banes);
    const d20Result = ref(Array(Math.abs(mods.value) + 1).fill(0));
    watch(
      () => mods.value,
      () => {
        rolled.value = false;
        d20Result.value = Array(Math.abs(mods.value) + 1).fill(0);
      }
    );

    const rollIt = () => {
      rolled.value = false;
      void (async () => {
        for (let i = 0; i < 20; i++) {
          d20Result.value.forEach((v, i) => (d20Result.value[i] = roll(20)));
          await sleep(75 + i * 10);
        }
        rolled.value = true;
      })();
    };

    const selectResult = (): number => {
      let cmp = deepCopy(d20Result.value);
      const sortFn = (a: number, b: number): number => {
        if (a < b) return -1;
        else if (b < a) return 1;
        else return 0;
      };

      mods.value < 0 ? cmp.sort(sortFn).reverse() : cmp.sort(sortFn);
      //console.log(`${cmp} : ${cmp[0]}`);
      return cmp[0];
    };

    return {
      b,
      d20Result,
      rollIt,
      mods,
      rolled,
      selectResult,
    };
  },
});
</script>
