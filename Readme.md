## Summary

The API for my Elevate client has get, post, patch, and delete endpoints for each PostgreSQL table. Each is linked to a useremail to assign inputs to user accounts.

## Technologies Used

This API was built using Node.js with Express and Express.Router. The database was built using PostgreSQL. I used JWT and bCrypt plugins for user logins.

# Elevate API Documentation

## Live Link: https://elevate-app.danielle-russell.vercel.app/

<hr>

### User Accounts and Logins

#### POST api/users

| Field     | Required | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| firstname | Yes      |                                                    |
| lastname  | Yes      |                                                    |
| email     | Yes      | Must be a valid email that is not currently in use |
| password  | Yes      | Must be >= 8 characters                            |

#### POST api/users/login

Takes username and password, generating a unique token if matched in the system.

#### GET api/users/:useremail

Get user email, firstname and lastname

#### DELETE api/users/:useremail

Delete user

### Workouts

#### GET /api/workouts

Returns all workouts

#### GET /api/workouts/:userid

Returns a list of all workouts logged for a certain user account

#### POST /api/workouts

| Field  | Required | Description                                                            | Type |
| ------ | -------- | ---------------------------------------------------------------------- | ---- |
| userid | Yes      | String- Relates to previously created user account (Foreign Key users) | All  |
| title  | Yes      | String                                                                 | All  |
| descr  | Yes      | String                                                                 | All  |
| tip    | Yes      | String                                                                 | All  |

#### PATCH api/workouts/:id

Update workout

#### DELETE api/workouts/:id

Delete workout

### Workouts

#### GET /api/workouts

Returns all workouts

#### GET /api/workouts/:userid

Returns a list of all workouts logged for a certain user account

#### POST /api/workouts

| Field  | Required | Description                                                            | Type |
| ------ | -------- | ---------------------------------------------------------------------- | ---- |
| userid | Yes      | String- Relates to previously created user account (Foreign Key users) | All  |
| title  | Yes      | String                                                                 | All  |
| descr  | Yes      | String                                                                 | All  |
| tip    | Yes      | String                                                                 | All  |

#### PATCH api/workouts/:id

Update workout

#### DELETE api/workouts/:id

Delete workout

### Preferences

#### GET /api/preferences/:userid

Returns a list of all preferences logged for a certain user account

#### POST /api/preferences

| Field  | Required | Description                                                            | Type |
| ------ | -------- | ---------------------------------------------------------------------- | ---- |
| userid | Yes      | String- Relates to previously created user account (Foreign Key users) | All  |
| name   | Yes      | String                                                                 | All  |
| age    | Yes      | String                                                                 | All  |
| weight | Yes      | Integer                                                                | All  |
| height | Yes      | Integer                                                                | All  |

| goals | Yes | String | All |

| time | Yes | String | All |
| days | Yes | String | All |

#### PATCH api/preferences/:id

Update preferences

#### DELETE api/preferences/:id

Delete preferences
