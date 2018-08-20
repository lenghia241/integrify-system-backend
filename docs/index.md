1. Creating boilerplate
2. Setting up basic routing
3. Schema setup
4. Mongo dB connection

### Modules required for the project

##### http-errors

This is a Node.js module available through the npm registry.
Installation is done using the npm install command:

```
npm install http-errors
```

##### express

Express is a routing and middleware web framework that has minimal functionality of its own. An Express application is essentially a series of middleware function calls.

Installation is done using the npm install command:

```
npm install express
```

##### path

The path module provides utilities for working with file and directory paths.

##### cookie-parser

Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.

Installation is done using the npm install command:

```
npm install cookie-parser
```

##### morgan

Morgan is used for logging request details.On any requests being made,it generates logs automatically.

##### mongoose


Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

```
npm install mongoose
```
### Basic Routes for API

###### Profile
```
app.get('/api/profile')
```
###### Dashboard
```
app.get('/api/dashboard')
```

###### Attendence
```
app.get('/api/attendence')
```




