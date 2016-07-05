# Contributing to microservices-dashboard

Microservices-dashboard is released under the Apache 2.0 license. If you would like to
contribute something, or simply want to work with the code, this document should help you
to get started.

## Code of conduct

This project adheres to the Contributor Covenant [code of conduct][1]. By participating,
you are expected to uphold this code. Please report unacceptable behavior to
andreas dot evers at ordina dot be.

## Code conventions and housekeeping

None of these is essential for a pull request, but they will all help

- Add unit tests that covers and new or modified functionality
- Whenever possible, please rebase your branch against the current master (or other
  target branch in the main project).
* When writing a commit message please follow [these conventions][2]. Also, if you are
  fixing an existing issue please add `Fixes gh-nnn` at the end of the commit message
  (where nnn is the issue number).

## Working with the code

#### Building and running the UI from source

First a basic build should be done:
```
npm install
```
Then bower dependencies should be installed:
```
bower install
```
Use gulp to serve the resources using the configuration file:
```
gulp serve:conf
```

[1]: CODE_OF_CONDUCT.md
[2]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
