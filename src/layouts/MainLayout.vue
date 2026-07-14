<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar :style="`color: ${colours.text.primary};`">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>{{ t('ui.appTitle') }}</q-toolbar-title>
        <q-btn icon="mdi-arrow-up-bold-hexagon-outline" :label="$q.screen.gt.xs ? t('ui.rollAdvancements') : ''" @click="advance" flat>
          <q-tooltip>{{ t('ui.rollAdvancements') }}</q-tooltip>
        </q-btn>
        <q-btn-dropdown icon="mdi-bed" flat>
          <q-list>
            <q-item clickable v-ripple @click="rest.round()">
              <q-item-section>
                <q-item-label>{{ t('ui.round') }}</q-item-label>
                <q-item-label caption>{{ t('ui.roundCaption') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="rest.stretch()">
              <q-item-section>
                <q-item-label>{{ t('ui.stretch') }}</q-item-label>
                <q-item-label caption>{{ t('ui.stretchCaption') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="rest.shift()">
              <q-item-section>
                <q-item-label>{{ t('ui.shift') }}</q-item-label>
                <q-item-label caption>{{ t('ui.shiftCaption') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-btn class="full-width" :label="t('ui.newCharacter')" flat @click="app.chars.push(NewCharacter())" icon-right="add" />
        <q-separator />

        <q-item
          class="items-center"
          v-for="(c, i) in app.chars"
          :key="`char-${i}`"
          :active="app.conf.char == i"
          active-class="text-accent"
          clickable
          v-ripple
        >
          <q-item-section @click="app.conf.char = i">{{ c.name }}</q-item-section>
          <q-item-section v-if="app.chars.length > 1" side>
            <q-btn icon="delete" flat dense rounded @click="removeChar(i)" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="app.exportData">
          <q-item-section avatar>
            <q-icon name="download" />
          </q-item-section>
          <q-item-section>
            {{ t('ui.exportData') }}
            <q-tooltip>{{ t('ui.exportTooltip') }}</q-tooltip>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="showDataLoad = true">
          <q-item-section avatar>
            <q-icon name="upload" />
          </q-item-section>
          <q-item-section>
            {{ t('ui.loadData') }}
            <q-tooltip>{{ t('ui.loadTooltip') }}</q-tooltip>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <q-toggle :label="t('ui.showSpells')" v-model="app.conf.showSpells" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon name="language" />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="locale"
              :options="[
                { label: 'English', value: 'en' },
                { label: 'Svenska', value: 'sv' }
              ]"
              :label="t('ui.language')"
              dense
              emit-value
              map-options
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="aspect_ratio" />
          </q-item-section>
          <q-item-section>
            <q-select
              v-model="app.conf.sheetWidth"
              :options="widthOptions"
              :label="t('ui.sheetWidth')"
              dense
              emit-value
              map-options
            />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple @click="about">
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('ui.about') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showDataLoad" maximized>
    <q-card>
      <q-card-section class="text-center text-bold bg-secondary">{{ t('ui.loadData') }}</q-card-section>

      <q-card-section class="text-subtitle">
        {{ t('ui.overwriteWarning') }}
      </q-card-section>

      <q-card-section>
        <q-file v-model="fileToLoad" standout :label="t('ui.selectFile')" accept=".json" />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn :label="t('ui.load')" color="primary" @click="loadData" flat />
        <q-btn :label="t('ui.close')" color="warning" @click="showDataLoad = false" flat />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import OBR from '@owlbear-rodeo/sdk';

import type { Attr, DBStore } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useCharacterStore } from 'src/stores/character';

import { NewCharacter } from 'src/lib/defaults';
import { roll } from 'src/lib/util';
import { colours } from 'src/lib/theme';
import { notifySend } from 'src/lib/notify';

const leftDrawerOpen = ref(false);

const app = useCharacterStore();
const $q = useQuasar();
const { t, locale } = useI18n();

const renameDefaultCharacter = (newLocale: string) => {
  app.chars.forEach((c) => {
    if (c.name === 'New character' && newLocale === 'sv') {
      c.name = 'Ny rollperson';
    } else if (c.name === 'Ny rollperson' && newLocale === 'en') {
      c.name = 'New character';
    }
  });
};

// Sync i18n locale with config store
if (app.conf.locale) {
  locale.value = app.conf.locale;
} else {
  app.conf.locale = locale.value;
}
renameDefaultCharacter(locale.value);

watch(locale, (newLocale) => {
  app.conf.locale = newLocale;
  localStorage.setItem('dragonbane_locale', newLocale);
  renameDefaultCharacter(newLocale);
});

const showDataLoad = ref(false);
const fileToLoad = ref(null);
const loadData = () => {
  const f: File = fileToLoad.value as unknown as File;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const data = JSON.parse(ev.target?.result as string) as DBStore;
    app.loadData(data);
    if (data.conf?.locale) {
      locale.value = data.conf.locale;
    }
    showDataLoad.value = false;
  };
  reader.readAsText(f);
};

const removeChar = (index: number) =>
  $q
    .dialog({
      message: t('ui.deleteConfirm', { name: app.chars[index]!.name }),
      cancel: true,
    })
    .onOk(() => {
      app.conf.char = 0;
      app.chars.splice(index, 1);
    });

const rest = {
  round: () => {
    app.char.wp.current += roll(6);
    if (app.char.wp.current > app.char.wp.max) app.char.wp.current = app.char.wp.max;
  },
  stretch: () => {
    rest.round();
    app.char.hp.current += roll(6);
    if (app.char.hp.current > app.char.hp.max) app.char.hp.current = app.char.hp.max;
  },
  shift: () => {
    app.char.wp.current = app.char.wp.max;
    app.char.hp.current = app.char.hp.max;
    Object.keys(app.char.attributes).forEach((attr) => (app.char.attributes[attr as Attr].condition.check = false));
  },
};

const advance = () => {
  $q.dialog({
    message: t('ui.rollAdvancementConfirm'),
    cancel: true,
  }).onOk(() => {
    const advanced = app.rollAdvancements();
    const translatedSkills = advanced.map((skill) => t(`skills.${skill}`, skill));
    
    const msg = advanced.length > 0
      ? t('ui.skillsAdvanced', { skills: translatedSkills.join(', ') })
      : t('ui.noSkillsAdvanced');
    
    $q.dialog({
      message: msg,
    });
    
    void notifySend(
      advanced.length > 0
        ? t('ui.notifyAdvanced', { name: app.char.name, skills: translatedSkills.join(', ') })
        : t('ui.notifyNoAdvanced', { name: app.char.name }),
      'INFO',
    );
  });
};

const about = () =>
  $q.dialog({
    title: `<div class="text-h5">${t('ui.about')}</div>`,
    html: true,
    message: t('ui.aboutContent'),
  });

const widthOptions = computed(() => [
  { label: t('ui.widthNarrow'), value: 480 },
  { label: t('ui.widthStandard'), value: 800 },
  { label: t('ui.widthWide'), value: 1100 },
  { label: t('ui.widthExtraWide'), value: 1400 },
]);

if (!app.conf.sheetWidth) {
  app.conf.sheetWidth = 800;
}

watch(
  () => app.conf.sheetWidth,
  (w) => {
    if (w) {
      try {
        void OBR.action.setWidth(w);
      } catch {
        // Safe fallback outside of Owlbear Rodeo
      }
    }
  },
  { immediate: true }
);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
