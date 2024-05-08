import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
  }),
  getters: {
    getUsers: (state) => state.users,
  },
  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3004/users");
        const userWithoutPassword = response.data.map((user) => {
          delete user.password;
          return user;
        });
        this.users = userWithoutPassword;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    async addWallet(user) {
      try {
        const response = await axios.post("http://localhost:3004/users", user);
        this.users.push(response.data);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },

    async handleSearch(name, lastName, email) {
      try {
        const response = await axios.get("http://localhost:3004/users");
        let users = response.data;

        if (name) {
          users = users.filter((user) => user.nome.includes(name));
        }
        if (lastName) {
          users = users.filter((user) => user.sobrenome.includes(lastName));
        }
        if (email) {
          users = users.filter((user) => user.email.includes(email));
        }

        this.users = users;
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    },

    async editWallet(user) {
      try {
        const response = await axios.put(
          `http://localhost:3004/users/${user.id}`,
          user
        );
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users.splice(index, 1, response.data);
        }
      } catch (error) {
        console.error("Error editing user:", error);
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`http://localhost:3004/users/${userId}`);
        this.users = this.users.filter((user) => user.id !== userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
  },
});
