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

This is API version1. In this we serve mockdata in json file...

###### List of users profiles

- GET [https://integrify.network/api/profiles](https://integrify.network/api/profiles)

In this API you have access to array of users with following keys

    {

    "_id": "",
    "firstName": "",
    "lastName": "",
    "email": "",
    "role": "",
    "batch": "",
    "bio": "",
    "github": "",
    "linkedin": "",
    "competences": [string],
    "skills": [string],
    "education": [
        {
        "school": "",
        "degree": "",
        "fieldOfStudy": "",
        "from": "",
        "to": "",
        "current": ,
        "description": ""
        }
    ],
    "experience": [
        {
        "title": "",
        "company": "",
        "location": "",
        "from": "",
        "to": "",
        "current": false,
        "description": ""
        }
    ],
    "languages": [string],
    "examplesOfWork": [
        {
        "title": "",
        "status": ,
        "githubLink": ""
        }
    ],
    date:""

     }

###### Single user profile

- Get single user's profile by id

  - GET [https://integrify.network/api/profiles/:id](https://integrify.network/api/profiles/5b7ab1957c9b3c63007d5c8c)

- Create new profile

  - POST [https://integrify.network/api/profiles/](https://integrify.network/api/profiles/)

- Edit 1 profile by id

  - PUT [https://integrify.network/api/profiles/:id](https://integrify.network/api/profiles/5b7ab1957c9b3c63007d5c8c)

- Delete 1 profile by id
  - DELETE [https://integrify.network/api/profiles/:id](https://integrify.network/api/profiles/5b7ab1957c9b3c63007d5c8c)

###### Dashboard

List of events

- GET [https://integrify.network/api/dashboard/events](https://integrify.network/api/dashboard/events)

In this API you can access to

    {

    "_id": "",
    "title": "",
    "description": "",
    "venue": {
        "address": "",
        "zip": ,
        "name": "",
        "state": "",
        "city": "",
        "country": ""
    },
    "eventUrl": "",
    "time": "",
    "status": ""

    }

Here id and title indicated for particular event's.

List of Studysync

- GET [https://integrify.network/api/dashboard/studysync](https://integrify.network/api/dashboard/studysync)

In this you can have access to following keys

    {

    "_id": "",
    "firstName": "",
    "lastName": "",
    "date": "",
    "title": "",
    "description": ""

    }

firstname and lastname indicates user details who did studysync

List of Assignments

- GET [https://integrify.network/api/dashboard/assignments](https://integrify.network/api/dashboard/assignments)

In this API you can have access to following keys

    {

    "_id": "",
    "date": "",
    "dueDate": "",
    "titleOfAssignment": "",
    "description": "",
    "submitted": boolean,
    "githubLink":""

    }

Here id if for particular assignment.
