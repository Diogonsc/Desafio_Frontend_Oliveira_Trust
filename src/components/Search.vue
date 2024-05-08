<template>
  <div class="containerInputs">
    <q-input
      class="inputs"
      outlined
      v-model="searchName"
      label="Nome"
      dense
      clearable
    />
    <q-input
      class="inputs"
      outlined
      v-model="searchLastName"
      label="Sobrenome"
      dense
      clearable
    />
    <q-input
      class="inputs"
      outlined
      v-model="searchEmail"
      label="E-mail"
      dense
      clearable
    />
    <q-btn
      outline
      color="primary"
      :icon="searchIcon"
      :label="searchLabel"
      class="btnSearch text-capitalize"
      @click="toggleSearch"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useUserStore } from "../stores/userStore.js";

export default defineComponent({
  name: "SearchComponent",
  setup() {
    const store = useUserStore();
    const searchName = ref("");
    const searchLastName = ref("");
    const searchEmail = ref("");
    const isSearching = ref(false);
    const searchLabel = ref("Buscar");
    const searchIcon = ref("search");

    const search = async () => {
      store.handleSearch(
        searchName.value,
        searchLastName.value,
        searchEmail.value
      );
      searchLabel.value = "Limpar";
      searchIcon.value = "clear";
      isSearching.value = true;
    };

    const clearSearch = () => {
      searchName.value = "";
      searchLastName.value = "";
      searchEmail.value = "";
      store.handleSearch("", "", "");
      searchLabel.value = "Buscar";
      searchIcon.value = "search";
      isSearching.value = false;
    };

    const toggleSearch = () => {
      if (isSearching.value) {
        clearSearch();
      } else {
        search();
      }
    };

    return {
      searchName,
      searchLastName,
      searchEmail,
      searchLabel,
      searchIcon,
      toggleSearch,
    };
  },
});
</script>

<style scoped>
.containerInputs {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

.inputs {
  width: 100%;
}

.btnSearch {
  width: 100%;
  max-width: fit-content;
}
</style>
