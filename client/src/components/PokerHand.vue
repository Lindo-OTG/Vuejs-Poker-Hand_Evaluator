<template>
  <div class="poker-app">
    <div class="app-container">
      <h1 class="app-title">Poker Hand Evaluator</h1>
      <div class="app-content">
        <HandEvaluate 
          :ranks="ranks" 
          :suits="suits" 
        />
        <HandCompare 
          :ranks="ranks" 
          :suits="suits" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import HandEvaluate from './HandEvaluator.vue';
import HandCompare from './HandCompare.vue';

export default {
  components: {
    HandEvaluate,
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

<style>
/* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
}

/* App container styles */
.poker-app {
  min-height: 100vh;
  background: url('/images/table.jpg') center/cover no-repeat;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-container {
  width: 100%;
  max-width: 1200px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.app-title {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  padding-bottom: 15px;
}

.app-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #e74c3c, transparent);
}

.app-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .poker-app {
    padding: 10px;
  }
  
  .app-container {
    padding: 20px;
  }
  
  .app-title {
    font-size: 2rem;
  }
}
</style>