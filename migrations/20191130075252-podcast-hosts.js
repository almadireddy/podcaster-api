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
  return db.createTable('podcast_hosts', {
    podcast_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      foreignKey: {
        name: "podcasts_host_fk",
        table: "podcasts",
        rules: {
          onDelete: 'CASCADE',
          onUpdate: "CASCADE"
        },
        mapping: "id"
      }
    },
    host_id: {
      type: 'int',
      primaryKey: true,
      foreignKey: {
        name: "hosts_podcast_fk",
        table: "hosts",
        rules: {
          onDelete: 'CASCADE',
          onUpdate: "CASCADE"
        },
        mapping: "id"
      }
    },
    podcast_role: {
      type: 'string'
    }
  })
};

exports.down = function(db) {
  return db.dropTable('podcast_hosts')
};

exports._meta = {
  "version": 1
};
