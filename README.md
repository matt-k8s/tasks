# Tasks

Build a Node.js REST API using BDD

Persist Tasks data to PostgreSQL

## Endpoints

POST /tasks - create task

Response:

```json
{
  errorMessage: null,
  data: {
    taskId: 'abc123'
    description: 'Do the dishes.'
  }
}
```

PUT /tasks/{taskId} - update task

Response:

```json
{
  errorMessage: null,
  data: {
    taskId: 'abc123'
    description: 'Do the dishes.'
  }
}
```

GET /tasks/{taskId} - get task

Response:

```json
{
  errorMessage: null,
  data: {
    taskId: 'abc123'
    description: 'Do the dishes.'
  }
}
```

DELETE /tasks/{taskId} - delete task

Response:

```json
{
  "errorMessage": null,
  "data": {
    "deleted": true
  }
}
```

GET /tasks - get tasks

Response:

```json
[{
  errorMessage: null,
  data: {
    taskId: 'abc123'
    description: 'Do the dishes.'
  }
},
{
  errorMessage: null,
  data: {
    taskId: 'abc456'
    description: 'Do the ironing.'
  }
}]
```
