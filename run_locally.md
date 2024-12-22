# EyeSee - Running The Project Locally

In order to run the project, execute the following command:

```bash
git clone git@github.com:IdanZiv97/EyeSee.git
```

You will have the following directory structure:
```
$PROJECT_ROOT (EyeSee)
├── Client
│   # Client-Side code
├── Server
│   # Server Side code
├── VisionModel
    # AI model files (code, weights, etc)
```

Make sure to navigate and run each part of the project in a separate terminal tab.

---

## Prerequisites
- A MongoDB database (Atlas, local, etc.).
- A Cloudinary account.
- An `.env` file (see examples below).
- Optionally, you can run `generateFakeData.js` to create your own fake data for the project.

---

## Client

In order to run the client, make sure you have the following `.env` file:
```bash
# Cloudinary config credentials to connect to Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Move into the directory of the Client code:

```bash
cd Client
```

Then navigate into the `eyesee` directory.

Install all the requirements:

```bash
yarn
```

After successfully installing the requirements, you can start the project:

```bash
yarn start
```

Once the app runs, it will open the browser and navigate to:
```
http://localhost:3000
```

---

## Server

This directory contains the Node.js server and MongoDB Atlas database.
In order to run the server, make sure you have the following `.env` file:
```bash
PORT= # server port
MONGO_URI= # string to connect to the MongoDB Atlas server
# Cloudinary config credentials to connect to Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
Fill in the appropriate values for each variable.

Navigate to the server code directory:

```bash
cd Server
```

Install the requirements:

```bash
npm install
```

Then run:

```bash
npm run
```

---

## Vision Model

In order to run the vision model, make sure you have the following `.env` file:
```bash
# Cloudinary config credentials to connect to Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Navigate to the VisionModel code directory:

```bash
cd VisionModel
```

Create a virtual environment for the project:

```bash
python3 -m venv .venv
source .venv/bin/activate # Activate the virtual environment
```

Install the requirements:

```bash
pip install -r requirements.txt
```

Then run:

```bash
python3 api.py
```