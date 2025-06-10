<template>
  <div 
    class="playing-card"
    :class="{
      'card-selected': selected,
      'card-animate': animate
    }"
    @click="$emit('click')"
  >
    <img 
      v-if="rank && suit"
      :src="cardImageSrc"
      :alt="`${rank} of ${suit}`"
      class="card-image"
    >
    <img 
      v-else
      src="/images/cards/back.png"
      alt="Card back"
      class="card-image"
    >
  </div>
</template>

<script>
export default {
  props: {
    rank: String,
    suit: String,
    selected: Boolean,
    animate: Boolean
  },
  computed: {
    cardImageSrc() {
      if (!this.rank || !this.suit) return '';
      
      // Handle special cases
      if (this.rank.toLowerCase() === 'joker') {
        return this.suit.toLowerCase() === 'black' 
          ? '/images/cards/joker_black.png'
          : '/images/cards/joker_red.png';
      }
      
      // Convert rank/suit to filename format
      const rankMap = {
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        'J': 'jack',
        'Q': 'queen',
        'K': 'king',
        'A': 'ace'
      };
      
      const suitMap = {
        'Hearts': 'hearts',
        'Diamonds': 'diamonds',
        'Clubs': 'clubs',
        'Spades': 'spades'
      };
      
      const rankSlug = rankMap[this.rank];
      const suitSlug = suitMap[this.suit];
      
      return `/images/cards/${rankSlug}_of_${suitSlug}.png`;
    }
  }
};
</script>

<style scoped>
.playing-card {
  width: 120px;
  height: 168px;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  margin: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.playing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.card-selected {
  box-shadow: 0 0 0 3px gold;
  transform: translateY(-10px);
}

.card-animate {
  animation: dealCard 0.5s ease-in-out;
}

@keyframes dealCard {
  0% { transform: rotateY(0deg) translateY(0); }
  50% { transform: rotateY(90deg) translateY(-20px); }
  100% { transform: rotateY(0deg) translateY(0); }
}

/* Responsive sizing */
@media (max-width: 768px) {
  .playing-card {
    width: 80px;
    height: 112px;
  }
}
</style>