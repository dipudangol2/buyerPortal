CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    TEXT          NOT NULL,          
  role        VARCHAR(20)   NOT NULL DEFAULT 'buyer',
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);


CREATE TABLE properties (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  location    VARCHAR(255)  NOT NULL,
  price       INTEGER       NOT NULL,
  bedrooms    SMALLINT      NOT NULL,
  image_url   TEXT,
  description TEXT
);


CREATE TABLE favourites (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)    
);