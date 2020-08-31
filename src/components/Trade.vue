<template>
  <div class="trade-details">
    <header class="app-title">
      <!-- <span @click="$emit('clear', null)">&#8249;</span> -->
      <h2>
        Trade Bucketed
        <strong>{{ symbol }}</strong>
      </h2>
    </header>
    <table>
      <thead>
        <th>Time</th>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
        <th>Gross Value</th>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <td>{{ new Date(row.timestamp) | date('DD.MM.YYYY HH:mm:ss') }}</td>
          <td>{{ row.open }}</td>
          <td>{{ row.high }}</td>
          <td>{{ row.low }}</td>
          <td>{{ row.close }}</td>
          <td>{{ row.volume }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { has } from "lodash";
import { dateFilter } from "vue-date-fns"; // https://date-fns.org/docs/Getting-Started
const WebSocket = require("isomorphic-ws");
import config from "@/config";

export default {
  name: "trade",
  props: {
    symbol: {
      type: String,
      default: null
    }
  },
  filters: {
    date: dateFilter
  },
  data: () => ({
    rows: [],
    tradeSocket: new WebSocket(config.socketUrl)
  }),
  created() {
    this.$http
      .get(
        "/trade/bucketed?binSize=1m&partial=false&count=100&reverse=true&symbol=" +
          this.symbol
      )
      .then(response => {
        this.rows = response.data;
      })
      .catch(e => {
        this.$notify({
          group: "app",
          type: "error",
          title: "Error",
          text: e.response.data.error.message
        });
      });
  },
  mounted() {
    const vm = this;

    vm.tradeSocket.onopen = () => {
      vm.tradeSocket.send(
        `{"op": "subscribe", "args": "tradeBin1m:` + this.symbol + `"}`
      );
    };

    vm.tradeSocket.onmessage = response => {
      const update = JSON.parse(response.data);
      if (has(update, "data") && update.action === "insert") {
        const updatedRows = [...update.data, ...vm.rows];
        vm.rows = updatedRows.splice(0, 99);
      }
    };
  },
  beforeDestroy() {
    this.tradeSocket.send(
      `{"op": "unsubscribe", "args": "tradeBin1m:` + this.symbol + `"}`
    );
  }
};
</script>