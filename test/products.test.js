const frisby = require("frisby");
const mysql = require("mysql2/promise");
const Importer = require("mysql-import");
require("dotenv").config();

describe("Products", () => {
  const products = [
    { name: "Martelo de Thor", quantity: 10 },
    { name: "Traje de encolhimento", quantity: 20 },
    { name: "Escudo do Capitão América", quantity: 30 },
  ];
  const url = `http://localhost:${process.env.PORT}`;
  const INVALID_ID = 99999;
  let connection;

  beforeAll(async () => {
    const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;

    connection = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
    });

    const importer = new Importer({
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      host: MYSQL_HOST,
    });

    await importer.import("./StoreManager.sql");

    importer.disconnect();
  });

  beforeEach(async () => {
    const values = products.map(({ name, quantity }) => [name, quantity]);
    await connection.query(
      "INSERT INTO StoreManager.products (name, quantity) VALUES ?",
      [values]
    );
  });

  afterEach(async () => {
    await connection.execute("DELETE FROM StoreManager.products");
  });

  afterAll(async () => {
    await connection.execute("DROP DATABASE StoreManager");
    await connection.end();
  });

  function hasMessageField(body) {
    expect(Object.keys(body)).toContain("message");
  }
  
  describe("1 - Crie um endpoint para o cadastro de produtos", () => {
    it("Será validado que o campo name esteja presente no body da requisição", async()=>{
      await frisby
        .post(`${url}/products/`, {
          // name: "Olho de Thundera",
          quantity: 2,
        })
        .expect("status", 400)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual(
            '\"name\" is required'
          );
        });
    })
    it("Será validado que o campo quantity esteja presente no body da requisição", async()=>{
      await frisby
        .post(`${url}/products/`, {
          name: "Olho de Thundera",
          // quantity: 2,
        })
        .expect("status", 400)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual(
            '\"quantity\" is required'
          );
        });
    })
    it("Será validado que não é possível criar um produto com o nome menor que 5 caracteres", async () => {
      await frisby
        .post(`${url}/products/`, {
          name: "Rai",
          quantity: 100,
        })
        .expect("status", 422)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual(
            '"name" length must be at least 5 characters long'
          );
        });
    });

    it("Será validado que não é possível criar um produto com o mesmo nome de outro já existente", async () => {
      await frisby
        .post(`${url}/products/`, {
          name: "Martelo de Thor",
          quantity: 100,
        })
        .expect("status", 409)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual("Product already exists");
        });
    });

    it("Será validado que não é possível criar um produto com quantidade menor que zero", async () => {
      await frisby
        .post(`${url}/products`, {
          name: "Produto do Batista",
          quantity: -1,
        })
        .expect("status", 422)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual(
            '"quantity" must be a number larger than or equal to 1'
          );
        });
    });

    it("Será validado que não é possível criar um produto com quantidade igual a zero", async () => {
      await frisby
        .post(`${url}/products`, {
          name: "Produto do Batista",
          quantity: 0,
        })
        .expect("status", 422)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual(
            '"quantity" must be a number larger than or equal to 1'
          );
        });
    });

    it("Será validado que não é possível criar um produto com uma string no campo quantidade", async () => {
      await frisby
        .post(`${url}/products`, {
          name: "Produto do Batista",
          quantity: "string",
        })
        .expect("status", 422)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          hasMessageField(body);
          const { message } = body;
          expect(message).toEqual('"quantity" must be a number larger than or equal to 1');
        });
    });

    it("Será validado que é possível criar um produto com sucesso", async () => {
      await frisby
        .post(`${url}/products`, {
          name: "Arco do Gavião Arqueiro",
          quantity: 1,
        })
        .expect("status", 201)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          const productName = body.name;
          const quantityProduct = body.quantity;
          expect(productName).toEqual("Arco do Gavião Arqueiro");
          expect(quantityProduct).toEqual(1);
          expect(body).toHaveProperty("id");
        });
    });
  });

  describe("2 - Crie um endpoint para listar os produtos", () => {
    it("Será validado que todos produtos estão sendo retornados", async () => {
      await frisby
        .get(`${url}/products`)
        .expect("status", 200)
        .then((res) => {
          let { body } = res;
          body = JSON.parse(body);
          const firstProductName = body[0].name;
          const firstQuantityProduct = body[0].quantity;
          const secondProductName = body[1].name;
          const secondQuantityProduct = body[1].quantity;
          const thirdProductName = body[2].name;
          const thirdQuantityProduct = body[2].quantity;

          expect(body[0]).toHaveProperty('id');
          expect(firstProductName).toEqual("Martelo de Thor");
          expect(firstQuantityProduct).toEqual(10);
          expect(body[1]).toHaveProperty('id');
          expect(secondProductName).toEqual("Traje de encolhimento");
          expect(secondQuantityProduct).toEqual(20);
          expect(body[2]).toHaveProperty('id');
          expect(thirdProductName).toEqual("Escudo do Capitão América");
          expect(thirdQuantityProduct).toEqual(30);
        });
    });

    it("Será validado que não é possível listar um produto que não existe", async () => {
      await frisby
        .get(`${url}/products/${INVALID_ID}`)
        .expect("status", 404)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          const { message } = json;
          expect(message).toEqual("Product not found");
        });
    });

    it("Será validado que é possível listar um determinado produto", async () => {
      let result;

      await frisby
        .post(`${url}/products`, {
          name: "Armadura do Homem de Ferro",
          quantity: 40,
        })
        .expect("status", 201)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          responseProductId = result.id;
        });

      await frisby
        .get(`${url}/products/${responseProductId}`)
        .expect("status", 200)
        .then((secondResponse) => {
          const { json } = secondResponse;
          const productName = json.name;
          const quantityProduct = json.quantity;
          expect(productName).toEqual("Armadura do Homem de Ferro");
          expect(json).toHaveProperty("id");
          expect(quantityProduct).toEqual(40);
        });
    });
  });

  describe("3 - Crie um endpoint para atualizar um produto", () => {
    it("Será validado que não é possível atualizar um produto com o nome menor que 5 caracteres", async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .put(`${url}/products/${resultProductId}`, {
          name: "Mar",
          quantity: 10,
        })
        .expect("status", 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toEqual(
            '"name" length must be at least 5 characters long'
          );
        });
    });

    it("Será validado que não é possível atualizar um produto com quantidade menor que zero", async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .put(`${url}/products/${resultProductId}`, {
          name: "Martelo de Thor",
          quantity: -1,
        })
        .expect("status", 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toEqual(
            '\"quantity\" must be a number larger than or equal to 1'
          );
        });
    });

    it("Será validado que não é possível atualizar um produto com quantidade igual a zero", async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .put(`${url}/products/${resultProductId}`, {
          name: "Martelo de Thor",
          quantity: 0,
        })
        .expect("status", 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toEqual(
            '\"quantity\" must be a number larger than or equal to 1'
          );
        });
    });

    it("Será validado que não é possível atualizar um produto com uma string no campo quantidade", async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .put(`${url}/products/${resultProductId}`, {
          name: "Martelo de Thor",
          quantity: "string",
        })
        .expect("status", 422)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          expect(json.message).toEqual('\"quantity\" must be a number larger than or equal to 1');
        });
    });

    it("Será validado que é possível atualizar um produto com sucesso", async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .put(`${url}/products/${resultProductId}`, {
          name: "Machado de Thor",
          quantity: 20,
        })
        .expect("status", 200)
        .then((secondResponse) => {
          const { json } = secondResponse;
          const productName = json.name;
          const quantityProduct = json.quantity;
          expect(productName).toEqual("Machado de Thor");
          expect(quantityProduct).toEqual(20);
        });
    });

    it("Será validado que não é possível atualizar um produto que não existe", async () => {
      await frisby
        .put(`${url}/products/${INVALID_ID}`,{
          name: "produto inexistente",
          quantity: 1,
        })
        .expect("status", 404)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json)
          const { message } = json;
          expect(message).toEqual("Product not found");
        });
    });
  });

  describe("4 - Crie um endpoint para deletar um produto", () => {
    it("Será validado que é possível deletar um produto com sucesso", async () => {
      let result;
      let resultProductId;

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          resultProductId = result[0].id;
        });

      await frisby
        .delete(`${url}/products/${resultProductId}`)
        .expect("status", 200)
        .then((secondResponse) => {
          let { body } = secondResponse;
          body = JSON.parse(body);
          expect(body).toHaveProperty("id");
          expect(body).toHaveProperty("name");
          expect(body).toHaveProperty("quantity");
        });

      await frisby
        .get(`${url}/products/`)
        .expect("status", 200)
        .then((response) => {
          const { body } = response;
          result = JSON.parse(body);
          expect(result.length).toBe(2);
        });
    });

    it("Será validado que não é possível deletar um produto que não existe", async () => {
      await frisby
        .delete(`${url}/products/${INVALID_ID}`)
        .expect("status", 404)
        .then((secondResponse) => {
          const { json } = secondResponse;
          hasMessageField(json);
          expect(json.message).toEqual("Product not found");
        });
    });
  });
});
