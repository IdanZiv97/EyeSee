# EyeSee - Final Project

In order to run the project run the following command

```bash
git clone git@github.com:IdanZiv97/EyeSee.git
```

You will have the following directory structure:
```
$PROJECT_ROOT(EyeSee)
├── Client
│   # Client-Side code
├── Server
│   # Server Side code
├── VisionModel
    # AI model files (code, weights, etc)
```

Make sure to navigate and run each part of the project on a seperate terminal tab.

## Client

In order to run the server make sure you have the following .env file:
```bash
# cloudinary config credentials to connect to clouadinary
CLOUDINARY_CLOUD_NAME= 
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Move into the directory of the Client code


```bash
cd Client
```
and then into the eyesee directory

```bash
cd eyesee
```

Install all the requirements

```bash
yarn
```

After you successfuly installed the requiredments you can start the project:

```bash
yarn start
```

Once the app runs, it will open the browser and navigate to:
```
http://localhost:3000
```

## Server

This directory contains the Node.JS server and MongoDB Atlas database.
In order to run the server make sure you have the following .env file:
```bash
PORT= # server port
MONGO_URI= # string to connect to atlas server
# cloudinary config credentials to connect to clouadinary
CLOUDINARY_CLOUD_NAME= 
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
And fill the proper input to each variable.

After you done that make you navigate to the server code directory

```bash
cd Server
```

And install the requirements

```bash
npm install
```

and then run

```bash
npm run
```

### Vision Model
In order to run the server make sure you have the following .env file:
```bash
# cloudinary config credentials to connect to clouadinary
CLOUDINARY_CLOUD_NAME= 
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

After you done that make you navigate to the server code directory

```bash
cd VisionModel
```

Create a virutal environment for the project

```bash
python3 -m venv .venv
source .venv/bin/activate # in order to activate the virtual env
```

And install the requirements

```bash
pip install -r requirements.txt
```

and then run

```bash
python3 api.py
```
