<template>
  <q-page class="containerLogin">
    <div class="boxImage">
      <BackgroundWaves />
    </div>
    <div class="boxForm">
      <q-img class="imageSrc" src="src/assets/logotipoOliveiraTrust.png" />
      <span>Bem-vindo, Faça login para continuar.</span>
      <q-form class="form" @submit.prevent="login">
        <q-input
          class="input"
          v-model="email"
          label="Email"
          outlined
          type="email"
          mask="email"
        />
        <q-input
          class="input"
          v-model="password"
          label="Senha"
          outlined
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div v-if="loading" class="full-width btnLogin">
          <q-spinner-tail color="white" size="2em" />
        </div>

        <q-btn v-else label="Login" type="submit" class="full-width btnLogin" />
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useUserLoginStore } from "src/stores/userloginStore";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import BackgroundWaves from "src/components/BackgroundWaves.vue";
export default defineComponent({
  components: { BackgroundWaves },
  name: "LoginPage",
  setup() {
    const userStore = useUserLoginStore();
    const $q = useQuasar();
    const email = ref("");
    const password = ref("");
    const isPwd = ref(true);
    const loading = ref(false);
    const router = useRouter();

    const login = async () => {
      try {
        loading.value = true;
        const response = await userStore.login({
          email: email.value,
          password: password.value,
        });

        if (response.status === 200) {
          router.push("/home");
        }
      } catch (error) {
        $q.notify({
          message: "Email ou senha incorretos",
          color: "negative",
          icon: "report_problem",
          position: "top-right",
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      login,
      isPwd,
      loading,
      router,
    };
  },
});
</script>
<style scoped>
.containerLogin {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.boxImage {
  flex: 1;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--danger-color);
}

.boxForm {
  width: 40rem;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.imageSrc {
  width: 20rem;
  object-fit: cover;
}
span {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
  color: var(--dark-color);
}
.form {
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input {
  width: 100%;
}

.btnLogin {
  padding: 0.5rem;
  background-color: var(--danger-color);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
}

::v-deep .q-field--outlined .q-field__control,
::v-deep .q-field--outlined .q-field__native,
::v-deep .q-field--outlined .q-field__bottom {
  color: var(--danger-color); /* Defina a cor do texto */
  border-color: var(--danger-color); /* Defina a cor da borda */
}

/* Anule o estilo encapsulado do q-btn */
::v-deep .q-btn--standard {
  background-color: var(--danger-color); /* Defina a cor de fundo */
  color: white; /* Defina a cor do texto */
}
</style>
