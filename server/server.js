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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});