'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('episodes', {
    id: {
      type: "int",
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: 'string',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    published_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String("CURRENT_TIMESTAMP")
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String("CURRENT_TIMESTAMP")
    },
    url: {
      type: "string",
      notNull: true
    },
    language: {
      type: 'string',
      notNull: true,
      defaultValue: "english"
    },
    podcast_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        table: 'podcasts',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'cascade'
        },
        mapping: 'id'
      }
    },
  })
};

exports.down = function(db) {
  return db.dropTable('episodes')
};

exports._meta = {
  "version": 1
};
