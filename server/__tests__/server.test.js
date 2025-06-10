const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  test('POST /evaluate - should evaluate valid hand', async () => {
    const response = await request(app)
      .post('/evaluate')
      .send({
        cards: [
          { rank: 'A', suit: 'Spades' },
          { rank: 'A', suit: 'Hearts' },
          { rank: 'A', suit: 'Diamonds' },
          { rank: 'K', suit: 'Clubs' },
          { rank: 'K', suit: 'Spades' }
        ]
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe('Full house');
  });

  test('POST /evaluate - should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/evaluate')
      .send({
        cards: [
          { rank: 'A', suit: 'Spades' },
          { rank: 'A' }, // Missing suit
          { rank: '2', suit: 'Hearts' }
        ]
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('Each card must have a rank and suit');
  });

  test('POST /evaluate - should return 400 for wrong number of cards', async () => {
    const response = await request(app)
      .post('/evaluate')
      .send({
        cards: Array(7).fill({ rank: 'A', suit: 'Spades' })
      });
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('Exactly 5 cards are required');
  });
});