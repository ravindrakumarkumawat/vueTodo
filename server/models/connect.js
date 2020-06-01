const redis = require('redis')
const client = redis.createClient(6379)
const { promisify } = require('util')

client.on('error', err => {
  console.log(err)
})

client.on('connect', () => {
  console.log('Connecte redis on port 6379')
})

const hmset = promisify(client.hmset).bind(client)
const rpush = promisify(client.rpush).bind(client)
const lrange = promisify(client.lrange).bind(client)
const hset = promisify(client.hset).bind(client)
const hget = promisify(client.hget).bind(client)
const lrem = promisify(client.lrem).bind(client)
const hdel = promisify(client.hdel).bind(client)
const hexists = promisify(client.hexists).bind(client)

module.exports = { hmset, rpush, hexists, lrange, hset, hget, lrem, hdel }
