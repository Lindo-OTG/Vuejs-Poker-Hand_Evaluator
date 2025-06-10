<template>
  <div class="hand-compare">
    <h2>Compare Two Hands</h2>
    
    <div class="comparison-container">
      <!-- Hand 1 -->
      <div class="hand-container">
        <h3>Hand 1</h3>
        <div v-for="(card, index) in hand1" :key="'h1-' + index" class="card-input">
          <label>Card {{ index + 1 }}:</label>
          <select v-model="hand1[index].rank">
            <option value="">Select Rank</option>
            <option v-for="r in ranks" :value="r">{{ r }}</option>
          </select>
          <select v-model="hand1[index].suit">
            <option value="">Select Suit</option>
            <option v-for="s in suits" :value="s">{{ s }}</option>
          </select>
        </div>
        <button @click="generateRandomHand(1)" class="random-btn">
          Generate Random Hand
        </button>
      </div>

      <!-- Hand 2 -->
      <div class="hand-container">
        <h3>Hand 2</h3>
        <div v-for="(card, index) in hand2" :key="'h2-' + index" class="card-input">
          <label>Card {{ index + 1 }}:</label>
          <select v-model="hand2[index].rank">
            <option value="">Select Rank</option>
            <option v-for="r in ranks" :value="r">{{ r }}</option>
          </select>
          <select v-model="hand2[index].suit">
            <option value="">Select Suit</option>
            <option v-for="s in suits" :value="s">{{ s }}</option>
          </select>
        </div>
        <button @click="generateRandomHand(2)" class="random-btn">
          Generate Random Hand
        </button>
      </div>
    </div>

    <button 
      @click="compareHands" 
      :disabled="!canCompare"
      class="compare-btn"
    >
      Compare Hands
    </button>

    <div v-if="comparisonResult" class="results">
      <div class="result-box">
        <h3>Hand 1: {{ comparisonResult.hand1Rank }}</h3>
      </div>
      <div class="result-box">
        <h3>Hand 2: {{ comparisonResult.hand2Rank }}</h3>
      </div>
      <div class="winner-box">
        <h2 v-if="comparisonResult.winner === 0">It's a tie!</h2>
        <h2 v-else>Winner: Hand {{ comparisonResult.winner }}</h2>
      </div>
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
      hand1: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      hand2: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      comparisonResult: null,
      error: '',
      loading: false
    };
  },
  computed: {
    canCompare() {
      return (
        this.hand1.every(card => card.rank && card.suit) && 
        this.hand2.every(card => card.rank && card.suit)
      );
    }
  },
  methods: {
    async generateRandomHand(handNumber) {
      this.loading = true;
      this.error = '';
      try {
        const response = await fetch(`${this.$apiBaseUrl}/random-hand`);
        if (!response.ok) throw new Error('Failed to generate random hand');
        
        const data = await response.json();
        if (handNumber === 1) {
          this.hand1 = data.cards;
        } else {
          this.hand2 = data.cards;
        }
        this.comparisonResult = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    async compareHands() {
      if (!this.canCompare) {
        this.error = 'Both hands must be complete to compare';
        return;
      }
      
      this.loading = true;
      this.error = '';
      
      try {
        const response = await fetch(`${this.$apiBaseUrl}/compare-hands`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            hand1: this.hand1,
            hand2: this.hand2
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Comparison failed');
        }
        
        const data = await response.json();
        this.comparisonResult = data;
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
.hand-compare {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.comparison-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.hand-container {
  flex: 1;
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.random-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.compare-btn {
  display: block;
  width: 200px;
  padding: 12px;
  margin: 0 auto 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.compare-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.results {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.result-box {
  flex: 1;
  background: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.winner-box {
  flex: 1;
  background: #e74c3c;
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.error {
  color: #d32f2f;
  padding: 15px;
  background-color: #fadbd8;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
</style>