const pool = require('./postgreSQL');
const coin = require('./coin');
const user = require('./user');

pool.connect();

//init DB CREATE

pool.query('CREATE TABLE IF NOT EXISTS peggy (peggy_id SERIAL UNIQUE PRIMARY KEY);');
pool.query('CREATE TABLE IF NOT EXISTS users (user_id SERIAL UNIQUE, name VARCHAR(45) NOT NULL, balance INT NULL, lastchanged timestamptz NOT NULL, role VARCHAR(45) NULL, peggy_id INT NULL, token INT NOT NULL, PRIMARY KEY (user_id), CONSTRAINT peggy_id_users FOREIGN KEY (peggy_id) REFERENCES peggy (peggy_id));');
pool.query('CREATE TABLE IF NOT EXISTS coins (coins_id SERIAL UNIQUE, name VARCHAR(45) NOT NULL, amount INT NOT NULL, lastchanged timestamptz NOT NULL, peggy_id INT NOT NULL, PRIMARY KEY (coins_id), CONSTRAINT peggy_id_coins FOREIGN KEY (peggy_id) REFERENCES peggy (peggy_id));');

//init DB INSERT
pool.query('INSERT INTO peggy (peggy_id) VALUES(DEFAULT);');

var coins = [{
    "name": 5,
    "amount": 0
},
    {
        "name": 2,
        "amount": 0
    },
    {
        "name": 1,
        "amount": 0
    },
    {
        "name": 0.5,
        "amount": 0
    },
    {
        "name": 0.2,
        "amount": 0
    },
    {
        "name": 0.1,
        "amount": 0
    },
    {
        "name": 0.05,
        "amount": 0
    }
];

for (var i = 0; i < coins.length; i++) {
    coin.postCoin(coins[i].name, coins[i].amount);
}

var users = [{
    "name": "mom",
    "balance": 0,
    "role": "admin"
},
    {
        "name": "dad",
        "balance": 0,
        "role": "admin"
    },
    {
        "name": "kid1",
        "balance": 0,
        "role": "user"
    },
    {
        "name": "kid2",
        "balance": 0,
        "role": "user"
    }
];

for (var i = 0; i < users.length; i++) {
    user.postUser(users[i].name, users[i].balance, users[i].role, 2);
}