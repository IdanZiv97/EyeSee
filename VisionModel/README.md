# VisionModel

The **VisionModel** is the business logic component of the EyeSee project. Its purpose is to analyze CCTV footage uploaded by store owners and extract actionable data, such as:
- 👤 **Person Count** - Tracks the number of people visible in the footage.
- 🚻 **Gender Classification** - Determines the gender of individuals.
- 🎂 **Age Classification** - Estimates age groups for each detected person.

This data empowers businesses to understand customer demographics and optimize their operations effectively.

---

## 📚 Table of Contents

1. [🎯 Project Purpose](#-project-purpose)
2. [✨ Features](#-features)
3. [🛠️ Class Diagram](#-class-diagram)
4. [⚙️ Installation](#️-installation)
5. [🚀 Usage](#-usage)
6. [🤝 Contributing](#-contributing)
7. [📬 Contact](#-contact)

---

## ✨ Features

- 🔍 **YOLOv11 Models**: 
  - **Object Tracking**: Tracks individuals in low-res CCTV footage.
  - **Gender Classification**: Classifies detected individuals into gender categories.
  - **Age Classification**: Estimates age groups of individuals.
- 📹 **Optimized for CCTV**: Specifically trained with real-world CCTV data to overcome low-resolution challenges.
- ☁️ **Cloud Integration**: Uses Cloudinary for seamless asset management.

---

## 🛠️ Class Diagram
![class diagram](https://github.com/user-attachments/assets/e4191718-5acf-4c6e-a96c-d4fe7fd27bdd)

### 📌 Class Descriptions

1. **`api.py`**: Receives API requests for analysis and triggers the `ComputerVisionService`.
2. **`ComputerVisionService`**: 
   - Initializes and manages single instances of all objects (Singleton pattern).
   - Passes references to dependent classes.
3. **`VideoManager`**: 
   - Handles video metadata.
   - Ensures code extensibility while maintaining backward compatibility.
4. **`DataProvider`**: 
   - Manages data persistence and metrics saving.
   - Sends API requests upon analysis completion.
5. **`VideoAnalyzer`**: 
   - Orchestrates the analysis process by managing global frame counts and calling frame analysis.
6. **`FrameAnalyzer`**: 
   - Guides frame analysis, object tracking, and heatmap management.
   - Handles line crossings and entry validations.
7. **`ObjectTracker`**: 
   - Manages objects in the video, including:
     - `counted_ids`: Individuals counted as clients.
     - `dirty_ids`: Individuals entering outside defined regions.
     - `past_customers`: Exited clients.
     - `tracks`: All detected objects.
   - Tracks dwell time and classifications for each object.
8. **`ObjectCounter`**: Handles counting logic independently of the tracking logic.
9. **`BaseClassifier`**: 
   - Abstract class extended by:
     - **`AgeClassifier`**: Handles age classification.
     - **`GenderClassifier`**: Handles gender classification.
   - Decouples classification technology from other components.
10. **`HeatmapManager`**: Manages heatmap creation and visualization.
11. **`CloudinaryService`**: Downloads and uploads assets to Cloudinary, dynamically injected into `DataProvider`.

---

## ⚙️ Installation

1. 📂 Clone the repository:
   
   ```bash
   git clone https://github.com/IdanZiv97/EyeSee.git
   cd EyeSee/VisionModel
  ```

2. 🛠️ Install dependencies:

  ```
  pip install -r requirements.txt
  ```

3. ☁️ Configure Cloudinary credentials in the .env file.

---

🚀 Usage
This model is not directly exposed to the end user, and is triggered only by the uploading of CCTV footage via UI.

---

📬 Contact
For questions or feedback, reach out to:

👤 Name: Dan Marom
📧 Email: [dan.marom3@gmail.com]



