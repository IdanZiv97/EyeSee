# EyeSee - Server - Feature/Heatmap Images
Here is a list of tasks to be done regrading the feature

## TODO
- [ ] Testing:
    - [ ] User login (client side)
    - [ ] User signup (client side)
- [ ] Tokens and Sessions:
    The goal is to use session and tokens to track users.

## In Progress
- [ ] Testing:
    - [] User login (server side)

## Completed
- [ ] Testing:
    - [x] User signup (server side)
- [x] User Signup:
    - [x] Create signup form (including form)
    - [x] after signup pass the main store_id
- [x] User Login:
    - [x] check if user exists
    - [x] check if password matches
    - [x] change user model to save the hash value of the password as a security measure.
    - [x] after login send the proper 