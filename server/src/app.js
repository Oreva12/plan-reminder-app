const express = require('express');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', require('./routes'));

// TODO Slice 3+: error handler LAST
// app.use(require('./middleware/errorHandler'));

module.exports = app;