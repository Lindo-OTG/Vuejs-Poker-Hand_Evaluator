<template>
  <div class="hand-evaluator">
    <h2>Evaluate Single Hand</h2>
    
    <div v-for="(card, index) in cards" :key="index" class="card-input">
      <label>Card {{ index + 1 }}:</label>
      <select v-model="cards[index].rank">
        <option value="">Select Rank</option>
        <option v-for="r in ranks" :value="r">{{ r }}</option>
      </select>
      <select v-model="cards[index].suit">
        <option value="">Select Suit</option>
        <option v-for="s in suits" :value="s">{{ s }}</option>
      </select>
    </div>
    
    <div class="button-group">
      <button @click="evaluateHand" :disabled="!isHandValid">
        Evaluate Hand
      </button>
      <button @click="generateRandomHand" class="random-btn">
        Generate Random Hand
      </button>
    </div>
    
    <div v-if="result" class="result">
      <h3>Result: {{ result }}</h3>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ranks: {
      type: Array,
      required: true
    },
    suits: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      cards: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      result: '',
      error: '',
      loading: false
    };
  },
  computed: {
    isHandValid() {
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
      } finally {
        this.loading = false;
      }
    },
    
    async generateRandomHand() {
      this.loading = true;
      this.error = '';
      try {
        const response = await fetch(`${this.$apiBaseUrl}/random-hand`);
        if (!response.ok) throw new Error('Failed to generate random hand');
        
        const data = await response.json();
        this.cards = data.cards;
        this.result = '';
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.hand-evaluator {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
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

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:not(.random-btn) {
  background-color: #4CAF50;
  color: white;
}

.random-btn {
  background-color: #3498db;
  color: white;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 4px;
}

.error {
  color: #d32f2f;
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>