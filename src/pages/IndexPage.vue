<template>
  <Loader :isLoading="isLoading" />
  <q-page class="containerIndex" v-if="!isLoading">
    <header-component />
    <div class="boxContent">
      <div class="content">
        <h3>BTC Carteiras</h3>
        <q-btn class="btnCart" @click="showAddWalletModal"
          >Adicionar Carteira</q-btn
        >
      </div>
      <div class="inputSearch">
        <search />
      </div>
      <div class="contentTable">
        <TableComponent @edit="handleEdit" />
      </div>
    </div>
    <Modal v-model:visible="isAddWalletModalVisible" title="Adicionar Carteira">
      <q-card-section class="q-pt-none contentModal">
        <q-input
          class="inputs"
          outlined
          v-model="nome"
          label="Nome"
          dense
          clearable
        />
        <q-input
          class="inputs"
          outlined
          v-model="sobrenome"
          label="Sobrenome"
          dense
          clearable
        />
        <q-input
          class="inputs"
          outlined
          v-model="dataNascimento"
          label="Data de nascimento"
          dense
          clearable
          type="date"
        />
        <q-input
          class="inputs"
          outlined
          v-model="email"
          label="E-mail"
          dense
          clearable
        />
        <q-input
          class="inputs"
          outlined
          v-model="endereco"
          label="Endereço"
          dense
          clearable
        />
        <q-input
          class="inputs"
          outlined
          v-model="dataAbertura"
          label="Data de abertura"
          dense
          clearable
          type="date"
        />
        <q-input
          class="inputs"
          outlined
          v-model="enderecoCarteira"
          label="Endereço da Carteira"
          dense
          clearable
        />
        <q-select
          class="inputs"
          outlined
          v-model="baseCurrency"
          :options="optionsBase"
          label="Moeda Base"
        />
        <q-select
          class="inputs"
          outlined
          v-model="targetCurrency"
          :options="options"
          label="Moeda Destino"
        />
        <div class="purchaseValue">
          <q-input
            class="inputs"
            outlined
            v-model="amount"
            label="Valor de compra"
            dense
            clearable
            @keyup="convertCurrency"
          />
          <span class="price"> BTC {{ valorCompra }}</span>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          class="text-capitalize"
          flat
          label="Cancelar"
          color="primary"
          @click="closeModal"
        />
        <q-btn
          v-if="isEditMode"
          class="text-capitalize"
          label="Atualizar"
          color="primary"
          @click="handleSave"
        />
        <q-btn
          v-else
          class="text-capitalize"
          label="Adicionar"
          color="primary"
          @click="handleSave"
        />
      </q-card-actions>
    </Modal>
  </q-page>
</template>

<script>
import HeaderComponent from "src/components/HeaderComponent.vue";
import Search from "src/components/Search.vue";
import TableComponent from "src/components/TableComponent.vue";
import Modal from "src/components/Modal.vue";
import { defineComponent, onMounted, ref } from "vue";
import Loader from "src/components/Loader.vue";
import { useUserStore } from "src/stores/userStore";
import { useCurrencyConverterStore } from "src/stores/currencyConverterStore";
import { useQuasar } from "quasar";
import { format } from "date-fns";

export default defineComponent({
  name: "IndexPage",

  components: {
    HeaderComponent,
    TableComponent,
    Search,
    Modal,
    Loader,
  },
  setup() {
    const userStore = useUserStore();
    const $q = useQuasar();
    const isAddWalletModalVisible = ref(false);
    const isLoading = ref(true);
    const userData = ref(null);
    const id = ref(null);
    const nome = ref("");
    const sobrenome = ref("");
    const email = ref("");
    const endereco = ref("");
    const dataNascimento = ref("");
    const dataAbertura = ref("");
    const enderecoCarteira = ref("");
    const valorCompra = ref("");
    const isEditMode = ref(false);
    const baseCurrency = ref(null);
    const targetCurrency = ref(null);
    const model = ref(null);
    const currencyStore = useCurrencyConverterStore();
    const optionsBase = ref(["BTC"]);
    const options = ref(["BRL", "USD", "EUR"]);
    const amount = ref(null);

    const showAddWalletModal = () => {
      isAddWalletModalVisible.value = true;
    };

    const isLoadingPage = () => {
      setTimeout(() => {
        isLoading.value = false;
      }, 2000);
    };

    const handleEdit = (userData) => {
      isEditMode.value = true;
      isAddWalletModalVisible.value = true;
      nome.value = userData.nome;
      sobrenome.value = userData.sobrenome;
      email.value = userData.email;
      endereco.value = userData.endereco;
      dataNascimento.value = userData.data_nascimento;
      dataAbertura.value = userData.data_abertura;
      enderecoCarteira.value = userData.endereco_carteira;
      valorCompra.value = userData.valor_carteira;
      id.value = userData.id;
      amount.value = userData.valor_carteira;
    };

    const closeModal = () => {
      nome.value = "";
      sobrenome.value = "";
      email.value = "";
      endereco.value = "";
      dataNascimento.value = "";
      dataAbertura.value = "";
      enderecoCarteira.value = "";
      valorCompra.value = "";
      isAddWalletModalVisible.value = false;
      amount.value = 1;
      isEditMode.value = false;
    };

    const generateRandomPassword = (length) => {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      return password;
    };

    const PossibleCombinations = async () => {
      try {
        await currencyStore.fetchCurrencyPairs();
      } catch (error) {
        console.error("Erro ao obter as combinações de moedas:", error);
        $q.notify({
          type: "negative",
          message:
            "Erro ao obter as combinações de moedas. Por favor, tente novamente mais tarde.",
        });
      }
    };

    const convertCurrency = async () => {
      if (!baseCurrency.value || !amount.value) {
        $q.notify({
          type: "negative",
          message:
            "Por favor, selecione a moeda base e insira a quantidade de criptomoeda.",
        });
        return;
      }

      try {
        const rate = await currencyStore.getConversionRate(
          baseCurrency.value,
          targetCurrency.value
        );
        const convertedAmount = amount.value * rate;
        valorCompra.value = convertedAmount.toFixed(8);
      } catch (error) {
        console.error("Erro ao converter moeda:", error);
        $q.notify({
          type: "negative",
          message:
            "Erro ao converter moeda. Por favor, verifique suas seleções e tente novamente.",
        });
      }
    };

    const handleSave = async () => {
      try {
        if (isEditMode.value) {
          userStore.editWallet({
            id: id.value,
            nome: nome.value,
            sobrenome: sobrenome.value,
            email: email.value,
            endereco: endereco.value,
            data_nascimento: dataNascimento.value,
            data_abertura: dataAbertura.value,
            endereco_carteira: enderecoCarteira.value,
            valor_carteira: valorCompra.value,
          });
        } else {
          const randomPassword = generateRandomPassword(10);
          userStore.addWallet({
            nome: nome.value,
            sobrenome: sobrenome.value,
            email: email.value,
            endereco: endereco.value,
            data_nascimento: dataNascimento.value,
            data_abertura: dataAbertura.value,
            endereco_carteira: enderecoCarteira.value,
            valor_carteira: valorCompra.value,
            password: randomPassword,
          });
        }

        $q.notify({
          message: isEditMode.value
            ? "Carteira atualizada com sucesso"
            : "Carteira adicionada com sucesso",
          color: "positive",
          icon: "check_circle",
          position: "top",
        });

        closeModal();
      } catch (error) {
        console.error(error);
        $q.notify({
          message: "Ocorreu um erro.",
          color: "negative",
          icon: "error",
          position: "top",
        });
      }
    };

    onMounted(() => {
      isLoadingPage();
      PossibleCombinations();
    });

    return {
      isAddWalletModalVisible,
      showAddWalletModal,
      isLoading,
      handleEdit,
      userData,
      nome,
      sobrenome,
      email,
      endereco,
      dataNascimento,
      dataAbertura,
      enderecoCarteira,
      valorCompra,
      handleSave,
      closeModal,
      isEditMode,
      model,
      options,
      optionsBase,
      amount,
      baseCurrency,
      targetCurrency,
      convertCurrency,
      formatDate,
    };
  },
});
</script>

<style scoped>
.containerIndex {
  background-color: var(--background-color);
  height: 100vh;
}

.boxContent {
  padding: 0 6rem 1rem 6rem;
}

.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0rem;
}

.content h3 {
  color: var(--dark-color);
  font-size: 1.5rem;
  font-weight: bold;
}

.btnCart {
  background-color: var(--primary-color);
  color: var(--light-color);
  font-weight: 500;
  padding: 0 1.5rem;
  border-radius: 5px;
  text-transform: capitalize;
}

.inputSearch {
  margin: 1rem 0rem;
  height: 5rem;
  background-color: var(--light-color);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.contentTable {
  margin: 1rem 0rem;
  width: 100%;
  height: fit-content;
}

.contentModal {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inputs {
  width: 100%;
}

.purchaseValue {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.price {
  display: flex;
  align-items: center;
  width: 300px;
}
</style>
