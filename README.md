# ImPaaS Deployment Template App

This is a simple Next.JS todo app using React and TypeScript, demonstrating how to deploy a simple single-sign-on (SSO) application to Imperial’s ImPaaS platform, with a MySQL database and file volumes.

If you haven’t already, read the [React Quick Start tutorial](https://react.dev/learn) so that you understand the key concepts of React, which you’ll need to develop on this app.

Read more about Next.js [here](https://nextjs.org/) as well.

Read more about TypeScript [here](https://www.typescriptlang.org).

Once you understand these things, you can make a start on deploying the app.

# Setup

For ease of use, we recommend developing on Linux, macOS or Windows Subsystem for Linux (WSL).

## Install Node.js

Install Node.js from the [Node.js website](https://nodejs.org).

## Install Packages with NPM

Run this command to install all the necessary packages:

```bash
npm install
```

# Development Guide

## Set up MySQL locally (Development Database)

For development, the template app uses a MySQL database, which you will need to create an instance of. The easiest way to do so is with Docker.

First, install Docker. We recommend installing [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Then, start an instance of a MySQL database using a Docker image as follows, replacing `mysql` with the name of the database (this can be anything) and  `pass` with a chosen password. Make sure to note both of these down for later. This command will pull the MySQL Docker image and start the container.

**Note:** `—-publish` exposes port 3306 locally (the default MySQL port) as port 3306 on the container.

```bash
docker run --name some-mysql \
	--env MYSQL_ROOT_PASSWORD=pass \
	--env MYSQL_DATABASE=mysql \
	--env MYSQL_USER=user \
	--env MYSQL_PASSWORD=pass \
	--publish 3306:3306 \
	--detach mysql:latest
```

Make a copy of `.env.template` as `.env` and fill in these variables, where `pass` and `mysql` are the password and name chosen above.

```xml
...
MYSQL_DATABASE_NAME=mysql
MYSQL_HOST=localhost
MYSQL_PASSWORD=pass
MYSQL_PORT=3306
MYSQL_USER=user
...
```

## Volumes

A volume is used for persistent file storage in your deployed app. A volume must be mounted at a certain directory. We suggest `./uploads` in development. Make this folder:

```bash
mkdir uploads
```

Update the `.env.local` file accordingly:

```
...
UPLOAD_DIR=./uploads
...
```

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

## Running Locally

Assuming you’ve, make a copy of `.env.template` as `.env`  and filled it in as required, you can start the app as follows:

```bash
npm run dev
```

If all goes well, the app should now be available at `http://localhost:3000`

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

Create a new app:

```bash
impaas app create <APP_NAME> --team <TEAM_NAME>
```

>[!NOTE]
> See information about your app by running `impaas app info -a <APP_NAME>` to confirm that it was successfully created

## Adding a Volume

As described above, a volume is used for persistent file storage in your deployed app. A volume must be mounted at a certain directory. To create a volume:

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

Create a MySQL instance for your team, specifying `DB_NAME` (the name of the MySQL instance):

```bash
impaas service instance add mysql <DB_NAME> --team <TEAM_NAME>
```

>[!NOTE]
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

>[!NOTE]
> See logs for your deployed app:  `impaas app log -a <APP_NAME> -l 100 --follow`

</aside>

# Misc.

## Formatting

To format all TypeScript source code files in the repo using prettier, run:

```bash
npm run format
```

## Project structure

### Directories

- `app/`  - Next.js app router (different from the older page router) - see [https://nextjs.org/docs/app](https://nextjs.org/docs/app). Put layouts, pages & API routes here
- `components/` - components used by pages & layouts
- `lib/` - Other TypeScript logic code e.g. next.js server actions, types, database logic
- `public/` - Next.js directory for static files

## Notable files in the root

- `Dockerfile` - docker file to build a container image for deployment to ImPaaS
- `.env.template` - copy to `.env.local` to specify environment variables for the app in development
- `.gitignore` - stop large files being committed to the git repo such as `node_modules` or `UPLOAD_DIR`
- `.tsuruignore` - stop large files being uploaded to ImPaaS due to file size restrictions
- `.prettierrc` - config for code formatter