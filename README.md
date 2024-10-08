# CPP Connect

This repository contains the code for Imperial's Department of Computing's Coporate Partnership Programme (CPP) Connect platform. CPP Connect is a platform that allows students to connect with companies and find internships, placements and graduate roles.

The platform is built on:

- [Next.js](https://nextjs.org/) - a React framework for building server-rendered applications
- [TypeScript](https://www.typescriptlang.org) - a statically typed superset of JavaScript
- [SCSS](https://sass-lang.com) - a CSS preprocessor that adds power and elegance to the basic language. We also CSS modules with SCSS (see: any files ending in `.module.scss`)
- [React Email](https://react.email/) - a library for building responsive HTML emails using React
- [PostgreSQL](https://www.postgresql.org) - a powerful, open source object-relational database system
- [Prisma ORM](https://www.prisma.io) - a modern database toolkit that makes it easy to work with databases in TypeScript.
- [Docker](https://www.docker.com) - a platform for developing, shipping, and running applications in containers. This repo include a Dockerfile you can use to build a container image for deployment to ImPaaS or another platform, and a docker compose file for development

The application allows students to sign-in using Microsoft Single Sign On, denying them permission if they are not in Computing.

Companies can sign-in using magic links sent to their email using SMTP.

Admins are set using the `CPP_ALLOWED_ADMINS` environment variable, which is a comma-separated list of email addresses. Note that if this is changed, the users in questions will need to log out and log back in again to see the changes.

If you haven’t already, read the [React Quick Start tutorial](https://react.dev/learn) so that you understand the key concepts of React, as well as the [Next.js documentation](https://nextjs.org/docs) to understand how Next.js works.

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

To get started, make a copy of `.env.template` as `.env.local` and fill it in as required (the comments give more info)

### Notes on certain environment variables

#### `MS_ENTRA_CLIENT_ID`, `MS_ENTRA_CLIENT_SECRET` and `MS_ENTRA_TENANT_ID`

> [!NOTE]
> For this, you will need to setup SSO with Microsoft Entra ID - steps below
>
> Refer to [this page](https://authjs.dev/reference/core/providers/microsoft-entra-id#setup) for more info about what's going on under the hood.

Login to the [Entra Admin Center](https://entra.microsoft.com/#home).

In the Entra Admin Center, head to the [App Registrations page](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceType/Microsoft_AAD_IAM) (Applications > App registrations in the sidebar). In the toolbar at the top, select “New registration”.

Fill in the name of your app and select your desired supported account types. If in doubt, select “Accounts in this organizational directory only”.

For the redirect URI, select the “Web” platform, and enter [`http://localhost:3000/api/auth/callback/microsoft-entra-id`](http://localhost:3000/api/auth/callback/microsoft-entra-id) as the address.

Confirm the details and you will be redirected to your app’s Entra ID App Registration page which contains some IDs.

In the `.env.local` file, set:

- `MS_ENTRA_CLIENT_ID` to the “Application (client) ID”
- `MS_ENTRA_TENANT_ID` to the “Directory (tenant) ID”

From the app’s Entra ID App Registration, navigate to “Certificates & secrets”, then click on “New client secret”. Enter any description and leave the expiration as 6 months (Note: this means you will have to generate a new client secret in 6 months’ time). Click “Add”.

Copy the value from the secret into the `MS_ENTRA_CLIENT_SECRET` row in the `.env.local` file.

#### `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PASSWORD`, `EMAIL_SERVER_PORT`, and `EMAIL_SERVER_USER`

These variables are for Nodemailer and sending emails with magic links to company users. Using the APP registration from the previous step, follow this tutorial: [`https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email-smtp/smtp-authentication`](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/send-email-smtp/smtp-authentication). You will likely need to follow the prerequisites (on the Microsoft tutorial) as well.

After each of these steps is complete, you should have the following resources on Azure:
1. An Email Communication Service
2. A Communication Service
3. An Email Communication Service Domain

Fill in .env.local with the following environment variable values:
Set the EMAIL_SERVER_HOST value to
```<Azure Communication Services Resource name>.<Entra Application ID>.<Entra Tenant ID>```
(See the tutorial above for more details)
Set the Email_SERVER_PASSWORD to your App Registration's client secret value
Set the EMAIL_SERVER_PORT to 587
Set the EMAIL_SERVER_USER to your Email Communication Service Domain email address

Ensure that NEXTAUTH_URL is set to the value "http://localhost:3000" in the .env.local file. Note "http" (not "https") is critical here, since this url is what the user will be redirected to after authentication with Entra ID. Since the development app can't have a TLS certificate, if the protocol is https, the user will be redirected to an invalid url after authenticating. Additionally, Entra ID will error since it is expecting a redirect url beginning with "http."

### Required steps for uploads

The application expects certain directories to be present in `UPLOAD_DIR` (by default, `UPLOAD_DIR` is `./uploads`).

In development, run these commands to create the required directories (assuming `UPLOAD_DIR` is `./uploads`):

```bash
export UPLOAD_DIR=./uploads
mkdir $UPLOAD_DIR
mkdir $UPLOAD_DIR/banners $UPLOAD_DIR/cvs $UPLOAD_DIR/avatars $UPLOAD_DIR/logos
```

## Running with Docker

We've included a `dev.docker-compose.yml` files, which contains everything (including a database) you need to get started:

```bash
docker compose -f dev.docker-compose.yml up
docker exec $(docker ps -qf "name=cpp-connect-app" | head -n1) npm run db:migrate-dev
docker exec $(docker ps -qf "name=cpp-connect-app" | head -n1) npm run db:seed
```

If all goes well, the app should now be available at `http://localhost:3000`

## Running without Docker

1. Start a PostgreSQL database (e.g. using Docker)
2. Update the `DATABASE_URL` environment variable in the `.env.local` file to point to your database
3. Make sure you've followed all the others steps in the "Getting Started" section, including about uploads
4. Run the following commands to start the app:

```bash
npm run db:migrate-dev
npm run db:seed
npm run dev
```

## Building

Run `npm run build` to build the app for production.

You can also build a docker image:

```bash
docker build -t imperial/cpp-connect .
```

## Misc. Dev Notes

### Hot reload

The application will hot reload when you make changes to the code for everything **except** the database schema (prisma client).

If you make changes to the database schema, you will need to run `npm run db:generate` to regenerate the prisma client, and then restart the server for changes to take effect. Note that when generating migrations the client is generally regenerated for you.

### Formatting

To format all TypeScript source code files in the repo using prettier, run:

```bash
npm run format
```

### Linting

To lint all TypeScript source code files in the repo using eslint, run:

```bash
npm run lint
```

### Commit linting

The application is setup to run commit linting on every commit. This is to ensure that all commits are in the correct format, and will also auto-format files for you. The commit message should be in the format, in lowercase:

```
<type>: <subject>
```

Where `<type>` is one of the following:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes to CSS/SCSS
- `refactor`: Refactors
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `perf`: A code change that improves performance
- `revert`: Reverts a previous commit
- `test`: Anything involving tests
- `wip`: Work in progress

### Changing email templates

Email templates are stored in `emails/`. To see changes to email templates in the browser when you are working on them, run:

```bash
npm run dev:email
```

## Help! I changed the database schema/seed file and need to start/seed the DB from fresh

> [!CAUTION]
> The below will delete all data in the database!
> Never run this in production!

Use `npm run db:reset`: this will clear the database, re-run the migrations and re-seed the database.

This is especially useful if you've changed the database seed data and need to re-seed the database - for the schema, you should use migrations instead.

### Project structure

#### Directories

- `app/` - Next.js app router (different from the older page router) - see [https://nextjs.org/docs/app](https://nextjs.org/docs/app). Put layouts, pages & API routes here
- `components/` - Components used by pages & layouts
- `emails/` - Email templates. Run `npm run dev:email` to see changes in the browser when editing them.
- `lib/` - Other TypeScript logic code
  - `crud/` - Database CRUD operations
  - `files/` - File handling logic for uploaded files
  - `util/` - Utility functions
- `prisma/` - prisma schema, migrations and seed data
- `public/` - Next.js directory for static files
- `styling/` - Glboal styles and SCSS variables (most styling is done using (S)CSS modules)

### Notable files in the root

- `Dockerfile` - docker file to build a container image for deployment to ImPaaS or another platform
- `.env.template` - copy to `.env.local` to specify environment variables for the app in development
- `.gitignore` - stop large files being committed to the git repo such as `node_modules` or `UPLOAD_DIR`
- `.tsuruignore` - stop large files being uploaded to ImPaaS due to file size restrictions
- `.prettierrc` - config for code formatter

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

CPP Connect allows file uploads, and these are by default saved to `upload/`. In production, you should use an impaas volume for persistent file storage. A volume must be mounted at a certain directory. To create a volume:

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

Add a PostgreSQL database to the app using impaas.

> [!NOTE]
> We'd put steps for this here, but we haven't tried this ourselves yet!

## Adding SSO Authentication

Follow the instructions in the development guide above to add SSO Authentication.

Add an additional redirectURI in the Azure portal with platform “Web” and address `https://<APP_NAME>.impaas.uk/api/auth/callback/microsoft-entra-id`.

Additionally, you might need to check [https://authjs.dev/getting-started/deployment](https://authjs.dev/getting-started/deployment) if you are having issues with our chosen auth library.

## Setting Environment Variables on Impaas

There are some environment variables that need to be set in order for the app to deploy properly (and function.)

Impaas manages envirnment variables through two commands.

To see what environment variables are currently set, run:
```bash
impaas env get -a cpp-connect
```

To set an environment variable for the cpp-connect app, run:
```bash
impaas env set -a cpp-connect VAR1=value1 VAR2=value2 ...
```

Environment variables set in this way are automatically included in any container deployed under the cpp-connect app.

The following variables are required for the app to function properly:
1. **AUTH_SECRET** (Same as in dev)
2. **AUTH_TRUST_HOST** (Same as in dev)
3. **DATABASE_URL** 
4. **EMAIL_FROM** (Same as in dev)
5. **EMAIL_SERVER_HOST** (Same as in dev)
6. **EMAIL_SERVER_PASSWORD** (Same as in dev)
7. **EMAIL_SERVER_PORT** (Same as in dev)
8. **EMAIL_SERVER_USER** (Same as in dev)
9. **MS_ENTRA_CLIENT_ID** (Same as in dev)
10. **MS_ENTRA_CLIENT_SECRET** (Same as in dev)
11. **MS_ENTRA_TENANT_ID** (Same as in dev)
12. **NEXTAUTH_URL**

To get the DATABASE_URL, run the following command:
```bash
impaas app run "echo postgres://\$PGUSER:\$PGPASSWORD@\$PGHOST:\$PGPORT/\$PGDATABASE" -a cpp-connect
```

Then, with the output, run:
```bash
impaas env set -a cpp-connect DATABASE_URL={OUTPUT FROM PREVIOUS COMMAND}
```

NEXTAUTH_URL should simply be "https://cpp-connect.impaas.uk/" or whatever the url of the deployed Impaas app is.

Note: variables such as $PGUSER, $PGPASSWORD, $TSURU_APPDIR, etc. are set by Impaas automatically (assuming the database has been set correctly in the previous steps)

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

# CI/CD

The repo has GitHub Actions setup. On push to `main` or any branch with a PR to `main`, the following happens:

1. The action calculates which files have been changed.
2. Dependencies are installed on the runner (for use in later steps.)
2. A type check, style check, and format checks runs.
4. If the "event" is a merge into main, then the image is built, pushed to the registry, and then deployed to ImPaaS.
5. If the database scheme has changed (i.e. the prisma/ folder has changed,) then run migrations on the ImPaaS Postgres DB.

On push to main, the built docker image is uploaded to the GitHub Container Registry under the name `ghcr.io/imperial/cpp-connect`

## GitHub Secrets

There are two secrets which need to be set manually. The first is the IMPAAS_DEPLOY_TOKEN, which allows the pipeline to authenticate with Impaas. This needs to be obtained from Impaas, but requires elevated permissions. If this needs to be set or changed, speak to someone who has these elevated permissions on Impaas.

The second is the DATABASE_URL, which allows the workflow to run migrations from the runner. This should be set to the exact same value as the DATABASE_URL Impaas environment variable.