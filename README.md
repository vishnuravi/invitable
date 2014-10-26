invitable
=========
An invitation queue service.

#What is invitable?
Invitable is an invitation queue that will allow users to create an account then opt-into a queue for an invite only service (including betas/alphas).
Users with extra invites will then be allowed to give up their invites!  

#To run
```
$ npm install
$ node app.js
```
#API Endpoints
| Route|Rquest Method  | Description |
| ----|--------- | ------------- |
|/invitables|POST | Create a new invitable |
|/invitables|GET |Lists all invitables |
|/invitables/:event_id|GET |Gets a single event by event id|
|/invitables/:event_id/:user_name|GET |Adds a single user to an event queue|



#Contributing
Please submit a pull request on this page, we will then run your code and verify it.  We will not merge in code that you license in a non-GPL compatible license.
If you find an issue please create an issue (no matter how small you may think it is)!  
- For API route creation assign issues to @frankcash or @vishnuravi
- For Front-end issues please assign them to @aarohmankad or @cris1133
- Select appropriate issue tag

#LICENSE
GPL-3
