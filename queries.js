const db = require('./db')

async function createPodcast(podcast) {
  let {title, description, url, language, channel_id} = podcast;
  if (language == undefined) {
    language = "english";
  }

  const query = `insert into podcasts 
  (title, description, url, language, channel_id)
  values (
    '$1',
    '$2',
    '$3',
    '$4', 
    (select id from channels where id='$5')
  ) returning id;`
  
  const x = await db.query(query, [title, description, url, language, channel_id]);
  return x;
}

async function listPodcasts(opts) {
  let {limit, orderBy} = opts;

  if (limit == null) {
    limit = 10;
  }
  if (orderBy == null) {
    orderBy = "created_at";
  }

  const query = `select * from podcasts order by $1 limit $2`;

  const x = await db.query(query, [orderBy, limit]);
  return x;
}

async function getPodcastWithId(id) {
  const r = await _getPodcastWithId(id);
  let podcast = r.rows[0];

  const r2 = await getVoicesInPodcast(id);
  podcast.voices = r2.rows;

  return podcast;
}

async function _getPodcastWithId(id) {
  const query = `select * from podcasts where id=$1`;

  const x = await db.query(query, [id]);
  return x;
}

async function getPodcastsWithChannelId(channelId) {
  const query = `select * from podcasts where channel_id=$1 order by created_at;`;

  const x = await db.query(query, [channelId]);
  return x;
}

async function listChannels(opts) {
  let {limit, orderBy} = opts;

  if (limit == null) {
    limit = 10;
  }
  if (orderBy == null) {
    orderBy = "created_at";
  }

  const query = `select * from channels order by $1 limit $2`;

  const x = await db.query(query, [orderBy, limit]);
  return x;
}

async function createChannel(channel) {
  const {name, start_year, channel_art, language, description} = channel;

  const query = `insert into channels 
    (name, start_year, language, description, channel_art)
    values (
      $1, $2, $3, $4, $5
    ) returning id;`
  
  const x = await db.query(query, [name, start_year, language, description, channel_art])
  return x;
}

async function getChannelWithId(id) {
  const r = await _getChannelWithId(id);
  let channel = r.rows[0];
  const r2 = await getHostsOfChannel(id)
  channel.hosts = r2.rows;

  return channel
}

async function _getChannelWithId(id) {
  const query = `select * from channels where id=$1;`;

  const x = await db.query(query, [id]);
  return x;
}

async function listHosts(opts) {
  let {limit, orderBy} = opts;

  if (limit == null) {
    limit = 10;
  }
  if (orderBy == null) {
    orderBy = "created_at";
  }

  const query = `select * from hosts order by $1 limit $2`;

  const x = await db.query(query, [orderBy, limit]);
  return x;
}

async function createHost(host) {
  const {name, bio, language, country, email, job_title, organization, orcid, website} = host;
  
  const query = `insert into hosts 
    (name, bio, language, country,email, job_title, organization, orcid, website)
    values ($1, $2, $3, $4,  $5,  $6,  $7,  $8,  $9) returning id;`
  
  const x = await db.query(query, [name, bio, language, country, email, job_title, organization, orcid, website]);
  return x
}

async function getHostWithId(id) {
  const r = await _getHostWithId(id);
  let host = r.rows[0];
  let r2 = await queries.getChannelsOfHost(id);
  host.channels = r2.rows;
  
  return host;
}

async function _getHostWithId(id) {
  const query = `select * from hosts where id=$1;`;

  const x = await db.query(query, [id]);
  return x;
}

async function assignHostToChannel(host_id, channel_id, role) {
  const query = `insert into channel_hosts (channel_id, host_id, channel_role)
    values ( $1, $2, $3 )`;
  
  let x;
  try {
    x = await db.query(query, [channel_id, host_id, role])
  } catch (e) {
    console.log(e)
    return false;
  }
  
  return x;
}

async function getHostsOfChannel(channel_id) {
  const query = `SELECT h.*, ch.channel_role FROM hosts h
  inner join channel_hosts ch on h.id=ch.host_id 
  inner join channels c on ch.channel_id=c.id
  where c.id=$1`;

  const x = await db.query(query, [channel_id])
  return x
}

async function getChannelsOfHost(host_id) {
  const query = `SELECT c.*, ch.channel_role FROM channels c
  inner join channel_hosts ch on c.id=ch.channel_id 
  inner join hosts h on ch.host_id=h.id
  where h.id=$1;`;

  const x = await db.query(query, [host_id])
  return x
}

async function listVoices(opts) {
  let {limit, orderBy} = opts;

  if (limit == null) {
    limit = 10;
  }
  if (orderBy == null) {
    orderBy = "created_at";
  }

  const query = `select * from VOICES order by $1 limit $2`;

  const x = await db.query(query, [orderBy, limit]);
  return x;
}

async function createVoice(voice) {
  const {name, bio, language, country, email, job_title, organization, orcid, website} = voice;
  
  const query = `insert into voices 
    (name, bio, language, country,email, job_title, organization, orcid, website)
    values ($1, $2, $3, $4,  $5,  $6,  $7,  $8,  $9) returning id;`
  
  const x = await db.query(query, [name, bio, language, country, email, job_title, organization, orcid, website]);
  return x
}

async function getVoiceWithId(id) {
  const r = await _getVoiceWithId(id);
  let voice = r.rows[0];
  let r2 = await getPodcastsOfVoice(id);
  voice.podcasts = r2.rows;

  return voice;
}

async function _getVoiceWithId(id) { 
  const query = `select * from voices where id=$1;`;

  const x = await db.query(query, [id]);
  return x;
}

async function assignVoiceToPodcast(voice_id, podcast_id) {
  const query = `insert into podcast_voices (voice_id, podcast_id)
    values ( $1, $2 )`;
  
  let x;
  try {
    x = await db.query(query, [voice_id, podcast_id])
  } catch (e) {
    console.log(e)
    return false;
  }
  return x;
}

async function getVoicesInPodcast(podcast_id) {
  const query = `SELECT v.* FROM voices v
  inner join podcast_voices pv on v.id=pv.voice_id 
  inner join podcasts p on pv.podcast_id=p.id
  where p.id=$1`;

  const x = await db.query(query, [podcast_id])
  return x
}

async function getPodcastsOfVoice(voice_id) {
  const query = `SELECT p.* FROM podcasts p
  inner join podcast_voices pv on p.id=pv.podcast_id 
  inner join voices v on pv.voice_id=v.id
  where v.id=$1`;

  const x = await db.query(query, [voice_id])
  return x
}

module.exports = {
  createPodcast,
  listPodcasts,
  getPodcastsWithChannelId,
  getPodcastWithId,
  listChannels,
  createChannel,
  getChannelWithId,
  listHosts,
  createHost,
  getHostWithId,
  assignHostToChannel,
  getHostsOfChannel,
  getChannelsOfHost,
  listVoices,
  createVoice,
  getVoiceWithId,
  assignVoiceToPodcast,
  getVoicesInPodcast,
  getPodcastsOfVoice,
}
