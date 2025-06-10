const PokerHandService = require('../services/PokerHandService');

describe('PokerHandService - Complete Test Suite', () => {
  let service;

  beforeEach(() => {
    service = new PokerHandService();
  });

  // 1. Royal Flush
  test('should detect Royal Flush', () => {
    const cards = [
      { rank: '10', suit: 'Hearts' },
      { rank: 'J', suit: 'Hearts' },
      { rank: 'Q', suit: 'Hearts' },
      { rank: 'K', suit: 'Hearts' },
      { rank: 'A', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Royal flush');
  });

  // 2. Straight Flush
  test('should detect Straight Flush', () => {
    const cards = [
      { rank: '5', suit: 'Spades' },
      { rank: '6', suit: 'Spades' },
      { rank: '7', suit: 'Spades' },
      { rank: '8', suit: 'Spades' },
      { rank: '9', suit: 'Spades' }
    ];
    expect(service.evaluateHand(cards)).toBe('Straight flush');
  });

  // 3. Four of a Kind
  test('should detect Four of a Kind', () => {
    const cards = [
      { rank: 'J', suit: 'Hearts' },
      { rank: 'J', suit: 'Diamonds' },
      { rank: 'J', suit: 'Clubs' },
      { rank: 'J', suit: 'Spades' },
      { rank: '3', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Four of a kind');
  });

  // 4. Full House
  test('should detect Full House', () => {
    const cards = [
      { rank: '10', suit: 'Clubs' },
      { rank: '10', suit: 'Hearts' },
      { rank: '10', suit: 'Diamonds' },
      { rank: '3', suit: 'Spades' },
      { rank: '3', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Full house');
  });

  // 5. Flush
  test('should detect Flush', () => {
    const cards = [
      { rank: '2', suit: 'Hearts' },
      { rank: '5', suit: 'Hearts' },
      { rank: '7', suit: 'Hearts' },
      { rank: '9', suit: 'Hearts' },
      { rank: 'Q', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Flush');
  });

  // 6. Straight
  test('should detect Straight', () => {
    const cards = [
      { rank: '7', suit: 'Hearts' },
      { rank: '8', suit: 'Diamonds' },
      { rank: '9', suit: 'Clubs' },
      { rank: '10', suit: 'Spades' },
      { rank: 'J', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Straight');
  });

  test('should detect Ace-low Straight (A-2-3-4-5)', () => {
    const cards = [
      { rank: 'A', suit: 'Hearts' },
      { rank: '2', suit: 'Diamonds' },
      { rank: '3', suit: 'Clubs' },
      { rank: '4', suit: 'Spades' },
      { rank: '5', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Straight');
  });

  // 7. Three of a Kind
  test('should detect Three of a Kind', () => {
    const cards = [
      { rank: 'Q', suit: 'Hearts' },
      { rank: 'Q', suit: 'Diamonds' },
      { rank: 'Q', suit: 'Clubs' },
      { rank: '3', suit: 'Spades' },
      { rank: '5', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('Three of a kind');
  });

  // 8. Two Pair
  test('should detect Two Pair', () => {
    const cards = [
      { rank: 'A', suit: 'Spades' },
      { rank: '10', suit: 'Clubs' },
      { rank: '10', suit: 'Hearts' },
      { rank: '3', suit: 'Diamonds' },
      { rank: '3', suit: 'Spades' }
    ];
    expect(service.evaluateHand(cards)).toBe('Two pairs');
  });

  // 9. One Pair
  test('should detect One Pair', () => {
    const cards = [
      { rank: 'K', suit: 'Hearts' },
      { rank: 'K', suit: 'Diamonds' },
      { rank: '2', suit: 'Clubs' },
      { rank: '5', suit: 'Spades' },
      { rank: '9', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('One pair');
  });

  // 10. High Card
  test('should detect High Card', () => {
    const cards = [
      { rank: 'A', suit: 'Hearts' },
      { rank: '10', suit: 'Diamonds' },
      { rank: '7', suit: 'Clubs' },
      { rank: '4', suit: 'Spades' },
      { rank: '2', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('High card');
  });

  // Edge Cases
  test('should handle all cards same suit but not sequential', () => {
    const cards = [
      { rank: '2', suit: 'Spades' },
      { rank: '4', suit: 'Spades' },
      { rank: '6', suit: 'Spades' },
      { rank: '8', suit: 'Spades' },
      { rank: '10', suit: 'Spades' }
    ];
    expect(service.evaluateHand(cards)).toBe('Flush');
  });

  test('should handle four cards sequential but different suits', () => {
    const cards = [
      { rank: '5', suit: 'Hearts' },
      { rank: '6', suit: 'Diamonds' },
      { rank: '7', suit: 'Clubs' },
      { rank: '8', suit: 'Spades' },
      { rank: '10', suit: 'Hearts' }
    ];
    expect(service.evaluateHand(cards)).toBe('High card');
  });

  // Validation Tests
  test('should throw error for incorrect number of cards', () => {
    const cards = [
      { rank: 'A', suit: 'Spades' },
      { rank: 'K', suit: 'Spades' }
    ];
    expect(() => service.evaluateHand(cards)).toThrow('Exactly 5 cards are required');
  });

  test('should throw error for missing card properties', () => {
    const cards = [
      { rank: 'A' }, // Missing suit
      { rank: 'K', suit: 'Spades' },
      { rank: 'Q', suit: 'Spades' },
      { rank: 'J', suit: 'Spades' },
      { rank: '10', suit: 'Spades' }
    ];
    expect(() => service.evaluateHand(cards)).toThrow('Each card must have a rank and suit');
  });

  test('should throw error for invalid rank', () => {
    const cards = [
      { rank: '1', suit: 'Spades' }, // Invalid rank
      { rank: 'K', suit: 'Spades' },
      { rank: 'Q', suit: 'Spades' },
      { rank: 'J', suit: 'Spades' },
      { rank: '10', suit: 'Spades' }
    ];
    expect(() => service.evaluateHand(cards)).toThrow('Invalid rank');
  });

  test('should throw error for invalid suit', () => {
    const cards = [
      { rank: 'A', suit: 'Stars' }, // Invalid suit
      { rank: 'K', suit: 'Spades' },
      { rank: 'Q', suit: 'Spades' },
      { rank: 'J', suit: 'Spades' },
      { rank: '10', suit: 'Spades' }
    ];
    expect(() => service.evaluateHand(cards)).toThrow('Invalid suit');
  });

  // Performance Test
  test('should evaluate hand quickly (performance test)', () => {
    const cards = [
      { rank: 'A', suit: 'Hearts' },
      { rank: 'K', suit: 'Hearts' },
      { rank: 'Q', suit: 'Hearts' },
      { rank: 'J', suit: 'Hearts' },
      { rank: '10', suit: 'Hearts' }
    ];
    
    const start = process.hrtime();
    const result = service.evaluateHand(cards);
    const end = process.hrtime(start);
    
    expect(result).toBe('Royal flush');
    expect(end[0]).toBe(0); // Should take less than 1 second
    console.log(`Evaluation took ${end[1] / 1000000} milliseconds`);
  });
});