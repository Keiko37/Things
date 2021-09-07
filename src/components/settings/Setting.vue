<template>
  <div class="setting">
    <h1 class="setting__title">{{ setting.title }}</h1>

    <div class="setting__multiple" v-if="setting.type === 'multiple'">
      <div v-for="item in setting.values" :key="item.title">
        <input
          class="setting__radio"
          type="radio"
          :id="item.title"
          :name="setting.title"
          :value="item.value"
          :checked="item.value === setting.selectedValue"
          @click="changeSetting($event, group, setting.title, subsettingGroup)"
        />
        <label :for="item.title">{{ item.title }}</label>
      </div>
    </div>

    <div class="setting__toggle" v-if="setting.type === 'toggle'">
      <input
        :checked="setting.selectedValue"
        :id="'checkbox__' + setting.title"
        type="checkbox"
        class="toggle"
        @change="changeSetting($event, group, setting.title, subsettingGroup)"
      />
      <label :for="'checkbox__' + setting.title" class="toggle-trail">
        <span class="toggle-handler"></span>
      </label>
    </div>

    <div v-if="setting.type === 'number'" class="setting__number">
      <button @click="changeNumber(false)" class="setting__number-button">
        <span
          class="material-icons-outlined material-icons icon-btn md-light md-18"
        >
          remove
        </span>
      </button>
      <input
        v-model="value"
        class="setting__number-input"
        step="1"
        type="number"
        readonly
      />
      <button @click="changeNumber(true)" class="setting__number-button">
        <span
          class="material-icons-outlined material-icons icon-btn md-light md-18"
        >
          add
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Setting',
  props: {
    group: Object,
    setting: Object,
    subsettingGroup: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      value: 0,
      buttonNumberClicked: null,
    };
  },
  computed: {
    ...mapGetters(['getAppSettings']),
  },
  methods: {
    ...mapActions(['updateSetting', 'timerClockVisible']),
    changeSetting(event, group, settingTitle, subsettingGroup) {
      let settingObj;

      if (this.setting.type === 'toggle') {
        settingObj = {
          newValue: event.target.checked,
          groupOfSettings: group,
          settingName: settingTitle,
          subsettingGroup: subsettingGroup,
        };
      }

      if (this.setting.type === 'number') {
        settingObj = {
          newValue: this.value,
          groupOfSettings: group,
          settingName: settingTitle,
          subsettingGroup: subsettingGroup,
        };
      }

      if (this.setting.type === 'multiple') {
        settingObj = {
          newValue: event.target.value,
          groupOfSettings: group,
          settingName: settingTitle,
          subsettingGroup: subsettingGroup,
        };
      }

      if (this.setting.title === 'notifications' && event.target.checked) {
        if (Notification.permission === 'granted') {
          this.updateSetting(settingObj);
        }

        if (Notification.permission === 'denied') {
          setTimeout(() => (event.target.checked = false), 400);
        }

        if (Notification.permission === 'default') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              this.updateSetting(settingObj);
            }
            if (permission === 'denied') {
              event.target.checked = false;
              this.updateSetting({
                newValue: false,
                groupOfSettings: group,
                settingName: settingTitle,
                subsettingGroup: subsettingGroup,
              });
            }
          });
        }

        return;
      }

      this.updateSetting(settingObj);

      if (this.group.title === 'clock') {
        this.timerClockVisible();
      }
    },
    changeNumber(boolean) {
      if (
        boolean &&
        this.subsettingGroup.title === 'pomodoro' &&
        this.value <= 99
      ) {
        ++this.value;
      }
      if (
        !boolean &&
        this.subsettingGroup.title === 'pomodoro' &&
        this.value > 1
      ) {
        --this.value;
      }
      this.changeSetting(
        { type: 'number' },
        this.group,
        this.setting.title,
        this.subsettingGroup
      );
    },
  },
  mounted() {
    this.value = this.setting.selectedValue;
  },
};
</script>

<style lang="scss" scoped>
.setting {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding-bottom: 5px;
  margin: 0 0 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  &__title {
    font-size: 1.5rem;
    flex: 0 1 60%;
    text-transform: capitalize;
  }
  &__multiple {
    display: flex;
    flex: 0 1 60%;
    justify-content: space-evenly;
  }
  &__radio {
    display: none;
  }
  &__radio + label {
    cursor: pointer;
  }
  &__radio:checked + label {
    font-weight: 500;
  }
  &__number {
    position: relative;
  }
  &__number-input {
    background-color: transparent;
    position: absolute;
    color: $text-color;
    width: 2rem;
    height: 2rem;
    cursor: default;
    user-select: none;
  }
  &__number-button {
    background-color: transparent;
    border-radius: 50%;
    height: 100%;
    width: 2rem;
    height: 2rem;
    &:first-child {
      margin-right: 5px;
    }
    &:last-child {
      margin-left: 10px;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

// toggle checkbox
.toggle {
  position: absolute;
  opacity: 0;
  z-index: -1;
  &-trail {
    display: flex;
    align-items: center;
    width: 3em;
    height: 1.5em;
    background: transparent;
    border-radius: 2.5em;
    border: 1px solid $text-color-secondary;
    transition: all 0.5s ease;
    cursor: pointer;
  }
  &-handler {
    display: flex;
    margin-left: 0.1em;
    justify-content: center;
    align-items: center;
    width: 1.2em;
    height: 1.2em;
    background: transparent;
    border: 1px solid $text-color-secondary;
    border-radius: 50%;
    transition: all 0.5s ease;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
  &:checked + .toggle-trail {
    .toggle-handler {
      margin-left: 53%;
      &::before {
        content: '\2714';
        font-size: 0.8em;
      }
    }
  }
}
</style>
