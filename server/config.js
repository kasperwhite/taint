// cd C:\Program Files\MongoDB\Server\4.2\bin && mongod --dbpath=C:\Projects\taint\db\data --bind_ip 127.0.0.1
module.exports = {
  //'url': 'https://localhost:3443/',
  'url': 'http://localhost:3000',
  'mongoUrl': 'mongodb://localhost:27017/taint-db',
  'jwtSecret': '12345-67890-09876-54321'
}