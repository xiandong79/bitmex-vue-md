<template>
  <div class="home">
    <section class="home-grid">
      <instruments @getSymbol="chosenSymbol" />
      <trade v-if="symbol" :key="'t-' + symbol" :symbol="symbol" />
    </section>
  </div>
</template>

<script>
export default {
  name: 'home',
  data: () => ({
    symbol: null
  }),
  components: {
    instruments: () => import('@/components/Instruments'),
    trade: () => import('@/components/Trade')
  },
  methods: {
    chosenSymbol (e) {
      this.$set(this, 'symbol', e)
    }
  }
}
</script>

<style lang="scss">
.home {
  &-grid {
    justify-content: space-between;
    align-items: flex-start;
    display: flex;
    > * {
      position: relative;
    }
  }
  .instruments,
  .trade-order {
    flex-basis: 320px;
  }
  .trade-details {
    flex: 1;
  }
}
</style>
