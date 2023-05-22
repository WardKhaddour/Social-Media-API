# Topic Nexus API

Topic Nexus API built using Node.js, Express.js, MongoDB

## Install the dependencies

```bash
npm install
```

## Import dummy data into database

You need to execute the import-dev-data script in dev-data with import flag

```bash
npx ts-node dev-data/import-dev-data.ts --import
```

## Delete all data from database

You need to execute the import-dev-data script in dev-data with delete flag

```bash
npx ts-node dev-data/import-dev-data.ts --delete
```

## Run in development mode

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Run in production mode

```bash
npm start
```

## How to run locally

Install the dependencies and add required environment variables as described in .env.example file.
