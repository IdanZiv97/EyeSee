# EyeSee - Server - Feature/Heatmap Images
Here is a list of tasks to be done regrading the feature

## TODO
- [ ] Testing:
    - [ ] User login (client side)
    - [ ] User signup (client side)
    - [ ] User login (server side)
    - [ ] User signup (server side)
- [ ] Tokens and Sessions:
    The goal is to user session and tokens to track users.

## In Progress
- [ ] User Signup:
    - [ ] Create signup form (including form)
    - [ ] after signup pass the main store_id

## Completed
- [x] User Login:
    - [x] check if user exists
    - [x] check if password matches
    - [x] change user model to save the hash value of the password as a security measure.
    - [x] after login send the proper 