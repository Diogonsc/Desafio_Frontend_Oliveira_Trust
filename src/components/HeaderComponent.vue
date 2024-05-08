<template>
  <div class="containerHeader">
    <q-img class="logotipo" src="src/assets/logotipoOliveiraTrust.png" />
    <info-user />
  </div>
</template>

<script scoped>
import { defineComponent } from "vue";
import InfoUser from "./InfoUser.vue";

export default defineComponent({
  components: { InfoUser },
  name: "HeaderComponent",
});
</script>

<style scoped>
.containerHeader {
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6rem;
  background-color: var(--light-color);
}

.logotipo {
  width: 200px;
  object-fit: cover;
}
</style>
