# CPP Connect

This repository contains the code for the Department of Computing's Coporate Partnership Programme (CPP) Connect platform. CPP Connect is a platform that allows students to connect with companies and find internships, placements and graduate roles.

The platform is built on:

- [Next.js](https://nextjs.org/) - a React framework for building server-rendered applications
- [TypeScript](https://www.typescriptlang.org) - a statically typed superset of JavaScript
- [PostgreSQL](https://www.postgresql.org) - a powerful, open source object-relational database system
- [Prisma ORM](https://www.prisma.io) - a modern database toolkit that makes it easy to work with databases in TypeScript.
- [Docker](https://www.docker.com) - a platform for developing, shipping, and running applications in containers. This repo include a Dockerfile you can use to build a container image for deployment to ImPaaS or another platform, and a docker compose file for development

If you haven’t already, read the [React Quick Start tutorial](https://react.dev/learn) so that you understand the key concepts of React, which you’ll need to develop using this app.

# Setup

For ease of use, we recommend developing on Linux, macOS or Windows Subsystem for Linux (WSL).

## Install Node.js & Docker

Install Node.js from the [Node.js website](https://nodejs.org).

Install Docker from the [Docker website](https://www.docker.com/products/docker-desktop). (note: if you're on WSL, install Docker Desktop for Windows instead of installing docker directly inside of linux)

## Install Packages with NPM

Run this command to install all the necessary packages:

```bash
npm install
npm run db:generate # generate prisma client
```

# Development Guide

## Getting Started

To get started, make a copy of `.env.template` as `.env.local` and fill it in as required (the comment give more info)

### Notes on certain environment variables

### Required steps for uploads

TODO

## Running with Docker

We've included a `dev.docker-compose.yml` files, which contains everything (including a database) you need to get started:

```bash
docker compose -f dev.docker-compose.yml up
docker exec $(docker ps -qf "name=cpp-connect-app" | head -n1) npm run db:migrate-dev
```

If all goes well, the app should now be available at `http://localhost:3000`

## Running without Docker

1. Start a PostgreSQL database (e.g. using Docker)
2. Update the `DATABASE_URL` environment variable in the `.env` file to point to your database
3. Run the following commands to start the app:

```bash
npm run db:migrate-dev
npm run dev
```

## Building

Run `npm run build` to build the app for production.

You can also build a docker image:

```bash
docker build -t imperial/cpp-connect .
```

# CI Setup

TODO

## Authentication - Azure SSO

Refer to [this guide](https://next-auth.js.org/providers/azure-ad) for more info.

Sign up to Azure with your Imperial Microsoft single sign-on. Make sure to do this through the [student sign up page](https://azure.microsoft.com/en-gb/free/students/).

In the Azure portal, head to the [Entra ID page](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade). Under the overview, click “Add”, then click “App registration”.

Fill in the name of your app and select your desired supported account types. If in doubt, select “Accounts in this organizational directory only”.

For the redirect URI, select the “Web” platform, and enter [`http://localhost:3000/api/auth/callback/azure-ad`](http://localhost:3000/api/auth/callback/azure-ad) as the address.

Confirm the details and you will be redirected to your app’s Active Directory page which contains some IDs.

In your project’s `.env` file, set:

- `AZURE_AD_CLIENT_ID` to the “Application (client) ID”
- `AZURE_AD_TENANT_ID` to the “Directory (tenant) ID”

From the app’s Active Directory page, navigate to “Certificates & secrets”, then click on “New client secret”. Enter any description and leave the expiration as 6 months (Note: this means you will have to generate a new client secret in 6 months’ time). Click “Add”.

Copy the value from the secret into the `AZURE_AD_CLIENT_SECRET` row in the `.env` file.

# Deployment Guide

## Setting Up ImPaaS

Install ImPaaS as described [here](https://github.com/impaas/docs/blob/main/config/USAGE.md#installing-impaas):

```bash
curl -fsSL "https://tsuru.io/get" | bash
echo "alias impaas='tsuru'" >> ~/.bashrc
source ~/.bashrc
```

Login to ImPaas:

```bash
impaas login
```

Create a new team:

```bash
impaas team create <TEAM_NAME>
```

Add members to the team as required:

```bash
impaas role-assign team-member <EMAIL_ADDRESS> <TEAM_NAME>
```

Create a new app (make <APP_NAME> something suitable like `cpp-connect`):

```bash
impaas app create <APP_NAME> --team <TEAM_NAME>
```

> [!NOTE]
> See information about your app by running `impaas app info -a <APP_NAME>` to confirm that it was successfully created

## Adding a Volume

CPP Connect allows file uploads, and these are by default saved to `upload/`. In production, you should use a impaas volume for persistent file storage. A volume must be mounted at a certain directory. To create a volume:

> [!NOTE]
> You will likely want a higher capacity than 512MiB

```bash
impaas volume create <VOLUME_NAME> azurefile \
  --team <TEAM_NAME> \
  --opt capacity=512Mi \
  --opt access-modes=ReadWriteMany \
  --pool local
```

Now bind your volume to the app, specifying the `MOUNT_POINT_NAME` (directory to store files - we recommend using `uploads`)

```bash
impaas volume bind <VOLUME_NAME> /<MOUNT_POINT_NAME> --app <APP_NAME>
```

Finally, set the `UPLOAD_DIR` environment variable to the mount point:

```bash
impaas env set UPLOAD_DIR=/<MOUNT_POINT_NAME> --app <APP_NAME>
```

## Adding a Database

TODO: Switch to Postgres

Create a MySQL instance for your team, specifying `DB_NAME` (the name of the MySQL instance):

```bash
impaas service instance add mysql <DB_NAME> --team <TEAM_NAME>
```

> [!NOTE]
> To check the instance was made: `impaas service instance info mysql <DB_NAME>`

Bind the MySQL instance to the app.

```bash
impaas service instance bind mysql <DB_NAME> --app <APP_NAME>
```

The environment variables relating to MySQL do not have to be changed as this is handled by ImPaaS automatically.

## Adding SSO Authentication

Follow the instructions in the development guide above to add SSO Authentication.

Add an additional redirectURI in the Azure portal with platform “Web” and address `https://<APP_NAME>.impaas.uk/api/auth/callback/azure-ad`.

## Deploying

Deploy the app on ImPaaS using:

```bash
impaas app deploy \
  --app <APP_NAME> \
  --dockerfile Dockerfile
```

If you encounter a `Request Entity Too Large` error when deploying the app, ensure the `.tsuruignore` includes your development volumes directory (`/<MOUNT_POINT_NAME>`) as this should not be included in deployment.

To view logs for the deployed app, run the following:

> [!NOTE]
> See logs for your deployed app: `impaas app log -a <APP_NAME> -l 100 --follow`

</aside>

# Misc.

## Formatting

To format all TypeScript source code files in the repo using prettier, run:

```bash
npm run format
```

## Project structure

### Directories

- `app/` - Next.js app router (different from the older page router) - see [https://nextjs.org/docs/app](https://nextjs.org/docs/app). Put layouts, pages & API routes here
- `components/` - components used by pages & layouts
- `lib/` - Other TypeScript logic code e.g. next.js server actions, types, database logic
- `public/` - Next.js directory for static files

## Notable files in the root

- `Dockerfile` - docker file to build a container image for deployment to ImPaaS
- `.env.template` - copy to `.env.local` to specify environment variables for the app in development
- `.gitignore` - stop large files being committed to the git repo such as `node_modules` or `UPLOAD_DIR`
- `.tsuruignore` - stop large files being uploaded to ImPaaS due to file size restrictions
- `.prettierrc` - config for code formatter
