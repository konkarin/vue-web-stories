<script setup lang="ts">
import { ref } from "vue";

import StoryPlayer from "@/components/StoryPlayer.vue";

const stories = [
  {
    id: "1",
    src: "cat.mp4",
    transitionUrl: "https://www.google.com/",
  },
  { id: "2", src: "cat.jpeg", transitionUrl: "" },
];

const currentIndex = ref(0);

const nextStory = () => {
  if (currentIndex.value < stories.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const prevStory = () => {
  if (currentIndex.value !== 0) {
    currentIndex.value--;
  }
};
</script>

<template>
  <main class="StoryView">
    <div class="StoryView__header">
      <div
        v-for="(_, index) in stories"
        class="StoryView__headerLine"
        :class="{
          'StoryView__headerLine--played': index <= currentIndex,
        }"
      ></div>
    </div>
    <div
      v-for="(story, index) in stories"
      v-show="index === currentIndex"
      class="StoryView__container"
    >
      <StoryPlayer
        :src="story.src"
        :transition-url="story.transitionUrl"
        :index="index"
        :is-visible="index === currentIndex"
        @prev="prevStory()"
        @next="nextStory()"
      />
    </div>
  </main>
</template>

<style scoped>
.StoryView {
  width: 100vw;
  height: 100vh;
}
.StoryView__noStory {
  display: grid;
  justify-content: center;
  align-content: center;
  height: 100%;
  font-size: 24px;
}
.StoryView__header {
  padding: 10px 5px;
  display: flex;
  gap: 5px;
  position: absolute;
  width: 100%;
  z-index: 10;
}
.StoryView__headerLine {
  flex-grow: 1;
  border-bottom: 2px solid #666;
}

.StoryView__headerLine--played {
  border-bottom-color: #fff;
}

.StoryView__container {
  width: 100%;
  height: 100%;
  background-color: #000;
}
</style>
