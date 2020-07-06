const config = require('config');
const mysql = require('promise-mysql');

const state = {
  connection: null
};

exports.getConnection = () => state.connection;

exports.connect = async () => {
  if (state.connection) return;

  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
  };

  state.connection = await mysql.createConnection(Object.assign({}, config.get('mysql')));
};

exports.disconnect = () => {
  if (!state.connection) return;

  state.connection.end();
};