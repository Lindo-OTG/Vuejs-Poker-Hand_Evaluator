class PokerHandService {
  constructor() {
    // Define hand rankings in order
    this.handRankings = [
      { name: "Royal flush", evaluate: this.isRoyalFlush.bind(this) },
      { name: "Straight flush", evaluate: this.isStraightFlush.bind(this) },
      { name: "Four of a kind", evaluate: this.isFourOfAKind.bind(this) },
      { name: "Full house", evaluate: this.isFullHouse.bind(this) },
      { name: "Flush", evaluate: this.isFlush.bind(this) },
      { name: "Straight", evaluate: this.isStraight.bind(this) },
      { name: "Three of a kind", evaluate: this.isThreeOfAKind.bind(this) },
      { name: "Two pairs", evaluate: this.isTwoPairs.bind(this) },
      { name: "One pair", evaluate: this.isOnePair.bind(this) },
    ];

    // card rankings
    this.cardRankOrder = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
  }

  evaluateHand(cards) {
    if (!cards || cards.length !== 5) {
      throw new Error("Exactly 5 cards are required");
    }

    // Validate each card
    cards.forEach((card) => {
      if (!card.rank || !card.suit) {
        throw new Error("Each card must have a rank and suit");
      }
      if (!this.cardRankOrder.includes(card.rank)) {
        throw new Error(`Invalid rank: ${card.rank}`);
      }
    });

    const { rankCounts, suitCounts, ranks } = this.analyzeCards(cards);

    // Check for each hand type in order of importance
    for (const ranking of this.handRankings) {
      if (ranking.evaluate(rankCounts, suitCounts, ranks)) {
        return ranking.name;
      }
    }

    return "High card";
  }

  analyzeCards(cards) {
    const rankCounts = {};
    const suitCounts = {};
    const ranks = [];

    cards.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
      ranks.push(this.cardRankOrder.indexOf(card.rank));
    });

    return { rankCounts, suitCounts, ranks };
  }

  // Hand evaluation methods
  isRoyalFlush(rankCounts, suitCounts, ranks) {
    const hasAllRoyalCards = ["10", "J", "Q", "K", "A"].every(
      (r) => rankCounts[r]
    );
    return hasAllRoyalCards && this.isFlush(rankCounts, suitCounts);
  }

  isStraightFlush(rankCounts, suitCounts, ranks) {
    return (
      this.isFlush(rankCounts, suitCounts) &&
      this.isStraight(rankCounts, suitCounts, ranks)
    );
  }

  isFourOfAKind(rankCounts) {
    return Object.values(rankCounts).includes(4);
  }

  isFullHouse(rankCounts) {
    const values = Object.values(rankCounts).sort();
    return values.includes(3) && values.includes(2);
  }

  isFlush(rankCounts, suitCounts) {
    return Object.values(suitCounts).includes(5);
  }

  isStraight(rankCounts, suitCounts, ranks) {
    const uniqueRanks = Object.keys(rankCounts);
    if (uniqueRanks.length !== 5) return false;

    const sortedRanks = [...ranks].sort((a, b) => a - b);

    // Check for normal straight
    if (sortedRanks[4] - sortedRanks[0] === 4) return true;

    // Check for Ace-low straight (A-2-3-4-5)
    if (sortedRanks.join(",") === [0, 1, 2, 3, 12].join(",")) return true;

    return false;
  }

  isThreeOfAKind(rankCounts) {
    return Object.values(rankCounts).includes(3);
  }

  isTwoPairs(rankCounts) {
    return (
      Object.values(rankCounts).filter((count) => count === 2).length === 2
    );
  }

  isOnePair(rankCounts) {
    return Object.values(rankCounts).includes(2);
  }

  generateRandomHand() {
    const ranks = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];

    const hand = new Set();
    while (hand.size < 5) {
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
      const randomSuit = suits[Math.floor(Math.random() * suits.length)];
      hand.add(JSON.stringify({ rank: randomRank, suit: randomSuit }));
    }

    return Array.from(hand).map((card) => JSON.parse(card));
  }

  compareHands(hand1, hand2) {
    const handRankings = {
      "Royal flush": 10,
      "Straight flush": 9,
      "Four of a kind": 8,
      "Full house": 7,
      Flush: 6,
      Straight: 5,
      "Three of a kind": 4,
      "Two pairs": 3,
      "One pair": 2,
      "High card": 1,
    };
    const hand1Rank = this.evaluateHand(hand1);
    const hand2Rank = this.evaluateHand(hand2);

    const hand1Value = handRankings[hand1Rank];
    const hand2Value = handRankings[hand2Rank];

    if (hand1Value > hand2Value) {
      return { winner: 1, hand1Rank, hand2Rank };
    } else if (hand2Value > hand1Value) {
      return { winner: 2, hand1Rank, hand2Rank };
    } else {
      return this.resolveTie(hand1, hand2, hand1Rank);
    }
  }

  resolveTie(hand1, hand2, handRank) {
    const hand1Values = this.getCardValues(hand1);
    const hand2Values = this.getCardValues(hand2);

    for (let i = 4; i >= 0; i--) {
      if (hand1Values[i] > hand2Values[i]) {
        return { winner: 1, hand1Rank: handRank, hand2Rank: handRank };
      } else if (hand2Values[i] > hand1Values[i]) {
        return { winner: 2, hand1Rank: handRank, hand2Rank: handRank };
      }
    }

    return { winner: 0, hand1Rank: handRank, hand2Rank: handRank }; // Tie
  }

  getCardValues(hand) {
    const valueOrder = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    return hand
      .map((card) => valueOrder.indexOf(card.rank))
      .sort((a, b) => a - b);
  }
}

module.exports = PokerHandService;
