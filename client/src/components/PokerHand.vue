<template>
  <div class="poker-hand-app">    
    <HandEvaluator 
      :ranks="ranks" 
      :suits="suits" 
    />
    
    <HandCompare
      :ranks="ranks" 
      :suits="suits" 
    />
  </div>
</template>

<script>
import HandEvaluator from './HandEvaluator.vue';
import HandCompare from './HandCompare.vue';

export default {
  components: {
    HandEvaluator,
    HandCompare
  },
  data() {
    return {
      ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      suits: ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    };
  }
};
</script>

<style scoped>
.poker-hand-app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}
</style>