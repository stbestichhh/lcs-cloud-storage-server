[![Node.js CI](https://github.com/stbestichhh/lcs-cloud-storage-server/actions/workflows/node.js.yml/badge.svg)](https://github.com/stbestichhh/lcs-cloud-storage-server/actions/workflows/node.js.yml)
[![NPM Version](https://img.shields.io/npm/v/lcs-cloud-storage)](https://www.npmjs.com/package/lcs-cloud-storage)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Static Badge](https://img.shields.io/badge/lcs-Wiki-skyblue)](https://github.com/stbestichhh/lcs-cloud-storage-server/wiki)


# lcs-cloud-storage server

## Table of contents

* [Description](#about)
* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Deployment](#deployment)
  * [Usage](#usage)
  * [Running tests](#running-tests)
* [Contributing](#contributing)
* [Changelog](#changelog)
* [Authors](#authors)
* [License](#license)

## About

LCS - is a local cloud storage server. 
The Local Cloud Storage Server project aims to develop a robust and secure local cloud storage solution. 
This system will provide users with the ability to store, retrieve, and manage their data locally while enjoying the benefits of cloud storage such as scalability, accessibility, and reliability. 

The server will expose a **RESTful API** that allows users to interact with the storage.
This API will support operations such as uploading files, downloading and all default filesystem operations.

In addition to the API, the system will provide a **Command Line Interface (CLI)**.
This will enable users to use server feature or to configure it.

## Getting started

### Prerequisites

* yarn `npm i -g yarn` or `corepack enable`

> [!IMPORTANT]
> **Node.js 18.x+** version must be installed in your OS.

### Installation

1. Clone the repository

```shell
$ git clone https://github.com/stbestichhh/lcs-cloud-storage-server.git 
```

2. Install dependencies

```shell
$ yarn install
```

#### Or install as NPM package

```shell
$ npm i -g lcs-cloud-storage
```

### Deployment

#### Start the server to production

* From cli

  See [usage instructions](#usage) to find out how to use cli

  ```shell
  $ lcs [options] server|run [options]
  ```

* From source code

  ```shell
  $ yarn build
  $ yarn start:prod
  ```

* Without installing

  Run default configuration

  ```shell
  $ docker build -t lcs-cloud-storage:0.0.2 .
  $ docker run -p <port>:9110 lcs-cloud-storage:0.0.2
  ```

  Override configuration
  ```shell
  $ docker build -t lcs-cloud-storage:0.0.2 .
  $ docker run -e PORT=<port> -e HOST=<host> -e SECRET_KEY=<jwtkey> -e DB_NAME=<dbname> -p <port>:<port> lcs-cloud-storage:0.0.2 node dist/index.js [options] [command]
  ```
  
  Overriding every enviroment variable is not necessary. Options and command see in [usage](#usage) section. 

#### Start server locally

```shell
$ yarn start:dev
```

### Usage

See the usage instruction in the lcs-cloud-storage [Wiki's](https://github.com/stbestichhh/lcs-cloud-storage-server/wiki)

### Running tests

#### Unit tests

```shell
$ yarn test
```

watch mode

```shell
$ yarn test:watch
```

#### End to end tests

This e2e tests are testing server api

```shell
$ yarn test:e2e
```

watch mode

```shell
$ yarn test:e2e:watch
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Changelog

Project changes are writen in changelog, see the [CHANGELOG.md](CHANGELOG.md).

We use [SemVer](https://semver.org/) for versioning. 
For the versions available, see the [tags](https://github.com/stbestichhh/lcs-cloud-storage-server/tags) on this repository.

## Authors

- [@stbestichhh](https://www.github.com/stbestichhh)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE)
