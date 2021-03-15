## Test assignment for Alveo

### Instructions:

##### Backend
```
cd backend
yarn
yarn start
```

It's very important to make sure that `LOG_FILE` in the top of the `index.js` is correctly defined so that it points to the log file. The log can later be modified by another process.

##### Frontend
```
cd frontend
yarn
yarn start
```

Please make sure that `BACKEND_URL` in `src/app/constants` points to the backend in case you want to launch the backend on a different server/port.

### Approach

##### Backend

Quickly prototype a server that will watch over the file changes and keep track of MD5. Write a primitive poller that uses `If-None-Match` and returns immediately if it's a cache miss. Otherwise wait until either the file is changed or the poll is timed out.

The solution could be improved by allowing the client to request only parts of the file. Just as an example, using timestamp as the ID, we can create a transform stream that will only emit the lines that are newer than the timestamp. This will potentially solve the bottleneck of the file being too large to fit into node.js process' memory.
The process of retrieving the logs can also be deferred to a job queue.

Potentially with transform streams we can also search for specific keywords and make our own search that will work with large logs.

##### Frontend

The logs viewer is designed as a separate feature with its own reducer, components which can be rendered when we want.
I felt it's a good idea to keep the polling logic in a hook because polling only actually makes sense when we're rendering the logs.
The hook acts as a service and could potentially be used with other services.
Alternatively, the polling could be implemented inside an epic or a saga.

It's assumed that the timestamp is unique and can be used as an ID.
It's also assumed that there are only three severities: ERROR, INFO and WARNING. We can also switch to runtime-defined severities by small modifications to regex and parts of the feature that calculate statistics.
