<template>
  <div class="poker-hand-evaluator">
    <div v-for="(card, index) in cards" :key="index" class="card-input">
      <label>Card {{ index + 1 }}:</label>
      <select v-model="card.rank" :disabled="loading">
        <option value="">Select Rank</option>
        <option v-for="r in ranks" :value="r">{{ r }}</option>
      </select>
      <select v-model="card.suit" :disabled="loading">
        <option value="">Select Suit</option>
        <option v-for="s in suits" :value="s">{{ s }}</option>
      </select>
    </div>
    
    <button 
      @click="evaluateHand" 
      :disabled="!isFormValid || loading"
      :class="{ loading: loading }"
    >
      {{ loading ? 'Evaluating...' : 'Evaluate Hand' }}
    </button>
    
    <div v-if="result" class="result">
      <h2>Hand: {{ result }}</h2>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      suits: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
      cards: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      result: '',
      error: '',
      loading: false
    };
  },
  computed: {
    isFormValid() {
      return this.cards.every(card => card.rank && card.suit);
    }
  },
  methods: {
    async evaluateHand() {
      this.error = '';
      this.result = '';
      this.loading = true;
      
      try {
        const response = await fetch(`${this.$apiBaseUrl}/evaluate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cards: this.cards })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Evaluation failed');
        }
        
        const data = await response.json();
        this.result = data.result;
      } catch (err) {
        this.error = err.message;
        console.error('Evaluation error:', err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.poker-hand-evaluator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.card-input {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.card-input label {
  min-width: 80px;
  text-align: right;
  margin-right: 10px;
}

.card-input select {
  padding: 8px;
  margin-right: 10px;
  flex: 1;
  max-width: 120px;
}

button {
  margin-top: 25px;
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button.loading {
  position: relative;
  color: transparent;
}

button.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.error {
  color: #d32f2f;
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}

.result {
  margin-top: 30px;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 4px;
}

.result h2 {
  margin: 0;
  color: #2e7d32;
}
</style>