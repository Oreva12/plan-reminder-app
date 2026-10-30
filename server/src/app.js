const express = require('express');

const app = express();
const cors = require('cors');  

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', require('./routes'));
app.use(require('./middleware/errorHandler'));

module.exports = app;