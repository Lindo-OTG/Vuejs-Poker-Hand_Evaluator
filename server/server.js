const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const PokerHandService = require('./services/PokerHandService');

const app = express();
const pokerHandService = new PokerHandService();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.post('/evaluate', (req, res) => {
  try {
    const cards = req.body.cards;
    const result = pokerHandService.evaluateHand(cards);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/random-hand', (req, res) => {
  try {
    const randomHand = pokerHandService.generateRandomHand();
    res.json({ cards: randomHand });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate random hand' });
  }
});

app.post('/compare-hands', (req, res) => {
  try {
    const { hand1, hand2 } = req.body;
    if (!hand1 || !hand2 || hand1.length !== 5 || hand2.length !== 5) {
      return res.status(400).json({ error: 'Both hands must have exactly 5 cards' });
    }
    
    const result = pokerHandService.compareHands(hand1, hand2);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare hands' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});