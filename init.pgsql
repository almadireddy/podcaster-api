/* create podcasts table */ 
drop table if exists podcasts cascade;
CREATE TABLE if not EXISTS podcasts (
  id serial PRIMARY KEY,
  name varchar not null,
  created_At timestamp not null DEFAULT CURRENT_TIMESTAMP,
  num_episodes integer default 0,
  start_year int,
  podcast_art varchar,
  language varchar not null default 'english',
  description text not null
);

/* create episodes table */ 
drop table if exists episodes cascade;
CREATE TABLE if not EXISTS episodes (
  id serial PRIMARY KEY,
  title varchar NOT NULL,
  description text NOT NULL,
  published_at timestamp default current_timestamp,
  created_at timestamp not null default current_timestamp,
  url varchar NOT NULL,
  language varchar NOT NULL default 'english',
  podcast_id int not null,
  foreign key (podcast_id) references podcasts(id) on delete cascade on update cascade
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
  website varchar,
  profile_picture varchar
);

/* create guests table */ 
drop table if exists guests cascade;
create table if not exists guests (
  id serial primary key,
  name varchar not null,
  bio text not null,
  language varchar not null,
  country varchar not null,
  email varchar not null,
  job_title varchar,
  organization varchar,
  orcid varchar,
  website varchar,
  profile_picture varchar
);

/* create podcast-guest relationship table */ 
/* 
  a guest can be in many episodes and 
  episodes can have many guests 
*/ 
drop table if exists episode_guests cascade;
create table if not exists episode_guests(
  episode_id int not null,
  guest_id int not null,
  primary key (episode_id, guest_id),
  foreign key (episode_id) references episodes(id) on delete cascade on update cascade,
  foreign key (guest_id) references guests(id) on delete cascade on update cascade
);

/* create podcast-host relationship table */ 
/* 
  a host host many podcasts and a 
  podcast can have many hosts 
*/
drop table if exists podcast_hosts cascade;
create table if not exists podcast_hosts(
  podcast_id int not null,
  host_id int not null,
  podcast_role varchar,
  primary key (podcast_id, host_id),
  foreign key (podcast_id) references podcasts(id) on delete cascade on update cascade,
  foreign key (host_id) references hosts(id) on delete cascade on update cascade
);

/* seed some data into podcasts and episodes */
insert into podcasts(name, start_year, description) values ('test podcast 1', 2018, 'this is description 1');
insert into podcasts(name, start_year, description) values ('test podcast 2', 2018, 'this is description 2');
insert into episodes(title, description, url, language, podcast_id)
  values (
    'test episode 1',
    'this is the description for the very first podcast',
    'https://storage.cloud.google.com/cd-audio/The_CONDUCTOR_Andrew_and_Scot.mp3',
    'english',
    (select id from podcasts where name='test podcast 1')
  );
insert into episodes(title, description, url, language, podcast_id)
  values (
    'test episode 2',
    'this is the description for the very first episode',
    'https://storage.cloud.google.com/cd-audio/The_CONDUCTOR_Andrew_and_Scot.mp3',
    'english',
    (select id from podcasts where name='test podcast 2')
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
) insert into podcast_hosts (podcast_id, host_id, podcast_role)
  values (1, (select id from rows), 'host');