# EyeSee - Server
This is the implementation of the projects server.

## Installing the Project

The first step is to clone the git repo.
Then you should have install the projects dependencies by running 'npm instal'
Afterwards we run 'npm start'

### Nodemon
In this project we have the following script
'''json
"scripts": {
    "start": "nodemon src/app.js"
  },
'''
Which allows us to load the server dynamically and change it while we run it.
Check [Nodemon](https://www.npmjs.com/package/nodemon) official docs

## Connecting to Atlas

### .env file

You should add to the root directory a '.env' file with the following data:
'''
PORT=4000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@eyeseedemo.bpy4r.mongodb.net/?retryWrites=true&w=majority&appName=EyeSeeDemo
'''

And replace <db_usernamee> and <db_password> with your username and password.
The code uses [dotenv](https://www.npmjs.com/package/dotenv) to load the variables for connecting the server

## Testing the Connection
Once you started the project you need to go to the browser and connect to localhost:4000 and receive the following message:
'''
API is running
'''

In order to connect the node.js server to the Atlas cluster we run the following command from 
'db.js' file:
'''javascript

'''