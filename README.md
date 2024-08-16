# OpenAGI

DIY AI landscape growing safely in the privacy of your own computer

## Assemble your crew

![assembling your crew](frontend/prepare_actors.gif)

## Intuitive relationships

Understand implied relationships from visual borders on different zoom levels.

![intuitive relationships](frontend/border_relations.png)

Border can imply storage ➡️ processing ➡️ output, or other relationships that make sense in the context.

## Getting started

### Prerequisites

Sign up for a free [Supabase](https://supabase.com/dashboard/new?plan=free) account, to get your free PostgreSQL database where all your work will be safely stored.

Use it to set up the variables in `.env.template` file and save it under `.env` name next to it when you're done.

Avatar photos and other files can be put into a bucket next to the database on Supabase.

### Start

To boot up the system run `./start.sh` and open http://localhost:5173 in your browser.

### Housekeeping

To clean up and start fresh, you can remove all in flight jobs with `./reset.sh`. This will erase all temporary data in flight

Important data will not be lost when you run the reset, because it is written in PostgreSQL database which does not get reset.

## Under the hood

If you wish to have a closer look at the threads of the server, you can use the command `pm2 monit` to see what individual job handler worker threads are up to.
