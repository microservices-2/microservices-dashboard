# microservices-dashboard

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
And finally using gulp to serve the resources using the configuration file:
```
gulp serve:conf
```

## Screenshots

<img width="1439" alt="screen shot 2016-04-02 at 13 40 57" src="https://cloud.githubusercontent.com/assets/6663110/14226110/c44d6534-f8d8-11e5-94c1-45589b4d7e3e.png">

<img width="1440" alt="screen shot 2016-04-02 at 13 43 51" src="https://cloud.githubusercontent.com/assets/6663110/14226115/2577e73a-f8d9-11e5-8011-649418ad693b.png">

<img width="1440" alt="screen shot 2016-04-02 at 13 44 27" src="https://cloud.githubusercontent.com/assets/6663110/14226116/28714bac-f8d9-11e5-911b-00d4e4823f58.png">

<img width="1440" alt="screen shot 2016-04-02 at 13 44 52" src="https://cloud.githubusercontent.com/assets/6663110/14226117/29f80d08-f8d9-11e5-8d07-52e6a1732ba6.png">

## TODO

- Single run instances gulp build
- Cleanup gulp files
- Serve directly from src, not .tmp
- Remove unused tasks
- Add bump tasks
