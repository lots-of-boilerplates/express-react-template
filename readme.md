# Getting Started

- Run `npm run install-all` to install all dependencies for both the server and react app.
- Run `npm run dev` to start up the typescript compiler watcher, the server listener, and the react application.

# Deploying to Heroku

- Download the Heroku CLI.
- Run `heroku login` to login to your Heroku account.
- Run `heroku create` to create a new Heroku Project. This will also set the `heroku` git remote for you.
- Run `heroku config:set PGSSLMODE=no-verify`
- Run `heroku addons:create heroku-postgresql`
- Run `heroku addons:create papertrail`
- Run `heroku addons:create heroku-redis`
- Run `git push heroku main` to deploy the code to Heroku. Heroku will install all dependencies, build the React application, build the server, and then your server will serve the React application as a static HTML page.


# Notes

- For dev env, rename client/.proxyrc.dev to client/.proxyrc