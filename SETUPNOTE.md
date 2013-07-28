# Setup Note
- Heroku

## Heroku

Assuming you have installed heroku toolbelt from [link]

### Creating an Heroku App
In the directory of local git repository, webapp-protos/, for example, create a new heroku app named 'webapp-protos'
<code>
$ heroku apps:create webapp-protos
</code>

Check the remote repos:
<code>
$ git remote -v

heroku git@heroku.com:webapp-protos.git (fetch)
heroku  git@heroku.com:webapp-protos.git (push)
origin  https://github.com/simonkim/webapp-protos.git (fetch)
origin  https://github.com/simonkim/webapp-protos.git (push)
</code>

### Add Postgres SQL addon (heroku-postgresql:dev)
First, add the Postgres SQL addon,
<code>
$ heroku addons:add heroku-postgresql:dev
</code>
Then, promote the DB to the Default DB connection: DATABASE_URL
<code>
$ heroku pg:promote HEROKU_POSTGRESQL_IVORY_URL
</code>

Check the current Postgres SQL addon information,
<code>
$ heroku pg:info

=== HEROKU_POSTGRESQL_IVORY_URL (DATABASE_URL)
    Plan:        Dev
    Status:      available
    Connections: 1
    PG Version:  9.2.4
    Created:     2013-07-27 23:41 UTC
    Data Size:   6.3 MB
    Tables:      0
    Rows:        0/10000 (In compliance)
    Fork/Follow: Unsupported
</code>
And configuration,
<code>
$ heroku config
=== webapp-protos Config Vars
DATABASE_URL:                postgres://xxUSERExx:yyPASSxx@dbserver.domain.com:5432/zzDBNAMEzz
HEROKU_POSTGRESQL_<COLOR>_URL: postgres://xxUSERExx:yyPASSxx@dbserver.domain.com:5432/zzDBNAMEzz
</code>
See that DATABASE_URL environment variable is pointing to the same DB connection config pointed by HEROKU_POSTGRESQL_<COLOR>_URL that has just been added to this heroku app.
