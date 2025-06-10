<template>
  <div class="hand-evaluate">
    <h2 class="section-title">Evaluate Your Hand</h2>
    
    <div class="card-grid">
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :rank="card.rank"
        :suit="card.suit"
        :selected="selectedCardIndex === index"
        :animate="!!card.rank"
        @click="selectCard(index)"
      />
    </div>
    
    <div class="controls">
      <div class="selector-group">
        <select v-model="selectedRank" class="card-selector">
          <option value="">Select Rank</option>
          <option v-for="r in ranks" :value="r">{{ r }}</option>
          <option value="Joker">Joker</option>
        </select>
        
        <select 
          v-model="selectedSuit" 
          class="card-selector"
          :disabled="selectedRank === 'Joker'"
        >
          <option value="">Select Suit</option>
          <option v-for="s in suits" :value="s">{{ s }}</option>
          <option v-if="selectedRank === 'Joker'" value="Black">Black</option>
          <option v-if="selectedRank === 'Joker'" value="Red">Red</option>
        </select>
        
        <button 
          @click="assignCard"
          :disabled="!selectedRank || !selectedSuit || selectedCardIndex === null"
          class="assign-btn"
        >
          Assign Card
        </button>
      </div>
      
      <div class="button-group">
        <button @click="evaluateHand" :disabled="!isHandValid" class="action-btn evaluate-btn">
          <span v-if="!loading">Evaluate Hand</span>
          <span v-else class="spinner"></span>
        </button>
        <button @click="generateRandomHand" class="action-btn random-btn">
          Deal Random Hand
        </button>
        <button @click="clearHand" class="action-btn clear-btn">
          Clear
        </button>
      </div>
    </div>
    
    <div v-if="result" class="result-display">
      <div class="result-badge" :class="resultClass">
        {{ result }}
      </div>
      <div class="hand-description">
        {{ handDescriptions[result] }}
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';

export default {
  components: { Card },
  props: {
    ranks: {
      type: Array,
      default: () => ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    },
    suits: {
      type: Array,
      default: () => ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    }
  },
  data() {
    return {
      cards: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      selectedCardIndex: null,
      selectedRank: '',
      selectedSuit: '',
      result: '',
      error: '',
      loading: false,
      handDescriptions: {
        'Royal flush': 'The highest possible straight flush (Ace-high)',
        'Straight flush': 'Five sequential cards of the same suit',
        'Four of a kind': 'Four cards of the same rank',
        'Full house': 'Three of a kind plus a pair',
        'Flush': 'Five cards of the same suit',
        'Straight': 'Five sequential cards',
        'Three of a kind': 'Three cards of the same rank',
        'Two pairs': 'Two different pairs',
        'One pair': 'A single pair',
        'High card': 'No matching cards'
      }
    };
  },
  computed: {
    isHandValid() {
      return this.cards.every(card => card.rank && card.suit);
    },
    resultClass() {
      if (!this.result) return '';
      return this.result.toLowerCase().replace(/\s+/g, '-');
    }
  },
  methods: {
    selectCard(index) {
      this.selectedCardIndex = index;
      if (this.cards[index].rank) {
        this.selectedRank = this.cards[index].rank;
        this.selectedSuit = this.cards[index].suit;
      } else {
        this.selectedRank = '';
        this.selectedSuit = '';
      }
    },
    assignCard() {
      if (this.selectedCardIndex !== null) {
        this.cards[this.selectedCardIndex] = {
          rank: this.selectedRank,
          suit: this.selectedSuit
        };
        this.result = '';
      }
    },
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
    },
    clearHand() {
      this.cards = Array(5).fill().map(() => ({ rank: '', suit: '' }));
      this.result = '';
      this.error = '';
      this.selectedCardIndex = null;
      this.selectedRank = '';
      this.selectedSuit = '';
    }
  }
};
</script>

<style scoped>
.hand-evaluate {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
}

.section-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.card-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.selector-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.card-selector {
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  font-size: 1rem;
  min-width: 120px;
}

.assign-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.assign-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.assign-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
}

.evaluate-btn {
  background-color: #2ecc71;
  color: white;
}

.evaluate-btn:hover:not(:disabled) {
  background-color: #27ae60;
  transform: translateY(-2px);
}

.random-btn {
  background-color: #e67e22;
  color: white;
}

.random-btn:hover {
  background-color: #d35400;
  transform: translateY(-2px);
}

.clear-btn {
  background-color: #e74c3c;
  color: white;
}

.clear-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.action-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-display {
  margin-top: 25px;
  text-align: center;
}

.result-badge {
  display: inline-block;
  padding: 10px 25px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Different colors for different hand types */
.royal-flush { background: linear-gradient(135deg, #ff00cc, #3333ff); }
.straight-flush { background: linear-gradient(135deg, #00b4db, #0083b0); }
.four-of-a-kind { background: linear-gradient(135deg, #f46b45, #eea849); }
.full-house { background: linear-gradient(135deg, #56ab2f, #a8e063); }
.flush { background: linear-gradient(135deg, #9c27b0, #673ab7); }
.straight { background: linear-gradient(135deg, #2196f3, #00bcd4); }
.three-of-a-kind { background: linear-gradient(135deg, #ff9800, #ff5722); }
.two-pairs { background: linear-gradient(135deg, #795548, #9e9e9e); }
.one-pair { background: linear-gradient(135deg, #607d8b, #9e9e9e); }
.high-card { background: linear-gradient(135deg, #9e9e9e, #607d8b); }

.hand-description {
  font-size: 1.1rem;
  color: #555;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
}

.error-message {
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .card-selector {
    min-width: 100px;
    padding: 8px 12px;
  }
  
  .action-btn {
    padding: 10px 15px;
    min-width: 120px;
    font-size: 0.9rem;
  }
}
</style>