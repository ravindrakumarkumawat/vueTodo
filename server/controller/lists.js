const { hmset, rpush, hexists, lrange, hset, hget, lrem, hdel } = require('../models/connect')

// get all the lists
exports.get_lists = async (req, res) => {
  try {
    const listIds = await lrange('listIds', 0, -1)
    if (!listIds.length) res.status(200).send({ lists: [] })
    const lists = []
    for (const listId of listIds) {
      const list = await hget(listId, 'list')
      const items = await hget(listId, 'items')
      lists.push({ list_id: parseInt(listId), list: list, items: JSON.parse(items) })
    }
    res.status(200).send(lists)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.add_list = async (req, res) => {
  try {
    const { newList } = req.body
    const listId = Date.now()
    await hmset(listId, 'list', newList, 'items', '[]')
    await rpush('listIds', listId)
    res.status(200).json({ list_id: listId, list: newList })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.update_list = async (req, res) => {
  try {
    const { id } = req.params
    const { newList } = req.body
    const list = await hexists(id, 'list')
    if (!list) {
      return res.status(404).json({ error: 'list doesnt exist' })
    }
    await hset(id, 'list', newList)
    res.status(200).json({ list_id: parseInt(id), list: newList })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.delete_list = async (req, res) => {
  try {
    const { id } = req.params
    const del = await lrem('listIds', 0, id)
    if (!del) {
      return res.status(404).json({ error: 'The list does not exists' })
    }
    await hdel(id, 'list')
    await hdel(id, 'items')
    res.status(200).json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
