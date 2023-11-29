<template>
  <div class="headBox">
    <b style="margin-top: 5px;">&nbsp;&nbsp;计时器</b>
    <div style="padding-top: 5px;padding-right:8px">
      <el-tooltip content="退出" placement="bottom">
        <el-link @click.prevent="exitTime">
          <el-icon size="large">
            <CloseBold />
          </el-icon>
        </el-link>
      </el-tooltip>
    </div>
  </div>
  <div style="padding-left: 8px;" v-if="!startFlag">
    <el-button :icon="Plus" circle type="info" style="margin-bottom: 20px;margin-right:5px" @click.prevent="maxMin++"
      size="small" />
    <b style="font-size: 40px;" v-show="maxMin < 10">0</b>
    <b style="font-size: 40px;">{{ maxMin }}:00</b>
    <el-button :icon="Minus" circle type="info" style="margin-bottom: 20px;margin-left:5px"
      @click.prevent=" maxMin > 0 ? maxMin-- : maxMin;" size="small" />
    <el-tooltip content="开始计时" placement="bottom">
      <el-button type="info" circle style="margin-bottom: 20px;margin-left:15px" color="purple"
        @click.prevent="startTime(maxMin * 60)">
        <el-icon size="large">
          <CaretRight />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
  <div style="padding-left: 8px;" v-if="startFlag">
    <b style="font-size: 40px;"> {{ minutes }}:</b>
    <b style="font-size: 40px;">{{ seconds }}</b>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <el-tooltip content="重置计时">
      <el-button circle color="grey" style="margin-bottom: 15px;" @click="resetTime">
        <el-icon size="small">
          <SwitchButton />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="暂停计时" :show-after="100">
      <el-button type="info" circle style="margin-bottom: 15px;margin-left:15px" color="rgb(120,86,255)"
        @click.prevent="pauseTime" v-show="!pauseFlag">
        <el-icon size="large">
          <VideoPause />
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="开始计时" :show-after="100">
      <el-button type="info" circle style="margin-bottom: 15px;margin-left:15px" color="rgb(120,86,255)"
        @click.prevent="continueTime(currentRemainTime)" v-show="pauseFlag">
        <el-icon size="large">
          <VideoPlay />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
  <br />
  <el-progress :percentage="percentage" v-if="startFlag" color="rgb(120,86,255)" :show-text="false" />
</template>

<script setup lang="ts">
import { CaretRight, CloseBold, Minus, Plus, SwitchButton, VideoPause, VideoPlay } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

const maxMin = ref<number>(5);//定义最大时间
const minutes = ref<string>('00');//剩余分钟
const seconds = ref<string>('00');//剩余秒数
const startFlag = ref<boolean>(false);
const timer = ref();
const currentRemainTime = ref<number>(0);
const pauseFlag = ref<boolean>(false);
const emit = defineEmits(["getTimeFlag"]);
const exitTime = () => {
  emit("getTimeFlag", false);
  clearInterval(timer.value);
  timer.value = null;
  minutes.value = '00';
  seconds.value = '00';
}
const percentage = computed(() => {
  return Math.ceil((parseInt(minutes.value, 10) * 60 + parseInt(seconds.value, 10)) / (maxMin.value * 60) * 100);
});
const startTime = (maxTime: number) => {
  startFlag.value = true;
  pauseFlag.value = false;
  timer.value = setInterval(() => {
    if (maxTime >= 0) {
      minutes.value = Math.floor(maxTime / 60).toString().padStart(2, '0');
      seconds.value = Math.floor(maxTime % 60).toString().padStart(2, '0');
      --maxTime;
      currentRemainTime.value = maxTime;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
}
const resetTime = () => {
  startFlag.value = !startFlag.value;
  clearInterval(timer.value);
  timer.value = null;
  minutes.value = '00';
  seconds.value = '00';
  currentRemainTime.value = 0;
}
const pauseTime = () => {
  clearInterval(timer.value);
  timer.value = null;
  pauseFlag.value = true;
}
const continueTime = (currentRemainTime: number) => {
  pauseFlag.value = false;
  startTime(currentRemainTime);
};
</script>

<style scoped lang="less">
.headBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;
}
</style>