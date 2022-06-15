<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { isSubsettingsGroup } from '@/types/SettingsState'
import { useSettingsStore } from '@/stores/settings'
import { usePomodoroStore } from '@/stores/pomodoro'
import ProgressRing from '@/components/extensions/pomodoro/ProgressRing.vue'
import BorderButton from '@/components/global/BorderButton.vue'
import AppIcon from '@/components/global/AppIcon.vue'

type TimerMode = 'focus' | 'rest'

const pomodoro = usePomodoroStore()
const settings = useSettingsStore()
const { setExpandedGroupId, setGroupChecked, findSettingsGroupByName, toggleIsSettings } = settings

const {
  numberOfPomodorosBeforeLongRest,
  getFocusTimerMinutes,
  getRestTimerMinutes,
  getLongRestTimerMinutes,
  getAlarmOn,
  getLoopTimerOn,
} = storeToRefs(pomodoro)
const { setPomodoroSetting } = pomodoro

let isTimerActive = ref<boolean>(false)

function startTimer() {
  isTimerActive.value = true
  round()
}

let timerFinished = ref<boolean>(true)
let timerId = ref<number | null>(null)
let timerMode = ref<TimerMode | null>(null)
let pomodorosBeforeLongRest = ref<number>(0)

function round() {
  timerFinished.value = false
  if (timerId.value) {
    clearInterval(timerId.value)
  }
  if (timerMode.value === 'focus') {
    timerMode.value = 'rest'
  } else {
    timerMode.value = 'focus'
  }

  if (timerMode.value === 'focus') {
    if (pomodorosBeforeLongRest.value === 0) {
      pomodorosBeforeLongRest.value = numberOfPomodorosBeforeLongRest.value
    }
    pomodorosBeforeLongRest.value -= 1
  }

  let minutes = timerMode.value === 'focus' ? getFocusTimerMinutes.value : getRestTimerMinutes.value

  if (pomodorosBeforeLongRest.value === 0 && timerMode.value === 'rest') {
    timer(getLongRestTimerMinutes.value)
  } else {
    timer(minutes)
  }
}

let percentTimeLeft = ref<number>(100)
let timerValue = ref<string>('00:00')

async function timer(mins: number) {
  const startTimestamp = new Date().getTime()
  const finishTimestamp = startTimestamp + mins * 60000
  const fullPercent = mins * 60000
  let timerInterval = setInterval(() => {
    let nowTimestamp = new Date().getTime()

    let differenceMs = finishTimestamp - nowTimestamp
    percentTimeLeft.value = (differenceMs / fullPercent) * 100
    let minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((differenceMs % (1000 * 60)) / 1000)

    if (differenceMs < 0) {
      timerFinished.value = true
      return
    }

    timerValue.value = `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`
  }, 100)

  timerId.value = timerInterval
}

function stopTimer() {
  if (timerId.value === null) {
    throw new Error('stopTimer: timer id value is null.')
  }
  clearInterval(timerId.value)
  timerId.value = null
  timerMode.value = null
  timerValue.value = '00:00'
  isTimerActive.value = false
  timerFinished.value = true
  percentTimeLeft.value = 100
}
/** Expand extensions settings group, set pomodoro settings group checked, open settings window. */
function openSettings() {
  const foundExtensionsGroup = findSettingsGroupByName('extensions')
  const pomodoroSettings = findSettingsGroupByName('pomodoro')
  if (!foundExtensionsGroup) {
    throw new Error('openSettings: extensions settings group not found.')
  }
  if (!isSubsettingsGroup(foundExtensionsGroup)) {
    throw new Error('openSettings: wrong type of extensions settings group.')
  }
  if (!pomodoroSettings) {
    throw new Error('openSettings: pomodoro settings group not found.')
  }
  setExpandedGroupId(foundExtensionsGroup.id)
  setGroupChecked(pomodoroSettings.id)
  toggleIsSettings()
}

function notification() {
  if (Notification.permission === 'granted') {
    setPomodoroSetting('notifications', !getAlarmOn.value)
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setPomodoroSetting('notifications', !getAlarmOn.value)
      }
    })
  }
}

watch(timerFinished, (newValue) => {
  if (!newValue) return
  if (!isTimerActive.value) return
  let loop = getLoopTimerOn.value
  let notifications = getAlarmOn.value
  let modeForMessage = timerMode.value === 'focus' ? 'rest' : 'focus'
  if (timerId.value !== null) {
    clearInterval(timerId.value)
  }
  if (!loop && !notifications) {
    // just wait until user clicked on button for changing timers round
  }
  if (!loop && notifications && Notification.permission === 'granted') {
    const notification = new Notification('Things Pomodoro Timer', {
      body: `It's time to ${modeForMessage} my friend!
        Please switch mode or click on this message. `,
    })
    notification.onclick = () => round()
  }
  if (loop && !notifications) {
    round()
  }
  if (loop && notifications && Notification.permission === 'granted') {
    new Notification('Things Pomodoro Timer', {
      body: `It's time to ${modeForMessage} my friend!
        The mode will be switched automatically. `,
    })
    round()
  }
})
</script>

<template>
  <div @click.stop class="pomodoro">
    <ProgressRing class="progress-ring" :radius="90" :progress="percentTimeLeft" :stroke="2" />
    <div class="pomodoro__content z-index" v-if="!isTimerActive">
      <div class="pomodoro-settings">
        <div @click="openSettings" data-title="Set Timers" class="tooltip up-center">
          <AppIcon class="icon-btn" name="pending_actions" />
        </div>

        <div @click="notification()" class="pomodoro__alarm-toggle">
          <div v-if="getAlarmOn" data-title="Alarm notifications enabled" class="tooltip up-center">
            <AppIcon class="icon-btn" name="alarm_on" />
          </div>
          <div v-else data-title="Alarm notifications disabled" class="tooltip up-center">
            <AppIcon class="icon-btn" name="alarm_off" />
          </div>
        </div>

        <div @click="setPomodoroSetting('loop', !getLoopTimerOn)" class="pomodoro__loop-toggle">
          <div v-if="getLoopTimerOn" data-title="Timer loop enabled" class="tooltip up-center">
            <AppIcon class="icon-btn" name="sync" />
          </div>
          <div v-else data-title="Timer loop disabled" class="tooltip up-center">
            <AppIcon class="icon-btn" name="sync_disabled" />
          </div>
        </div>
      </div>

      <BorderButton @click="startTimer" class="timer-button"> start </BorderButton>
    </div>
    <div v-if="isTimerActive" class="pomodoro__content z-index">
      <div class="pomodoro__condition">{{ timerMode }}</div>
      <div class="pomodoro__timer">{{ timerValue }}</div>
      <BorderButton v-if="!timerFinished" @click="stopTimer" class="timer-button">
        stop
      </BorderButton>
      <BorderButton v-if="timerFinished" @click="round" class="timer-button">
        {{ timerMode === 'focus' ? 'rest' : 'focus' }}
      </BorderButton>
    </div>
  </div>
</template>

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
    color: var(--text-color-secondary);
    font-size: 2rem;
  }
  &__timer {
    color: var(--text-color-secondary);
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
