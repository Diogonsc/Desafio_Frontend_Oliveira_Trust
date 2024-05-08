<template>
  <div class="containerLoader" v-if="isLoading">
    <q-spinner-tail class="spinner" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoaderComponent",
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped>
.containerLoader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
.spinner {
  color: var(--danger-color);
  font-size: 5rem;
  animation: spin 1s linear infinite;
}
</style>
