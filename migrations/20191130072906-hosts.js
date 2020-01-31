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
  return db.createTable('hosts', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      notNull: true
    },
    bio: {
      type: 'text',
      notNull: true
    },
    language: {
      type: 'string',
      notNull: true
    },
    country: {
      type: 'string',
      notNull: true
    },
    contact_email: {
      type: 'string',
      notNull: true
    },
    email: {
      type: 'string',
    },
    job_title: {
      type: 'string',
    },
    organization: {
      type: 'string',
    },
    orcid: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
    profile_picture: {
      type: 'string'
    },
  })
};

exports.down = function(db) {
  return db.dropTable('hosts')
};

exports._meta = {
  "version": 1
};
