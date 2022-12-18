<script setup lang="ts">
import { ref, computed, watch, toRefs, type DirectiveHook } from "vue";

const props = defineProps<{
  src: string;
  transitionUrl: string;
  index: number;
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: "prev" | "next"): void;
}>();

const vVideoControl: DirectiveHook<HTMLVideoElement, null, boolean> = async (
  el,
  binding
) => {
  if (binding.value) {
    await el.play();
  } else {
    el.pause();
    el.currentTime = 0;
  }
};

const videoRef = ref<HTMLVideoElement | null>(null);
const isVisible = computed(() => {
  return props.isVisible;
});

const isImg = computed(() => {
  const extention = props.src.split(".").pop();
  const imgExtensions = ["jpg", "jpeg", "png", "webp"];
  return imgExtensions.includes(`${extention}`);
});
const isVideo = computed(() => {
  const extention = props.src.split(".").pop();
  const videoExtensions = ["mp4", "mov"];
  return videoExtensions.includes(`${extention}`);
});

const transition = (transitionUrl: string) => {
  location.href = transitionUrl;
};

// 共通
const INTERVAL_MS = 10;

// ロングタップ用
const pressingTimerId = ref<NodeJS.Timeout>();
const pressingCounter = ref(0);
const isPressing = ref(false);
const PRESSING_THRESHOLD = 200;

// 画像用
const IMAGE_DISPLAY_MS = 5000;
const imageDisplayTimerId = ref<NodeJS.Timeout>();
const imageDisplayCounter = ref(0);

const resetImgTimer = (key: "prev" | "next") => {
  if (key === "prev" && props.index === 0) {
    return;
  } else {
    imageDisplayCounter.value = 0;
    if (imageDisplayTimerId.value !== undefined) {
      clearInterval(imageDisplayTimerId.value);
      imageDisplayTimerId.value = undefined;
    }
  }
};

watch(imageDisplayCounter, (newVal, _) => {
  if (newVal >= IMAGE_DISPLAY_MS) {
    emit("next");
    resetImgTimer("next");
  }
});

watch(
  isVisible,
  (newVal) => {
    if (isImg.value && newVal) {
      imageDisplayTimerId.value = setInterval(() => {
        // タップ時はカウントしない
        if (isPressing.value) {
          return;
        }
        imageDisplayCounter.value += INTERVAL_MS;
      }, INTERVAL_MS);
    }
  },
  {
    immediate: true,
  }
);

const handlePressStart = () => {
  isPressing.value = true;

  if (isVideo.value) {
    videoRef.value?.pause();
  }

  pressingTimerId.value = setInterval(() => {
    pressingCounter.value += INTERVAL_MS;
  }, INTERVAL_MS);
};

const handlePressEnd = (key: "prev" | "next") => {
  if (isVideo.value) {
    if (pressingCounter.value < PRESSING_THRESHOLD) {
      if (props.index === 0) {
        videoRef.value?.play();
      }
      emit(key);
    } else {
      videoRef.value?.play();
    }
  }

  if (isImg.value) {
    if (pressingCounter.value < PRESSING_THRESHOLD) {
      resetImgTimer(key);
      emit(key);
    }
  }

  isPressing.value = false;
  pressingCounter.value = 0;
  clearInterval(pressingTimerId.value);
  pressingTimerId.value = undefined;
};

const handleVideoEnded = () => {
  pressingCounter.value = 0;
  emit("next");
};
</script>

<template>
  <img v-if="isImg" :src="src" class="StoryPlayer" />
  <video
    v-if="isVideo"
    v-video-control="isVisible"
    ref="videoRef"
    class="StoryPlayer"
    :src="src"
    playsinline
    muted
    @ended="handleVideoEnded"
  ></video>
  <button
    class="StoryPlayerPrev"
    @touchstart.prevent="handlePressStart()"
    @touchend.prevent="handlePressEnd('prev')"
    @mousedown="handlePressStart()"
    @mouseup="handlePressEnd('prev')"
  ></button>
  <button
    class="StoryPlayerNext"
    @touchstart.prevent="handlePressStart()"
    @touchend.prevent="handlePressEnd('next')"
    @mousedown="handlePressStart()"
    @mouseup="handlePressEnd('next')"
  ></button>
  <button
    v-if="transitionUrl !== ''"
    class="StoryPlayerLink"
    @click="transition(transitionUrl)"
  >
    詳しくはこちら
  </button>
</template>

<style scoped>
button {
  appearance: none;
  background: none;
  margin: 0;
  padding: 0;
  border: 0;
}

.StoryPlayer {
  position: absolute;
  height: 100%;
  width: 100%;
  object-fit: contain;
}
.StoryPlayerPrev {
  position: absolute;
  height: 100%;
  width: 20%;
  left: 0;
}
.StoryPlayerNext {
  position: absolute;
  height: 100%;
  width: 80%;
  right: 0;
}
.StoryPlayerLink {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  width: 150px;
  height: 40px;
  background-color: #eee;
  color: #666;
  font-size: 16px;
  font-weight: bold;
  border-radius: 30px;
  margin: auto;
  padding: 0 12px;
}
</style>
