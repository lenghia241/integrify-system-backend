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
