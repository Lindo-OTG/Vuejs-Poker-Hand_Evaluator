<template>
  <div id="app">
    <!-- <header>
      <h1>Poker Hand Evaluator</h1>
    </header> -->
    <main>
      <PokerHand />
    </main>
  </div>
</template>

<script>
import PokerHand from './components/PokerHand.vue'

export default {
  name: 'App',
  components: {
    PokerHand
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

header {
  margin-bottom: 30px;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>