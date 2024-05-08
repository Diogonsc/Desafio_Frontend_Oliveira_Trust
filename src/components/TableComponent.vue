<template>
  <div class="containerTable">
    <div class="box">
      <p class="title">Carteira</p>
      <q-btn
        outline
        color="primary"
        class="text-capitalize"
        label="Exportar CSV"
        @click="exportTable"
      />
    </div>
    <q-table
      class="table"
      :rows="rows"
      :columns="columns"
      row-key="name"
      flat
      no-data-label="Não há dados para exibir"
      no-results-label="Nenhum resultado encontrado"
    >
      <template v-slot:body-cell-acoes="props">
        <q-td :props="props">
          <q-btn
            class="iconEdit"
            dense
            flat
            round
            icon="edit"
            title="Editar usuário"
            @click="handleEdit(props.row, $emit)"
          />
          <q-btn
            class="iconDelete"
            dense
            flat
            round
            icon="delete"
            title="Excluir usuário"
            @click="handleDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm"
            >Deseja Remover a carteira de
            <strong>{{
              `${selectedUser.nome} ${selectedUser.sobrenome}`
            }}</strong>
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="closeDialog" />
          <q-btn
            flat
            label="Confirmar"
            color="primary"
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { exportFile, useQuasar } from "quasar";

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return formatted;
}

import { useUserStore } from "../stores/userStore.js";
export default defineComponent({
  name: "TableComponent",
  components: {},
  setup(props, { emit }) {
    const store = useUserStore();
    const $q = useQuasar();
    const dataUser = ref(null);
    const isVisibledInfo = ref(false);
    const selectedUser = ref(null);
    const confirm = ref(false);

    const showInfoModal = (row) => {
      isVisibledInfo.value = true;
      dataUser.value = row;
    };

    const columns = [
      {
        name: "nome",
        label: "NOME",
        align: "left",
        field: "nome",
        align: "center",
      },
      {
        name: "sobrenome",
        label: "SOBRENOME",
        align: "center",
        field: "sobrenome",
        align: "center",
      },
      { name: "email", label: "E-MAIL", field: "email", align: "center" },
      {
        name: "valor_carteira",
        label: "BITCOIN",
        field: "valor_carteira",
        align: "center",
      },
      {
        name: "acoes",
        label: "",
        align: "center",
        field: "acoes",
        align: "center",
      },
    ];
    const rows = ref([]);

    const fetchUsers = async () => {
      await store.fetchUsers();
      rows.value = store.users;
    };

    fetchUsers();

    const handleEdit = (row) => {
      emit("edit", row);
    };

    const handleDelete = (row) => {
      selectedUser.value = row;
      confirm.value = true;
    };

    const closeDialog = () => {
      confirm.value = false;
    };

    const confirmDelete = async () => {
      try {
        await store.deleteUser(selectedUser.value.id);
        rows.value = rows.value.filter(
          (user) => user.id !== selectedUser.value.id
        );
        $q.notify({
          message: "Usuário excluído com sucesso!",
          color: "positive",
          icon: "done",
          position: "top",
        });
        closeDialog();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        $q.notify({
          message: "Erro ao excluir usuário",
          color: "negative",
          icon: "report_problem",
        });
      }
    };

    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    watch(
      () => store.users,
      (newUsers) => {
        rows.value = newUsers;
      }
    );

    return {
      columns,
      rows,
      handleEdit,
      handleDelete,
      isVisibledInfo,
      showInfoModal,
      dataUser,
      formatDate,
      confirm,
      selectedUser,
      confirmDelete,
      closeDialog,

      exportTable() {
        let content = "";
        content += columns.map((col) => col.label).join(",") + "\r\n";

        rows.value.forEach((row) => {
          content +=
            columns
              .map((col) => {
                const value =
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field];
                return wrapCsvValue(value, col.format, row);
              })
              .join(",") + "\r\n";
        });

        const status = exportFile("table-export.csv", content, "text/csv");

        if (status !== true) {
          $q.notify({
            message: "O navegador negou o download do arquivo...",
            color: "negative",
            icon: "warning",
          });
        }
      },
    };
  },
});
</script>
<style scoped>
.containerTable {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--light-color);
  width: 100%;
  height: fit-content;
  border-radius: 0.5rem;
  padding: 1rem;
}

.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  font-weight: 500;
}

.btnCSV {
  border-radius: 0.5rem;
}

.table {
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.iconDelete,
.iconEdit,
.iconDescription {
  color: #888;
}

.iconDescription:hover {
  color: var(--primary-color);
}

.iconEdit:hover {
  color: var(--warning-color);
}

.iconDelete:hover {
  color: var(--danger-color);
}

.containerInfo {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.infoClient {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--gray-color);
  cursor: pointer;
  padding: 0.5rem 0;
  gap: 1rem;
}

.infoClient:hover {
  background-color: var(--background-color);
}
</style>
