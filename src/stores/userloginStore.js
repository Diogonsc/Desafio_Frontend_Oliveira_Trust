import { defineStore } from "pinia";
import axios from "axios";

export const useUserLoginStore = defineStore("userLogin", {
  state: () => ({
    currentUser: null, // Aqui você pode armazenar os dados do usuário logado
  }),
  getters: {},
  actions: {
    async login(credentials) {
      try {
        const response = await axios.get("http://localhost:3004/users", {
          params: credentials,
        });

        if (
          response.status === 200 &&
          response.data[0].email === credentials.email &&
          response.data[0].password === credentials.password
        ) {
          // Salvar os dados do usuário no estado do store
          this.currentUser = response.data[0];

          return { status: 200, message: "Login bem-sucedido" };
        } else {
          throw new Error("Email ou senha incorretos");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    },

    async logout() {
      try {
        // Limpar os dados do usuário ao fazer logout
        this.currentUser = null;
        return { status: 200, message: "Logout bem-sucedido" };
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    },
  },
});
