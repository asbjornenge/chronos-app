# Chronos App

A flexible task runner designed for [docker](https://www.docker.com/) based cloud environments.

In Chronos you can add tasks to run at specific times defined in [cron](https://en.wikipedia.org/wiki/Cron) syntax. Each task can have multiple steps. Steps are executed in order and `stdout` and `stderr` are stored for each execution. 

Chronos is split into two components; an [app](https://github.com/asbjornenge/chronos-app) (this repo) and an [api](https://github.com/asbjornenge/chronos-api).

You need to run both to have an operational application. For instruction on how to run the API service, check out the api repo :point-up:. 

![Screenshot-1](https://raw.githubusercontent.com/asbjornenge/chronos-app/master/screenshots/Chronos-1.png)

## Run

```
docker run -p 8080:8080 -it asbjornenge/chronos-app:latest 
```

## Use

### Tasks

Setting up tasks are fairly staightforward. Give the task a `name` and set a `cron` for it to run.

You need to `unpause` the tasks before it is sceduled to run. You do that by clicking the top right icon from task details (click the task to get there). 

### Steps

Steps are require a bit more input:

```
Name    : Name of the step
Command : Command to run
Order   : Order of execution (steps are executed in order when task runs)
Timeout : Specify a timeout for the task in ms (task is killed if this timeout is surpassed)
```

Example:

```
Name    : Dump database
Command : docker -H tcp://docker.host:4243 run --rm -v /var/lib/docker/data/backup:/backup postgres:9.6 pg_dump -h postgres -U postgres demo -f /backup/demo.sql
Order   : 1
Timeout : 10000
```

**NB!** Steps are executed in the `api` container. It's `alpine` based and contains very few tools. However, it does contain the `docker` cli. Which means you can run most anything :rocket: It does not however contain a docker daemon, so be sure to specify `-H tcp://docker-host:port` for the actual execution to take place :+1:

Other relevant steps to add to the example above could be;

* Upload to S3
* Cleanup

enjoy. 
