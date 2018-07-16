# Level 2 Node.js Recruitment Task

## Getting started

### Prerequisite

- Install [Node.js](https://nodejs.org/) (^8.9.4)

### Install the server

Install the server node.js dependencies:

```
$ npm install
```

### Config db
You should change config.dev.json file, section "database", I use MySql, but Postgres can also be used

### Create db and fill it with predefined values

```
$ npm run create
$ npm run sync
$ npm run fill
```
### Run the app

```
$ npm start
```

Open your browser on <http://localhost:3000>

### Generate swagger file
```
npm run doc_generate
```
it will generate swagger.yml

### Mail settings
Mail settings can be changed in config.dev.json, section "mail", this section is parameter for nodemailer.createTransport function