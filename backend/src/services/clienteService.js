const db = require("../config/db");

const clienteService = {
  getAll: () => {
    return db.query("SELECT * FROM clientes");
  },

  create: (data) => {
    return db.query("INSERT INTO clientes SET ?", [data]);
  },

  update: (id, data) => {
    return db.query("UPDATE clientes SET ? WHERE id = ?", [data, id]);
  },

  delete: (id) => {
    return db.query("DELETE FROM clientes WHERE id = ?", [id]);
  },
};

module.exports = clienteService;
