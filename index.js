require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routerProducts = require('./routers/routerProducts');
const routerSales = require('./routers/routerSales');

const app = express();
const path = '/';

app.use(bodyParser.json());

app.use(
  path,
  routerSales,
  routerProducts,
);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
