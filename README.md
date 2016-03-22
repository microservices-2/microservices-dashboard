# microservices-dashboard-server

## Overview

The primary goal of this project is to visualize links between microservices and the encompassing ecosystem.
This AngularJS application consumes endpoints exposed by [microservices-dashboard-server](https://github.com/ordina-jworks/microservices-dashboard-server).
It displays four columns: UI, Endpoints, Microservices and Backends.
Each of these columns show nodes and links between them.
Currently only microservices and backends are supported.
The information for these links come from Spring Boot Actuator health endpoints, which are aggregated in the [microservices-dashboard-server](https://github.com/ordina-jworks/microservices-dashboard-server) project.

## Building from source

First a basic build should be done:
```
npm install
```
Then bower dependencies should be installed:
```
bower install
```
And finally using gulp to serve the resources:
```
gulp serve
```

## TODO

- Single run instances gulp build
- Cleanup gulp files
- Serve directly from src, not .tmp
- Remove unused tasks
- Add bump tasks
