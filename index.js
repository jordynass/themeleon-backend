const express = require('express');
const cors = require('cors');
const iconRoute = require('./icon-route');
const { port } = require('./flags');

const app = express();
app.use(cors());

app.use('/icon', iconRoute);

app.listen(port, () => {
  console.log(`Themeleon server listening on port ${port}`);
});