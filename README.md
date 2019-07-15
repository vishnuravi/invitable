invitable
=========
An invitation queue service.

# What is invitable?
Invitable is an invitation queue that will allow users to create an account then opt-into a queue for an invite only service (including betas/alphas).
Users who have spare invites can share them with those in the queues!!!

# To run
```
$ npm install
$ node app.js
> invitable is now running
```
# API Endpoints
| Route | Request Method  | Description | Params |
| ----|--------- | ------------- |------------|
|/invitables|POST | Create a new invitable | name, url, about, email, creation (in epoch), sendable |
|/invitables|GET |Lists all invitables | none |
|/invitables/delete|POST|Deletes an invitable| invitable _id|
|/subscriber/delete|POST|Deletes a subscriber|user _id and invitable _id|
|/invitables/:event_id|GET |Gets a single event by event id|invitable _id|
|/invitables/:event_id/:user_name|GET |Adds a single user to an event queue|user _id|
|/subscriber/invitables/:user_name|GET|Gets all users subscribed to an invitable|user _id|
|/subscriber/users/:event_name|GET|Gets all invitables a user is subscribed to|invitable _id|
|/user/increment/sends/:_id|GET| increment invites sent| users _id|
|/user/increment/receives/:_id|GET| increment invites received| users _id|
|/subscriber/send|POST|Sends a user an invite|sender, receiver, inviteCode, service|

# Contributing

**Project is not actively maintained**

Please submit a pull request on this page, we will then run your code and verify it.  We will not merge in code that you license in a non-GPL compatible license.
If you find an issue please create an issue (no matter how small you may think it is)!  
- For API route creation assign issues to @frankcash or @vishnuravi
- For Front-end issues please assign them to @aarohmankad or @cris1133
- Select appropriate issue tag

# LICENSE
GPL-3
