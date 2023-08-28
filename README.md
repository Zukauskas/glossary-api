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

-   Add new word to glossary. Send in body:`{word, definition}`.

GET `/api/glossary`

-   Get all the words existing in the glossary.

GET `/api/glossary/:id`

-   Get word by the ID.

GET `/api/glossary-page`

-   Get word list of default size from first page.

GET `/api/glossary-page/:page`

-   Get word list of default size from selected page.

GET `/api/glossary-page/:page/:pageSize`

-   Get word list of select size and from selected page.

Default variables are set in `.env` file, see `env.example` for an example or rename it to `.env` and use it.

Reachable at: `http://localhost:3003/`
