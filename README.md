# microservices-dashboard
[![Gitter](https://badges.gitter.im/ordina-jworks/microservices-dashboard.svg)](https://gitter.im/ordina-jworks/microservices-dashboard?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[ ![Codeship Status for ordina-jworks/microservices-dashboard](https://codeship.com/projects/89e46fa0-1b60-0134-de15-0e8ad2af7d49/status?branch=master)](https://codeship.com/projects/159640)
[![][license img]][license]

## Overview

The primary goal of this project is to visualize links between microservices and the encompassing ecosystem.
This AngularJS application consumes endpoints exposed by [microservices-dashboard-server](https://github.com/ordina-jworks/microservices-dashboard-server).
It displays four columns: UI, Resources, Microservices and Backends.
Each of these columns show nodes and links between them.
Currently only resources, microservices and backends are supported, although the UI-part is almost complete.
The information for these links come from Spring Boot Actuator health endpoints and hypermedia indexes, which are aggregated in the [microservices-dashboard-server](https://github.com/ordina-jworks/microservices-dashboard-server) project.

## Setting up the dashboard

There are two ways of getting up and running with the microservices-dashboard.
Either by running a sample, or by creating your own instance of the dashboard.

The samples can be found in the [microservices-dashboard-server repository](https://github.com/ordina-jworks/microservices-dashboard-server/tree/master/samples).

The microservices-dashboard consists of two components: the UI and the server.
This repository contains the UI while the server is located under the [microservices-dashboard-server](https://github.com/ordina-jworks/microservices-dashboard-server) repository.
These two components can either be packaged and deployed together as a single Spring Boot application (as explained in the [microservices-dashboard-server README](https://github.com/ordina-jworks/microservices-dashboard-server#using-a-vanilla-spring-boot-application)), or separately as a NodeJS application and a Spring Boot application.
In case of the former, the UI is served from the embedded Tomcat inside the Spring Boot application.
In case of the latter, the UI is ran separately on a NodeJS server, while the Spring Boot application simply exposes the JSON API.

## Building the UI from source

First a basic build should be done:
```
npm install
```
Then bower dependencies should be installed:
```
bower install
```

## Running the UI

Use gulp to serve the resources using the configuration file:
```
gulp serve:conf
```

Note:

The server needs to be started to get any data in the dashboard: [microservices-dashboard-server](https://github.com/ordina-jworks/microservices-dashboard-server)

## Screenshots

<img width="1440" alt="screen shot 2016-04-07 at 10 56 44" src="https://cloud.githubusercontent.com/assets/6663110/14345954/11db9980-fcb0-11e5-963f-38bca041e5bb.png">

<img width="1440" alt="screen shot 2016-04-07 at 11 02 41" src="https://cloud.githubusercontent.com/assets/6663110/14345993/4fa2383c-fcb0-11e5-832d-10cbe2bdc2d6.png">

<img width="1440" alt="screen shot 2016-04-07 at 10 58 25" src="https://cloud.githubusercontent.com/assets/6663110/14345957/1496601a-fcb0-11e5-812b-b1abac778d79.png">

<img width="1440" alt="screen shot 2016-04-07 at 11 00 03" src="https://cloud.githubusercontent.com/assets/6663110/14345958/16809878-fcb0-11e5-8045-d4b6ff4b920a.png">

<img width="1440" alt="screen shot 2016-04-07 at 11 00 22" src="https://cloud.githubusercontent.com/assets/6663110/14345960/19004c10-fcb0-11e5-80dd-dd4e1eab25ab.png">

## TODO

- Single run instances gulp build
- Cleanup gulp files
- Serve directly from src, not .tmp
- Remove unused tasks
- Add bump tasks

[license]:LICENSE-2.0.txt
[license img]:https://img.shields.io/badge/License-Apache%202-blue.svg
