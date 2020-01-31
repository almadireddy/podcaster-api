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
  return db.createTable('podcasts', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    }, 
    name: {
      type: "string",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      defaultValue: new String("CURRENT_TIMESTAMP")
    },
    num_episodes: {
      type: 'int',
      defaultValue: 0
    },
    start_year: {
      type: "int",
    },
    podcast_art: {
      type: "string",
    },
    language: {
      type: 'string',
      notNull: true,
      defaultValue: "english"
    },
    description: {
      type: 'text',
      notNull: true
    }
  })
};

exports.down = function(db) {
  return db.dropTable('podcasts')
};

exports._meta = {
  "version": 1
};
