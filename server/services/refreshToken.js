const { reject, find } = require('lodash');

let tokens = [];

exports.find = async query => find(tokens, query);

exports.add = async entry => tokens.push(entry);

exports.remove = async query => (tokens = reject(tokens, query));

exports.getAll = async () => tokens;