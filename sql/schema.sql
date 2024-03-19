drop table act;
drop table game;
drop table player_team;
drop table player;
drop table team;


create table if not exists player(
    id serial PRIMARY KEY,
    name text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
CREATE UNIQUE INDEX idx_player_name ON player(name);

create table if not exists team(
    id serial PRIMARY KEY,
    name text null,
    player_signature integer ARRAY UNIQUE not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists player_team(
	id serial PRIMARY KEY,
	player_id int not null,
	team_id int not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
	CONSTRAINT fk_player
      FOREIGN KEY(player_id) 
        REFERENCES player(id),
	CONSTRAINT fk_team
      FOREIGN KEY(team_id) 
        REFERENCES team(id)
);
CREATE UNIQUE INDEX idx_player_team ON player_team(player_id, team_id);


create table if not exists game(
	id serial PRIMARY KEY,
    name UNIQUE text,
	date date,
	winner int null, -- loosen these null constraints to allow for insertion of game first
	team1 int null,
	team2 int null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
	CONSTRAINT fk_winner
      FOREIGN KEY(winner) 
        REFERENCES team(id),
	CONSTRAINT fk_team1
      FOREIGN KEY(team1) 
        REFERENCES team(id),
	CONSTRAINT fk_team2
      FOREIGN KEY(team2) 
        REFERENCES team(id)
);
CREATE UNIQUE INDEX idx_game ON game(name, winner, team1, team2);


create table if not exists act(
	id serial PRIMARY KEY,
	player_id int not null,
	defender_id int null,
	act_type text not null CHECK (act_type IN ('assist', 'steal', 'turnover','rebound','twoPtMiss','threePtMiss','twoPtMake','threePtMake','block')),
	date date,
	game_id int not null,
	team_id int not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
	CONSTRAINT fk_team_id
      FOREIGN KEY(team_id) 
        REFERENCES team(id),
	CONSTRAINT fk_game_id
      FOREIGN KEY(game_id) 
        REFERENCES game(id)
);
