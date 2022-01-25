require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routers = require('./routers/routers');

const app = express();

app.use(bodyParser.json());

app.use('/', routers);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
