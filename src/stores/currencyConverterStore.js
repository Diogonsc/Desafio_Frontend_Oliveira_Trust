import { defineStore } from "pinia";
import axios from "axios";

export const useCurrencyConverterStore = defineStore("currencyConverter", {
  state: () => ({
    currencyPairs: [],
    baseCurrency: "",
    targetCurrency: "",
    amount: 1,
    convertedAmount: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCurrencyPairs() {
      try {
        const response = await axios.get(
          "https://economia.awesomeapi.com.br/json/available"
        );
        this.currencyPairs = response.data;
      } catch (error) {
        console.error("Erro ao obter as combinações de moedas:", error);
        this.error =
          "Erro ao obter as combinações de moedas. Por favor, tente novamente mais tarde.";
      }
    },

    async getConversionRate(baseCurrency, targetCurrency) {
      try {
        const response = await axios.get(
          `https://economia.awesomeapi.com.br/json/last/${baseCurrency}-${targetCurrency}`
        );
        return parseFloat(
          response.data[`${baseCurrency}${targetCurrency}`].bid
        );
      } catch (error) {
        console.error("Erro ao obter a taxa de conversão:", error);
        throw new Error(
          "Erro ao obter a taxa de conversão. Por favor, tente novamente mais tarde."
        );
      }
    },
  },
});
