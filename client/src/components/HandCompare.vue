<template>
  <div class="hand-compare">
    <h2 class="section-title">Compare Two Hands</h2>
    
    <div class="comparison-area">
      <div class="hand-container" :class="{ 'winner-highlight': comparisonResult?.winner === 1 }">
        <h3>Hand 1</h3>
        <div class="card-grid">
          <Card
            v-for="(card, index) in hand1"
            :key="'h1-' + index"
            :rank="card.rank"
            :suit="card.suit"
            :selected="selectedCard?.hand === 1 && selectedCard.index === index"
            :animate="!!card.rank"
            @click="selectCard(1, index)"
          />
        </div>
        <button @click="generateRandomHand(1)" class="action-btn random-btn">
          Deal Random Hand
        </button>
      </div>
      
      <div class="vs-circle" v-if="!comparisonResult">
        <div class="vs-text">VS</div>
      </div>
      
      <div class="result-display" v-else>
        <div class="result-text">
          <span class="hand-rank" :class="rankClass(comparisonResult.hand1Rank)">
            {{ comparisonResult.hand1Rank }}
          </span>
          <span class="versus">vs</span>
          <span class="hand-rank" :class="rankClass(comparisonResult.hand2Rank)">
            {{ comparisonResult.hand2Rank }}
          </span>
        </div>
        <div class="winner-text" :class="winnerClass">
          {{ comparisonResult.winner === 0 ? 'Tie Game!' : `Hand ${comparisonResult.winner} Wins!` }}
        </div>
      </div>
      
      <div class="hand-container" :class="{ 'winner-highlight': comparisonResult?.winner === 2 }">
        <h3>Hand 2</h3>
        <div class="card-grid">
          <Card
            v-for="(card, index) in hand2"
            :key="'h2-' + index"
            :rank="card.rank"
            :suit="card.suit"
            :selected="selectedCard?.hand === 2 && selectedCard.index === index"
            :animate="!!card.rank"
            @click="selectCard(2, index)"
          />
        </div>
        <button @click="generateRandomHand(2)" class="action-btn random-btn">
          Deal Random Hand
        </button>
      </div>
    </div>
    
    <div class="compare-controls">
      <div class="selector-group" v-if="selectedCard">
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
          :disabled="!selectedRank || !selectedSuit"
          class="assign-btn"
        >
          Assign Card
        </button>
      </div>
      
      <button 
        @click="compareHands" 
        :disabled="!canCompare"
        class="action-btn compare-btn"
      >
        <span v-if="!loading">Compare Hands</span>
        <span v-else class="spinner"></span>
      </button>
      <button @click="resetComparison" class="action-btn reset-btn">
        Reset
      </button>
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
      hand1: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      hand2: Array(5).fill().map(() => ({ rank: '', suit: '' })),
      selectedCard: null,
      selectedRank: '',
      selectedSuit: '',
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
    },
    winnerClass() {
      if (!this.comparisonResult) return '';
      return this.comparisonResult.winner === 0 ? 'tie' : 'winner';
    }
  },
  methods: {
    rankClass(rank) {
      if (!rank) return '';
      return rank.toLowerCase().replace(/\s+/g, '-');
    },
    selectCard(hand, index) {
      this.selectedCard = { hand, index };
      const card = hand === 1 ? this.hand1[index] : this.hand2[index];
      this.selectedRank = card.rank || '';
      this.selectedSuit = card.suit || '';
    },
    assignCard() {
      if (this.selectedCard) {
        const { hand, index } = this.selectedCard;
        if (hand === 1) {
          this.hand1[index] = { rank: this.selectedRank, suit: this.selectedSuit };
        } else {
          this.hand2[index] = { rank: this.selectedRank, suit: this.selectedSuit };
        }
        this.comparisonResult = null;
      }
    },
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
    },
    resetComparison() {
      this.hand1 = Array(5).fill().map(() => ({ rank: '', suit: '' }));
      this.hand2 = Array(5).fill().map(() => ({ rank: '', suit: '' }));
      this.comparisonResult = null;
      this.error = '';
      this.selectedCard = null;
      this.selectedRank = '';
      this.selectedSuit = '';
    }
  }
};
</script>

<style scoped>
.hand-compare {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.section-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.comparison-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.hand-container {
  flex: 1;
  min-width: 300px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.hand-container h3 {
  text-align: center;
  margin-top: 0;
  color: #34495e;
  font-size: 1.3rem;
}

.winner-highlight {
  box-shadow: 0 0 0 4px #2ecc71;
  transform: translateY(-5px);
}

.card-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.vs-circle {
  width: 80px;
  height: 80px;
  background: #e74c3c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.vs-text {
  transform: rotate(-10deg);
}

.result-display {
  flex: 1;
  min-width: 100%;
  text-align: center;
  margin: 20px 0;
}

.result-text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.hand-rank {
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: bold;
  color: white;
}

.versus {
  font-size: 1.2rem;
  font-weight: bold;
  color: #7f8c8d;
}

.winner-text {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 12px 25px;
  border-radius: 6px;
  display: inline-block;
}

.winner {
  background-color: #2ecc71;
  color: white;
  animation: pulse 1.5s infinite;
}

.tie {
  background-color: #f39c12;
  color: white;
}

.compare-controls {
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

.compare-btn {
  background-color: #e74c3c;
  color: white;
  padding: 12px 30px;
  font-size: 1.1rem;
  min-width: 200px;
}

.compare-btn:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.reset-btn {
  background-color: #95a5a6;
  color: white;
}

.reset-btn:hover {
  background-color: #7f8c8d;
  transform: translateY(-2px);
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

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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

/* Different rank colors matching HandEvaluate */
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

@media (max-width: 768px) {
  .comparison-area {
    flex-direction: column;
  }
  
  .hand-container {
    width: 100%;
  }
  
  .vs-circle {
    margin: 20px 0;
  }
  
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