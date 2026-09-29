const env = require('./env');
const generateId = require('../utils/generateId');

// In-Memory Collection implementation mimicking Mongoose model API
class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.documents = new Map();
  }

  _matchesQuery(doc, query = {}) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const [key, expected] of Object.entries(query)) {
      if (key === '_id' || key === 'id') {
        const docId = doc._id || doc.id;
        if (docId !== expected) return false;
        continue;
      }

      const val = doc[key];

      if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
        // Handle basic operators: $in, $ne, $exists, $gt, $lt
        if ('$in' in expected) {
          if (!expected.$in.includes(val)) return false;
        } else if ('$ne' in expected) {
          if (val === expected.$ne) return false;
        } else if ('$gt' in expected) {
          if (!(val > expected.$gt)) return false;
        } else if ('$lt' in expected) {
          if (!(val < expected.$lt)) return false;
        } else if ('$exists' in expected) {
          const exists = val !== undefined && val !== null;
          if (exists !== expected.$exists) return false;
        }
      } else {
        if (val !== expected) return false;
      }
    }
    return true;
  }

  async find(query = {}) {
    const results = [];
    for (const doc of this.documents.values()) {
      if (this._matchesQuery(doc, query)) {
        results.push(JSON.parse(JSON.stringify(doc)));
      }
    }
    return results;
  }

  async findOne(query = {}) {
    for (const doc of this.documents.values()) {
      if (this._matchesQuery(doc, query)) {
        return JSON.parse(JSON.stringify(doc));
      }
    }
    return null;
  }

  async findById(id) {
    if (!id) return null;
    const strId = String(id);
    const doc = this.documents.get(strId);
    if (!doc) {
      // Also check if doc._id matches
      for (const d of this.documents.values()) {
        if (String(d._id) === strId || String(d.id) === strId) {
          return JSON.parse(JSON.stringify(d));
        }
      }
      return null;
    }
    return JSON.parse(JSON.stringify(doc));
  }

  async create(data) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(item => this.create(item)));
    }

    const now = new Date().toISOString();
    const id = data._id || data.id || generateId(this.name.slice(0, 4));
    const newDoc = {
      ...data,
      _id: id,
      id: id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    };

    this.documents.set(id, newDoc);
    return JSON.parse(JSON.stringify(newDoc));
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (!id) return null;
    const strId = String(id);
    let existing = this.documents.get(strId);
    if (!existing) {
      for (const d of this.documents.values()) {
        if (String(d._id) === strId || String(d.id) === strId) {
          existing = d;
          break;
        }
      }
    }
    if (!existing) return null;

    const updates = updateData.$set ? { ...updateData.$set } : { ...updateData };
    delete updates.$set;
    delete updates._id;

    // Handle $inc if provided
    if (updateData.$inc) {
      for (const [key, amount] of Object.entries(updateData.$inc)) {
        updates[key] = (Number(existing[key]) || 0) + Number(amount);
      }
    }

    // Handle $push if provided
    if (updateData.$push) {
      for (const [key, item] of Object.entries(updateData.$push)) {
        const arr = Array.isArray(existing[key]) ? [...existing[key]] : [];
        arr.push(item);
        updates[key] = arr;
      }
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.documents.set(existing._id, updated);
    return JSON.parse(JSON.stringify(options.new !== false ? updated : existing));
  }

  async updateOne(query, updateData) {
    const doc = await this.findOne(query);
    if (!doc) return { modifiedCount: 0 };
    await this.findByIdAndUpdate(doc._id, updateData);
    return { modifiedCount: 1 };
  }

  async updateMany(query, updateData) {
    const docs = await this.find(query);
    for (const doc of docs) {
      await this.findByIdAndUpdate(doc._id, updateData);
    }
    return { modifiedCount: docs.length };
  }

  async deleteOne(query) {
    const doc = await this.findOne(query);
    if (!doc) return { deletedCount: 0 };
    this.documents.delete(doc._id);
    return { deletedCount: 1 };
  }

  async deleteMany(query = {}) {
    const docs = await this.find(query);
    for (const doc of docs) {
      this.documents.delete(doc._id);
    }
    return { deletedCount: docs.length };
  }

  async countDocuments(query = {}) {
    const docs = await this.find(query);
    return docs.length;
  }

  async clear() {
    this.documents.clear();
  }
}

// In-Memory store registry
const collections = new Map();

function getCollection(name) {
  if (!collections.has(name)) {
    collections.set(name, new InMemoryCollection(name));
  }
  return collections.get(name);
}

let isConnected = false;
let dbType = 'in-memory';

async function connectDB() {
  if (isConnected) return { connected: true, type: dbType };

  if (env.MONGODB_URI && !env.USE_IN_MEMORY_DB) {
    try {
      const mongoose = require('mongoose');
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 2000,
      });
      isConnected = true;
      dbType = 'mongodb';
      console.log('MongoDB connected successfully');
      return { connected: true, type: 'mongodb' };
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to In-Memory DB:', err.message);
    }
  }

  isConnected = true;
  dbType = 'in-memory';
  console.log('Using in-memory fast storage for demo/development');
  return { connected: true, type: 'in-memory' };
}

module.exports = {
  connectDB,
  getCollection,
  InMemoryCollection,
};
