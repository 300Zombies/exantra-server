# Exantra Server

## Technique Stack

- heroku server
  > pwd: a-0275...
- MongoBD Atlas
  > DB user Jef... pwd a02...
  > ODM: mongoose
- Node.js / Express.js
  > cookie-session
- passport.js
  > passport-facebook-token
  > passport-google-authcode
- AWS
  > S3 bucket with pre-signed post

## Schemas

### Users

| Field      | Type   | Description                         |
| ---------- | ------ | ----------------------------------- |
| FacebookId | string | aquired after authentication        |
| GoogleId   | string | aquired after authentication        |
| email      | string | aquired from corresponding provider |
| birthday   | date   | yyyy-mm-dd                          |

### Altertitan

| Field          | Type   | Description                                         |
| -------------- | ------ | --------------------------------------------------- |
| userId         | string | **Index**<br>Related to \_id field in User document |
| workoutSurvey  | object | see workout survey schema                           |
| currencies     | object | see currencies schema                               |
| character      | object | see character schema                                |
| workoutSession | array  | see workout session schema                          |

### workout survey

| Field                  | Type   | Description                                                                                             |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| workoutPlace           | number | 0: home<br>1: outside<br>2: gym                                                                         |
| currentExercisePerWeek | number | how many times a week (e.g. 3)                                                                          |
| targetExercisePerWeek  | number | how many times a week (e.g. 7)                                                                          |
| lengthPerSession       | number | minutes                                                                                                 |
| focus                  | number | 0: weight loss<br>1: cardio strength<br>2: toning<br>3: strength<br>4: bulking                          |
| motivation             | number | 0: animal collecting<br>1: epic story<br>2: battling<br>3: daily rewards<br>4: making my titan stronger |

### currencies

| Field   | Type   | Description               |
| ------- | ------ | ------------------------- |
| token   | number | **default value = 10000** |
| shard   | number | **default value = 10000** |
| medal   | number | **default value = 10000** |
| augment | number | **default value = 10000** |

### character

| Field     | Type   | Description                                                                          |
| --------- | ------ | ------------------------------------------------------------------------------------ |
| nickname  | string | name of the titan                                                                    |
| soldierId | number | **auto increment**<br>5 digits number attached after<br>nickname to avoid duplicates |
| faction   | number | 0: Pacific<br>1: Myahara<br>2: Twilight                                              |
| gender    | number | 0: female<br>1: male                                                                 |
| level     | number | current level of titan                                                               |
| experince | number | current experinces of titan                                                          |
| traits    | object | see traits schema                                                                    |
| gears     | object | see gears schema                                                                     |
| abilities | array  | see abilities schema                                                                 |

### workout session

> session objects in workoutSession array

| Field    | Type   | Description                                                                                   |
| -------- | ------ | --------------------------------------------------------------------------------------------- |
| url      | number | **optional**<br>**default = ""**<br>S3 bucket url                                             |
| start    | number | **default = 0**<br>session start                                                              |
| length   | number | **default = 0**<br>session length in minutes                                                  |
| type     | number | **default = -1**<br>0: lift, 1: swim, 2: run, 3: play,<br>4: yoga, 5: hike, 6: bike, 7: other |
| location | TBD    | to be determined                                                                              |
| notes    | string | **default = ""**<br>notes or describe type 7 above                                            |

### traits schema

| Field        | Type   | Description      |
| ------------ | ------ | ---------------- |
| dexterity    | number | **default = 10** |
| intelligence | number | **default = 10** |
| strength     | number | **default = 10** |
| constitution | number | **default = 10** |
| reflex       | number | **default = 10** |
| luck         | number | **default = 10** |

### gears schema

| Field    | Type   | Description |
| -------- | ------ | ----------- |
| helmet   | number | item id     |
| jacket   | number | item id     |
| pants    | number | item id     |
| shoes    | number | item id     |
| suit     | number | item id     |
| bag      | number | item id     |
| mainHand | number | item id     |
| offHand  | number | item id     |

### abilities

> abilities objects in ability array

| Field | Type   | Description   |
| ----- | ------ | ------------- |
| id    | number | ability id    |
| level | number | ability level |

## APIs

### Google authentication

> Successful authentication will grant cookie for later recognition

- endpoint: /auth/google/authcode
- method: POST
- requesrt body example:
  ```
  {
      "code":"4/vAHjCZ4KggOP3uurN7N7uPO4tKO"
  }
  ```
- response body example
  ```
  {
      "_id": "5e12b658",
      "googleId": "1030999",
      "email": "o@m.g",
      "__v": 0
  }
  ```

### Facebook authentication

> A cookie will be granted after successful authentication for later recognition

- endpoint: /auth/facebook/token
- method: POST
- request body example:
  ```
  {
      "access_token":"EAARIZBvYw1YMBAAo0idK"
  }
  ```
- response body example:
  ```
  {
      "_id": "5e12b658",
      "facebookId": "2031907",
      "email": "o@m.g",
      "__v": 0
  }
  ```

### Altertitan signup

- endpoint: /altertitan/signup
- method: POST
- cookie reqiured
- request body example:
  ```
  {
      "birthday": "2020-01-01",
      "workoutPlace": 0,
      "currentExercisePerWeek": 0,
      "targetExercisePerWeek": 999,
      "lengthPerSession": 999,
      "focus": 0,
      "motivation": 0,
      "nickname": "Anonymous",
      "faction": 0,
      "gender": 0
  }
  ```
- response body example:
  ```
  {
      "currencies": {
          "token": 1000,
          "shard": 12000,
          "medal": 20,
          "augment": 15
      },
      "character": {
          "traits": {
              "dexterity": 10,
              "intelligence": 10,
              "strength": 12,
              "constitution": 10,
              "reflex": 10,
              "luck": 10
          },
          "level": 1,
          "experience": 0,
          "nickname": "Anonymous",
          "soldierId": 19123,
          "faction": 0,
          "gender": 0,
          "abilities": [{...}, ...]
      },
      "_id": "5e1edecc1e9c5f0017c96633",
      "workoutSession": [{...}, ...]
  }
  ```

### Altertitan signin

- endpoint: /altertitan/signin
- method: GET
- cookie required
- response body example:
  ```
  {
      "currencies": {
          "token": 1000,
          "shard": 12000,
          "medal": 20,
          "augment": 15
      },
      "character": {
          "traits": {
              "dexterity": 10,
              "intelligence": 10,
              "strength": 12,
              "constitution": 10,
              "reflex": 10,
              "luck": 10
          },
          "level": 1,
          "experience": 0,
          "nickname": "Anonymous",
          "soldierId": 19123,
          "faction": 0,
          "gender": 0,
          "abilities": [{...}, ...]
      },
      "_id": "5e1edecc1e9c5f0017c96633",
      "workoutSession": [{...}, ...]
  }
  ```

### Workout sesstion start

- endpoint: /altertitan/session/start
- method: GET
- cookie required
- response example: status 200, 401, 500

### Workout session end

- endpoint: /altertitan/session/end
- method: POST
- cookie required: yes
- request example:
  ```
  {
      "sessionLength": 600000,
      "url": "https://domain.com/path/to/bucket",
      "type": 8,
      "notes": "bungee jumping"
  }
  ```
- response example: status 200
