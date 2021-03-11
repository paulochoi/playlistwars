const express = require('express');
const app = express();
const PORT = '3000';

app.get('/', (req, res, next) => {
  res.json({message: 'YO!'});
})

/**
 * start server
 */
 app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});