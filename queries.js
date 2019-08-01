const db = require('./db')

async function createEpisode(episode) {
  let {title, description, url, language, podcast_id} = episode;
  if (language == undefined) {
    language = "english";
  }

  const query = `insert into episodes 
  (title, description, url, language, podcast_id)
  values (
    $1,
    $2,
    $3,
    $4, 
    (select id from podcasts where id=$5)
  ) returning id;`
  const params =  [title, description, url, language, podcast_id]
  console.log(params)
  const x = await db.query(query, params);
  return x;
}

async function listEpisodes(opts) {
  let {limit, orderBy} = opts;

  if (limit == null) {
    limit = 10;
  }
  if (orderBy == null) {
    orderBy = "created_at";
  }

  const query = `select * from episodes order by $1 limit $2`;

  const x = await db.query(query, [orderBy, limit]);
  return x;
}

async function getEpisodeWithId(id) {
  const r = await _getEpisodeWithId(id);
  let episode = r.rows[0];

  const r2 = await getGuestsInEpisode(id);
  episode.guests = r2.rows;

  const r3 = await _getPodcastWithId(episode.podcast_id)
  episode.podcast = r3.rows[0]
  return episode;
}

async function _getEpisodeWithId(id) {
  const query = `select * from episodes where id=$1`;

  const x = await db.query(query, [id]);
  return x;
}

async function getEpisodesWithPodcastId(podcastId) {
  const query = `select * from episodes where podcast_id=$1 order by created_at;`;

  const x = await db.query(query, [podcastId]);
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

async function createPodcast(podcast) {
  const {name, start_year, podcast_art, language, description} = podcast;

  const query = `insert into podcasts 
    (name, start_year, language, description, podcast_art)
    values (
      $1, $2, $3, $4, $5
    ) returning *;`
  
  const x = await db.query(query, [name, start_year, language, description, podcast_art])
  return x;
}

async function getPodcastWithId(id) {
  const r = await _getPodcastWithId(id);
  let podcast = r.rows[0];
  const r2 = await getHostsOfPodcast(id)
  podcast.hosts = r2.rows;
  const r3 = await getEpisodesWithPodcastId(id)
  podcast.episodes = r3.rows;
  
  return podcast
}

async function _getPodcastWithId(id) {
  const query = `select * from podcasts where id=$1;`;

  const x = await db.query(query, [id]);
  return x;
}

async function changePodcastImage(podcastId, newImageUrl) {
  const query = "update podcasts set podcast_art = $2 where podcasts.id = $1 returning *"
  const x = await db.query(query, [podcastId, newImageUrl])
  console.log(query, podcastId, newImageUrl)
  return x;
}

async function changeEpisodeAudio(episodeId, newAudioUrl) {
  const query = "update episodes set url = $2 where episodes.id = $1 returning *"
  const x = await db.query(query, [episodeId, newAudioUrl])
  console.log(query, episodeId, newAudioUrl)
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
  let r2 = await queries.getPodcastsOfHost(id);
  host.podcasts = r2.rows;
  
  return host;
}

async function _getHostWithId(id) {
  const query = `select * from hosts where id=$1;`;

  const x = await db.query(query, [id]);
  return x;
}

async function updatePodcast(id, values) {
  let {name, description, language, start_year} = values
  let query = `update podcasts set 
  name = coalesce($1, name),
  description = coalesce($2, description),
  language = coalesce($3, language),
  start_year = coalesce($4, start_year)
  where id = $5 returning *`

  let x = await db.query(query, [
    name,
    description, 
    language,
    start_year,
    id
  ]);
  console.log(x.rows[0])
  return x;
}

async function assignHostToPodcast(host_id, podcast_id, role) {
  const query = `insert into podcast_hosts (podcast_id, host_id, podcast_role)
    values ( $1, $2, $3 )`;
  
  let x;
  try {
    x = await db.query(query, [podcast_id, host_id, role])
  } catch (e) {
    console.log(e)
    return false;
  }
  
  return x;
}

async function assignEpisodeToPodcast(episode_id, podcast_id) {
  const query = `update episodes set podcast_id = $2 where episodes.id = $1 returning *`;
  
  let x;
  try {
    x = await db.query(query, [podcast_id, episode_id])
  } catch (e) {
    console.log(e)
    return false;
  }
  
  return x;
}

async function getHostsOfPodcast(podcast_id) {
  const query = `SELECT h.*, ch.podcast_role FROM hosts h
  inner join podcast_hosts ch on h.id=ch.host_id 
  inner join podcasts c on ch.podcast_id=c.id
  where c.id=$1`;

  const x = await db.query(query, [podcast_id])
  return x
}

async function getPodcastsOfHost(host_id) {
  const query = `SELECT c.*, ch.podcast_role FROM podcasts c
  inner join podcast_hosts ch on c.id=ch.podcast_id 
  inner join hosts h on ch.host_id=h.id
  where h.id=$1;`;

  const x = await db.query(query, [host_id])
  return x
}

async function listGuests(opts) {
  let {limit, orderBy} = opts;

  if (limit == null) {
    limit = 10;
  }
  if (orderBy == null) {
    orderBy = "created_at";
  }

  const query = `select * from GUESTS order by $1 limit $2`;

  const x = await db.query(query, [orderBy, limit]);
  return x;
}

async function createGuest(guest) {
  const {name, bio, language, country, email, job_title, organization, orcid, website} = guest;
  
  const query = `insert into guests 
    (name, bio, language, country,email, job_title, organization, orcid, website)
    values ($1, $2, $3, $4,  $5,  $6,  $7,  $8,  $9) returning id;`
  
  const x = await db.query(query, [name, bio, language, country, email, job_title, organization, orcid, website]);
  return x
}

async function getGuestWithId(id) {
  const r = await _getGuestWithId(id);
  let guest = r.rows[0];
  let r2 = await getEpisodesOfGuest(id);
  guest.episodes = r2.rows;

  return guest;
}

async function _getGuestWithId(id) { 
  const query = `select * from guests where id=$1;`;

  const x = await db.query(query, [id]);
  return x;
}

async function assignGuestToEpisode(guest_id, episode_id) {
  const query = `insert into episode_guests (guest_id, episode_id)
    values ( $1, $2 )`;
  
  let x;
  try {
    x = await db.query(query, [guest_id, episode_id])
  } catch (e) {
    console.log(e)
    return false;
  }
  return x;
}

async function getGuestsInEpisode(episode_id) {
  const query = `SELECT v.* FROM guests v
  inner join episode_guests pv on v.id=pv.guest_id 
  inner join episodes p on pv.episode_id=p.id
  where p.id=$1`;

  const x = await db.query(query, [episode_id])
  return x
}

async function getEpisodesOfGuest(guest_id) {
  const query = `SELECT p.* FROM episodes p
  inner join episode_guests pv on p.id=pv.episode_id 
  inner join guests v on pv.guest_id=v.id
  where v.id=$1`;

  const x = await db.query(query, [guest_id])
  return x
}

module.exports = {
  createEpisode,
  listEpisodes,
  getEpisodesWithPodcastId,
  getEpisodeWithId,
  listPodcasts,
  createPodcast,
  getPodcastWithId,
  updatePodcast,
  assignEpisodeToPodcast,
  listHosts,
  createHost,
  getHostWithId,
  assignHostToPodcast,
  getHostsOfPodcast,
  getPodcastsOfHost,
  changePodcastImage,
  listGuests,
  createGuest,
  getGuestWithId,
  assignGuestToEpisode,
  getGuestsInEpisode,
  getEpisodesOfGuest,
  changeEpisodeAudio
}
