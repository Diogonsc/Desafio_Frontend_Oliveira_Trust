<template>
  <div class="containerInfoUser">
    <q-img
      v-if="currentUser && currentUser.image"
      class="imageUser"
      :src="currentUser.image"
    />
    <i v-else class="fa-regular fa-circle-user"></i>
    <div class="boxInfo">
      <span>{{ currentUser && currentUser.nome }}</span>
      <i
        class="fa-solid fa-arrow-right-from-bracket"
        title="Sair da aplicação"
        @click="handleLogout"
      ></i>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useUserLoginStore } from "src/stores/userloginStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "InfoUser",
  setup() {
    const userLoginStore = useUserLoginStore();
    const router = useRouter();

    const handleLogout = async () => {
      try {
        const response = await userLoginStore.logout();
        console.log(response.status);
        if (response.status === 200) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    return {
      currentUser: userLoginStore.currentUser,
      handleLogout,
    };
  },
});
</script>

<style scoped>
.containerInfoUser {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.imageUser {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: contain;
}

.boxInfo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.boxInfo span {
  font-size: 1rem;
  color: var(--dark-color);
}

.boxInfo i {
  font-size: 1rem;
  color: var(--dark-color);
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 0.5rem;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.boxInfo i:hover {
  background-color: var(--background-color);
}
.fa-circle-user {
  font-size: 2rem;
  color: var(--dark-color);
}
</style>
