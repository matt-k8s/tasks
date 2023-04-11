# Tasks

## Description

Develop a tasks API which allows the user to create, read, update and delete tasks.


## Installation

- Clone the repo

- `npm i`

## Running the tests

- `npm run test`

## Running the API

Start the database and cache:

`docker-compose up`


Start the app: `npm run start:dev`

## Requirements

- Use Redis for caching data

- Use PostgreSQL for persisting data

- Develop the application using TDD

- Create a ReST API with the below endpoinds:

GET /tasks - return tasks

Response:

```
  {
    errorMessage: null,
    data: [
      {
        taskId: "abc123",
        description: "Do the windows.",
      },
      {
        taskId: "abc456",
        description: "Do the shopping.",
      },
    ],
  }
```

POST /tasks - create task

Body:

```
  {
    description: "Do the dishes.",
  }
```

Response:

```
  {
    errorMessage: null,
    isCached: true,
    data: [
      {
        description: "Do the dishes.",
      },
    ],
  }
```

PUT /tasks:taskId - update task

Body:

```
  { description: "Hoover the floor." }
```

Response:

```
  {
    errorMessage: null,
    isCached: true,
    data: [
      {
        taskId: "1",
        description: "Hoover the floor.",
      },
    ],
  }
```

DELETE /tasks:taskId - delete task

Response:

```
  {
    errorMessage: null,
    isDeleted: true,
    data: [
      {
        taskId: "1",
        description: "Hoover the floor.",
      },
    ],
  }
```
