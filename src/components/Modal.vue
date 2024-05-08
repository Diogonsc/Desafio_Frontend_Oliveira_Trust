<template>
  <div class="containerModal">
    <q-dialog
      v-model="modalVisible"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section>
          <div class="addCart">
            <span class="text-h6">{{ title }}</span>
          </div>
          <hr />
        </q-card-section>
        <q-card-section class="q-pt-none contentModal">
          <slot></slot>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ModalComponent",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const modalVisible = computed({
      get: () => props.visible,
      set: (value) => {
        emit("update:visible", value);
      },
    });

    const closeModal = () => {
      modalVisible.value = false;
    };

    return {
      modalVisible,
      closeModal,
    };
  },
});
</script>

<style scoped>
.containerModal {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.addCart {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contentModal {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.addCart .fa-xmark {
  cursor: pointer;
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
