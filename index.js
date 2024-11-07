const express = require('express');
const cors = require('cors');
const themeRoute = require('./theme-route');
const { port } = require('./flags');

require('dotenv').config();

const app = express();
app.use(cors());

app.use('/theme', themeRoute);

app.listen(port, () => {
  console.log(`Themeleon server listening on port ${port}`);
});