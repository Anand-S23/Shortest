# Shortest

Url shortener made with React and Node.js, which allows users to truncate urls and view visit metrics

## Technologies Used

- NodeJS/Express (Backend)
- React (Frontend)
- PostgreSQL (Database)
- Redis Cache (Rate-Limiting)
- Zod (Input Validation)
- Typescript

## Quick Start

Shorest uses docker for easy development, docker and docker-compose are pre-requistes. The following has to be done to get up and running:

1. Create a `.env` file using example.env as an example
2. Run `docker-compose build`
3. Run `docker-compose up`

Since there is a init.sql this should automatically create the required table for PostgreSQL, do the following if db service fails to create the table:

1. Run `docker ps` after the containers are up, in order to list all continers
2. Run `docker exec -it [ID] psql -U postgres`, where [ID] is the id of the shortest_db postgres conainter
3. To create the table itself copy and paste everything in init.sql 

Note: For step to -U flag specifies the user so if you changed the user in .env file put the same username here

Following these steps will get you up and running with Shorest!

## Possible Future Feature:

Implementing user authentication system which would allow users to login in and manage their entiries.

