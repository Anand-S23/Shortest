CREATE TABLE IF NOT EXISTS shortest (
    id SERIAL PRIMARY KEY,
    long_url VARCHAR(255),
    short_hash VARCHAR(255),
    visit_count INTEGER
);
