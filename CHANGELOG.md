# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Updated:
* New, better and easier api v2.
* Changed database from json to sqlite3
* Updated security while working with storage
* Fixed error response codes in api, improved error handling
* New login sessions logic

### Added:

* New flag for server command, which tells server to srart with ssl.
* [Code of Conduct](CODE_OF_CONDUCT.md)
* [Security](SECURITY.md) file of supported versions
* Now users can update their data and change passwords
* Tree command 
* New flag for prune command, to drop user database
* New config flag to define login sessions lifetime

### Fixed:

* Fixed bug with status code 500 while performing ls or cat operations with wrong object 

## Patch 0.0.5

### Added:

* Now filesystem can create files and read their content

### Fixed:

* Fixed error handling
* Added more conditions which throws error

`25-04-2024`

## Patch 0.0.4

### Added:

* New command `lcs prune` which allows to remove server data from os

### Changed:

* Increased security level with auth sessions and auth tokens
* Changed password hashing algorithm to argon2

### Fixed:

* Server internal error thrown if download path not exists
* Server internal error thrown if remove file path not exists
* Updated app config file path

`21-04-2024`

## Patch 0.0.3

This patch is hot fix for 0.0.2 version. 

### Fixed: 

* Fixed error with not existing config directory
* Fixed config error hints
* Fixed Internal server error if auth token is wrong or expired

`20-04-2024`

## Patch 0.0.2

### Added:

* Created short project documentation in [README.md](README.md)
* Now users can change the config while running app with Docker

### Fixed:

* Deleted unnecessary dependency
* Fixed npm package compound

`19-04-2024`

## 0.0.1

### What's Changed

* Refactored, configured, fixed bugs by @stbestichhh #27
* Deployment by @stbestichhh in https://github.com/stbestichhh/lcs-cloud-storage-server/pull/27

**Full Changelog**: https://github.com/stbestichhh/lcs-cloud-storage-server/compare/0.0.1-beta.1...0.0.1

`16-04-2024`

## 0.0.1-beta.1

### Added:

- New command 'config' to configure the server.
- '--log' flag to enable logging error to log file.

`14-04-2024`

### Changed:

- Now server starts with the command 'server|run' instead of 'lcs'.

## 0.0.1-beta

### Added:

- Download files from storage

### Changed:

- Highlight error in server console

`11-04-2024`

## 0.0.1-alpha

- [Full changelog](81a198fa18e28494bdc5bfe86c6958e6cfe77c1c)
