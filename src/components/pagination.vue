<script setup>
import { defineProps } from "vue";

defineProps({
  activePage: Number,
  maxPage: Number,
  changePage: Function,
});
</script>

<template>
  <div class="join">
    <button class="join-item btn" @click="changePage(activePage - 1)" v-if="activePage - 1 > 0">«</button>
    <button class="join-item btn">Page {{ activePage }} / {{ maxPage }}</button>
    <button class="join-item btn" @click="changePage(activePage + 1)" v-if="activePage + 1 <= maxPage">»</button>
  </div>
</template>
