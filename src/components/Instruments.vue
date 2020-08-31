<template>
  <div class="instruments">
    <table>
      <thead>
        <th>Symbol</th>
        <th>Last price</th>
      </thead>
      <tbody>
        <tr v-for="ins in instruments" :key="ins.symbol" @click="$emit('getSymbol', ins.symbol)">
          <td>
            <div class="instrument-name">
              <span>{{ ins.symbol }}</span>
            </div>
          </td>
          <td>{{ ins.lastPrice }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { forEach, has } from "lodash";
const WebSocket = require("isomorphic-ws");
import config from "@/config";

export default {
  name: "Instruments",
  data: () => ({
    instruments: []
  }),
  created() {
    this.$http
      .get("/instrument/active")
      .then(response => {
        this.$set(this, "instruments", response.data);

        this.$nextTick(() => {
          this.$emit("getSymbol", this.instruments[0].symbol);
        });
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
  beforeMount() {
    const vm = this;
    const appSocketIO = new WebSocket(config.socketUrl);

    appSocketIO.onopen = () => {
      appSocketIO.send(`{"op": "subscribe", "args": "instrument"}`);
    };

    appSocketIO.onmessage = response => {
      const update = JSON.parse(response.data);
      console.log('onmessage update')
      forEach(update.data, newobj => {
        if (!has(newobj, "lastPrice")) return; //prevent updating if not has lastPrice key
        const inx = vm.getUIndex(newobj.symbol);

        if (inx === -1) {
          vm.instruments.push(newobj);
        } else {
          vm.instruments[inx].lastPrice = newobj.lastPrice;
        }
      });
    };
  },
  methods: {
    getUIndex(name) {
      return this.instruments.map(item => item.symbol).indexOf(name); // find index of your object
    }
  }
};
</script>

<style lang="scss">
.instruments tr:hover td {
  background: #303030;
  cursor: pointer;
  color: #fff;
}
</style>