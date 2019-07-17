/* create channels table */ 
drop table if exists channels cascade;
CREATE TABLE if not EXISTS channels (
  id serial PRIMARY KEY,
  name varchar not null,
  created_At timestamp not null DEFAULT CURRENT_TIMESTAMP,
  num_Podcasts integer default 0,
  start_year int,
  channel_art varchar,
  language varchar not null default 'english',
  description text not null
);

/* create podcasts table */ 
drop table if exists podcasts cascade;
CREATE TABLE if not EXISTS podcasts (
  id serial PRIMARY KEY,
  title varchar NOT NULL,
  description text NOT NULL,
  published_at timestamp default current_timestamp,
  created_at timestamp not null default current_timestamp,
  url varchar NOT NULL,
  language varchar NOT NULL default 'english',
  channel_id int not null,
  foreign key (channel_id) references channels(id) on delete cascade on update cascade
);

/* create hosts table */ 
drop table if exists hosts cascade;
create table if not exists hosts (
  id serial primary key,
  name varchar not null,
  bio text not null,
  language varchar not null,
  country varchar not null,
  email varchar not null,
  job_title varchar,
  organization varchar,
  orcid varchar,
  website varchar
);

/* create voices table */ 
drop table if exists voices cascade;
create table if not exists voices (
  id serial primary key,
  name varchar not null,
  bio text not null,
  language varchar not null,
  country varchar not null,
  email varchar not null,
  job_title varchar,
  organization varchar,
  orcid varchar,
  website varchar
);

/* create podcast-voice relationship table */ 
/* 
  a voice can be in many podcasts and 
  podcasts can have many voices 
*/ 
drop table if exists podcast_voices cascade;
create table if not exists podcast_voices(
  podcast_id int not null,
  voice_id int not null,
  primary key (podcast_id, voice_id),
  foreign key (podcast_id) references podcasts(id) on delete cascade on update cascade,
  foreign key (voice_id) references voices(id) on delete cascade on update cascade
);

/* create channel-host relationship table */ 
/* 
  a host host many channels and a 
  channel can have many hosts 
*/
drop table if exists channel_hosts cascade;
create table if not exists channel_hosts(
  channel_id int not null,
  host_id int not null,
  channel_role varchar,
  primary key (channel_id, host_id),
  foreign key (channel_id) references channels(id) on delete cascade on update cascade,
  foreign key (host_id) references hosts(id) on delete cascade on update cascade
);

/* seed some data into channels and podcasts */
insert into channels(name, start_year, description) values ('test channel 1', 2018, 'this is description 1');
insert into channels(name, start_year, description) values ('test channel 2', 2018, 'this is description 2');
insert into podcasts(title, description, url, language, channel_id)
  values (
    'test podcast 1',
    'this is the description for the very first podcast',
    'https://storage.cloud.google.com/cd-audio/The_CONDUCTOR_Andrew_and_Scot.mp3',
    'english',
    (select id from channels where name='test channel 1')
  );
insert into podcasts(title, description, url, language, channel_id)
  values (
    'test podcast 2',
    'this is the description for the very first podcast',
    'https://storage.cloud.google.com/cd-audio/The_CONDUCTOR_Andrew_and_Scot.mp3',
    'english',
    (select id from channels where name='test channel 2')
  );

with rows as (
  insert into hosts(name, bio, language, country, email)
    values (
      'steve harrington',
      'has wacky cool hair',
      'english',
      'united states',
      'steve@hawkins.com'
    ) returning id
) insert into channel_hosts (channel_id, host_id, channel_role)
  values (1, (select id from rows), 'host');