# glossary-api

How to use:

Clone

`git clone git@github.com:Zukauskas/glossary-api.git`

Install

`npm i`
or
`npm install`

Run

`npm start`

Endpoints:

POST `/api/word`

- Add new word to glosarry. Send in body:`{word, definition}`.

GET `/api/glossary`

- Get all the words existing in the glossary.

GET `/api/glossary/:id`

- Get word by the ID

Reachable at: `http://localhost:3000/`
