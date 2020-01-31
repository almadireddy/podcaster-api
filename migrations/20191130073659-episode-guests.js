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
  return db.createTable('episode_guests', {
    episode_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      foreignKey: {
        name: "episodes_guest_fk",
        table: "episodes",
        rules: {
          onDelete: 'CASCADE',
          onUpdate: "CASCADE"
        },
        mapping: "id"
      }
    },
    guest_id: {
      type: 'int',
      primaryKey: true,
      foreignKey: {
        name: "guest_episode_fk",
        table: "guests",
        rules: {
          onDelete: 'CASCADE',
          onUpdate: "CASCADE"
        },
        mapping: "id"
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('episode_guests')
};

exports._meta = {
  "version": 1
};
