<template>
  <div @click.stop class="pomodoro">
    <ProgressRing
      class="progress-ring"
      :radius="90"
      :progress="percentTimeLeft"
      :stroke="2"
    />
    <div class="pomodoro__content z-index" v-if="!isTimerActive">
      <div class="pomodoro-settings">
        <div
          @click="openSettings"
          data-title="Set Timers"
          class="tooltip up-center"
        >
          <span
            class="
              material-icons-outlined material-icons
              icon-btn
              md-light md-30
            "
          >
            pending_actions
          </span>
        </div>

        <div @click="notification()" class="pomodoro__alarm-toggle">
          <div
            v-if="getAlarmOn"
            data-title="Alarm notifications enabled"
            class="tooltip up-center"
          >
            <span
              class="
                icon-btn
                material-icons material-icons-round
                md-light md-30
              "
              >alarm_on</span
            >
          </div>
          <div
            v-if="!getAlarmOn"
            data-title="Alarm notifications disabled"
            class="tooltip up-center"
          >
            <span
              class="
                icon-btn
                material-icons-round material-icons
                md-light
                material-icons-outlined
                md-30
              "
              >alarm_off</span
            >
          </div>
        </div>

        <div
          @click="
            setPomodoroToggle({
              searchedSetting: 'loop',
              newValue: !getLoopTimerOn,
            })
          "
          class="pomodoro__loop-toggle"
        >
          <div
            v-if="getLoopTimerOn"
            data-title="Timer loop enabled"
            class="tooltip up-center"
          >
            <span
              class="
                icon-btn
                material-icons material-icons-round
                md-light md-30
              "
              >loop</span
            >
          </div>
          <div
            v-if="!getLoopTimerOn"
            data-title="Timer loop disabled"
            class="tooltip up-center"
          >
            <span
              class="
                icon-btn
                material-icons material-icons-round
                md-light md-30
              "
              >sync_disabled</span
            >
          </div>
        </div>
      </div>

      <BorderButton @click="startTimer" class="timer-button" text="start" />
    </div>
    <div v-if="isTimerActive" class="pomodoro__content z-index">
      <div class="pomodoro__condition">{{ timerMode }}</div>
      <div class="pomodoro__timer">{{ timerValue }}</div>
      <BorderButton
        v-if="!timerFinished"
        @click="stopTimer"
        class="timer-button"
        text="stop"
      />
      <BorderButton
        v-if="timerFinished"
        @click="round"
        class="timer-button"
        :text="timerMode === 'focus' ? 'rest' : 'focus'"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProgressRing from '@/components/extensions/pomodoro/ProgressRing';
import BorderButton from '@/components/BorderButton';

export default {
  name: 'Pomodoro',
  components: { ProgressRing, BorderButton },
  computed: {
    ...mapGetters([
      'getAlarmOn',
      'getLoopTimerOn',
      'getFocusTimerMinutes',
      'getRestTimerMinutes',
    ]),
  },
  data() {
    return {
      percentTimeLeft: 100,
      isTimerActive: false,
      timerId: null,
      timerValue: '00:00',
      timerFinished: true,
      timerMode: null,
    };
  },
  methods: {
    ...mapActions([
      'setPomodoroToggle',
      'toggleSetting',
      'selectNav',
      'selectSubsetting',
    ]),
    startTimer() {
      this.isTimerActive = true;
      this.round();
    },
    stopTimer() {
      clearInterval(this.timerId);
      this.timerId = null;
      this.timerMode = null;
      this.timerValue = '00:00';
      this.isTimerActive = false;
      this.timerFinished = true;
      this.percentTimeLeft = 100;
    },
    round() {
      this.timerFinished = false;
      clearInterval(this.timerId);
      if (this.timerMode === 'focus') {
        this.timerMode = 'rest';
      } else {
        this.timerMode = 'focus';
      }

      const minutes =
        this.timerMode === 'focus'
          ? this.getFocusTimerMinutes
          : this.getRestTimerMinutes;

      this.timer(minutes);
    },
    async timer(mins) {
      const startTimestamp = new Date().getTime();
      const finishTimestamp = startTimestamp + mins * 60000;
      const fullPercent = mins * 60000;
      let timerInterval = setInterval(() => {
        let nowTimestamp = new Date().getTime();

        let differenceMs = finishTimestamp - nowTimestamp;
        this.percentTimeLeft = (differenceMs / fullPercent) * 100;
        let minutes = Math.floor(
          (differenceMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        let seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);

        if (differenceMs < 0) {
          this.timerFinished = true;
          return;
        }

        this.timerValue = `${minutes < 10 ? `0${minutes}` : minutes}:${
          seconds < 10 ? `0${seconds}` : seconds
        }`;
      }, 100);

      this.timerId = timerInterval;
    },
    openSettings() {
      this.selectNav(1);
      this.selectSubsetting({
        group: { title: 'extensions' },
        subsettingIndex: 0,
      });
      this.toggleSetting();
    },
    notification() {
      if (Notification.permission === 'granted') {
        this.setPomodoroToggle({
          searchedSetting: 'notifications',
          newValue: !this.getAlarmOn,
        });
      }
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            this.setPomodoroToggle({
              searchedSetting: 'notifications',
              newValue: !this.getAlarmOn,
            });
          }
        });
      }
    },
  },
  watch: {
    timerFinished(newValue) {
      if (!newValue) return;
      if (!this.isTimerActive) return;
      let loop = this.getLoopTimerOn;
      let notifications = this.getAlarmOn;
      let modeForMessage = this.timerMode === 'focus' ? 'rest' : 'focus';
      clearInterval(this.timerId);
      if (!loop && !notifications) {
        // just wait until user clicked on button for changing timers round
      }
      if (!loop && notifications && Notification.permission === 'granted') {
        const notification = new Notification('Things Pomodoro Timer', {
          body: `It's time to ${modeForMessage} my friend!
          Please switch mode or click on this message. `,
        });
        notification.onclick = () => this.round();
      }
      if (loop && !notifications) {
        this.round();
      }
      if (loop && notifications && Notification.permission === 'granted') {
        new Notification('Things Pomodoro Timer', {
          body: `It's time to ${modeForMessage} my friend!
          The mode will be switched automatically. `,
        });
        this.round();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pomodoro {
  // outline: 1px solid red;
  position: relative;
  align-self: start;
  top: 5%;
  left: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__content {
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 15px;
    height: 80%;
  }
  &__condition {
    text-transform: capitalize;
    color: $text-color-secondary;
    font-size: 2rem;
  }
  &__timer {
    color: $text-color-secondary;
    font-size: 3rem;
  }
}
.progress-ring {
  opacity: 0.7;
}
.pomodoro-settings {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}
.timer-button {
  padding: 4px 18px;
  letter-spacing: 1px;
  font-size: 18px;
}
.z-index {
  z-index: 1;
}
</style>
