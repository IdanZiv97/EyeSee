<div align="center">
  <h1>🔗 EyeSee Server - Backend Core 🔗</h1>
  <p><i>The orchestrator connecting all project components with precision.</i></p>
</div>

<div align="center" style="margin-top: 20px;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" style="width: 60px; margin-right: 10px;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express.js" style="width: 120px; margin-right: 10px;">
  <img src="https://https://upload.wikimedia.org/wikipedia/en/5/5a/MongoDB_Fores-Green.svg" alt="MongoDB" style="width: 80px; margin-right: 10px;">
  <img src="https://res.cloudinary.com/demo/image/upload/cloudinary_icon_blue.png" alt="Cloudinary" style="width: 80px;">
</div>

---

<p>
The <strong>EyeSee Server</strong> is the backbone of the project, acting as the central hub that connects the client-side interface, the machine learning model, and the database. Its modular design follows the <strong>MVC (Model-View-Controller)</strong> architecture, where the views are represented by the React client code. 
</p>

<p>
Key responsibilities include:
</p>
<ul>
  <li>Managing API endpoints for seamless client-server communication.</li>
  <li>Coordinating with the Vision Model for data processing.</li>
  <li>Handling media uploads and storage through Cloudinary.</li>
  <li>Providing secure and efficient database interactions with MongoDB.</li>
</ul>

---

## 🗂️ Project Structure

```
$PROJECT_ROOT/Server
├── controllers
│   # Business logic and API endpoint handlers
├── models
│   # Mongoose schemas and database operations
├── routes
│   # Defines API routes
├── services
│   # Auxiliary services for media management, communication with the Vision Model, etc.
├── utils
    # Helper functions and configurations
```

---

## 🌟 Features
<ul>
  <li><strong>🔗 Modular Architecture</strong>: Organized into controllers, models, routes, and services for maintainability.</li>
  <li><strong>📦 Media Handling</strong>: Integrates Cloudinary for video and image storage and management.</li>
  <li><strong>📊 Database Integration</strong>: Uses MongoDB Atlas for scalable and efficient data storage.</li>
  <li><strong>🤝 Integration</strong>: Bridges communication between the client-side React app and the Vision Model.</li>
</ul>

---

## 🛠️ Tech Stack
<ul>
  <li><strong>Backend Framework:</strong> Node.js with Express.js</li>
  <li><strong>Database:</strong> MongoDB (Atlas)</li>
  <li><strong>Media Management:</strong> Cloudinary</li>
  <li><strong>Architecture:</strong> MVC</li>
</ul>

---
## 📊 Fake Data

In the data folder you have a file named <code>fakeDataGenerator.js</code>.
Run it to create your own fake data to use the project with.

---

---

## 👨‍💻 Authors
<ul>
  <li><strong>Idan Ziv</strong>  
    - [LinkedIn](https://www.linkedin.com/in/idanziv7/)  
    - [GitHub](https://github.com/IdanZiv97)</li>
  <li><strong>Dan Marom</strong>  
    - [LinkedIn](https://www.linkedin.com/in/dan-marom/)  
    - [GitHub](https://github.com/danmarom16)</li>
  <li><strong>Yonatan Radai</strong>  
    - [LinkedIn](https://www.linkedin.com/in/yonatan-radai-074616211/)  
    - [GitHub](https://github.com/YonatanRadai)</li>
</ul>

---

