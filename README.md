# Microsoft Engage Mentorship program'21 project   

### 🚩 Overview 
In COVID 19 pandemic , it has become cruicial for many people to work remotely from their home.Schools and Colleges adopts online means. Having a platform that have an itegration of our social and academic life is must for today's lifestyle

What we build is an integration of academic and social life with variety of features for teachers, students, teams to work together in a collabrative environment.  
This is solely built during the period of **Microsoft Engage Mentorship program'21** conducted by Microsoft provide mentorship and to enrich freshmen with various software development techniques. 

#### Problem statement (as given)
Build a functional prototype of a platform that gives student an array of digital academic and social tools to stay engaged with their studies, peers and broader university community during pandemic.
- [x] Status : Accomplised by integrating all academic features in social chats in form of groups.

## 🚩 Features:
Feature | Images
------------ | -------------
**Authentication**: Used Firebase Auth setup to authorize user. User can either be **Teacher** or **Student** | Login: <img width="750px" height="350px" src="/readme_assets/login.PNG"> Signup: <img width="750px" height="350px" src="/readme_assets/signup.PNG">
**Teacher View** | Images
**Create Class** | <img width="750px" height="350px" src="/readme_assets/CreatedClass_TeacherView.PNG">
**Post Assignment** | **Post Assignment View:** <img width="750px" height="350px" src="/readme_assets/classView_teacher.PNG"> **Integration of Post Assignment with Chats:**<img width="750px" height="350px" src="/readme_assets/chat_view_classroom_teacher.PNG">
**Enrolled Students** | <img width="750px" height="350px" src="/readme_assets/Enrolled_students_teacher.PNG">
**Accept Assignment Submissions** | <img width="750px" height="350px" src="/readme_assets/Submissions_teacher.PNG">
**Create Poll** | **Create Poll**: <img width="750px" height="350px" src="/readme_assets/Poll_teacher.PNG"> **Poll Results**: <img width="650px" height="300px" src="/readme_assets/Poll_answers_teacher.PNG">
**Student View** | Images
**Join Class** | <img width="750px" height="350px" src="/readme_assets/joinedClasses_studentView.PNG">
**View Class** | <img width="750px" height="350px" src="/readme_assets/Assinments_Student.PNG">
**View Assignment** | <img width="750px" height="350px" src="/readme_assets/AssignmentView_Student.PNG">
**Submit Solution** | <img width="750px" height="350px" src="/readme_assets/AssignmentView_Student_answer_submitted.PNG">
**Chats** | Images
**Chat View** | <img width="750px" height="350px" src="/readme_assets/chat_main_view.PNG">
**Search User** | <img  src="/readme_assets/Search_Name.PNG">
**Emoji / Attachment** | <img src="/readme_assets/Send_file_Emojis_IN_Chat.PNG">
**Read / Unread feature with highlight** | <img width="750px" height="350px" src="/readme_assets/ChatView_LastMsg_Highlighted.PNG">
**Academic / Group Discussion** | <img width="750px" height="350px" src="/readme_assets/classroom_chatView.PNG">

##  🚩 Technologies used:
#### Technology : <img alt="React" src="https://img.shields.io/badge/-React-blue" /> <img alt="React" src="https://img.shields.io/badge/-NodeJs-green" /> <img alt="React" src="https://img.shields.io/badge/-Tailwind-orange" /> <img alt="React" src="https://img.shields.io/badge/-SocketIO-red" /> <img alt="React" src="https://img.shields.io/badge/-PeerJS-yellow" />
#### Version Control : <img alt="Git" src="https://img.shields.io/badge/-Git-orange"/>  
#### Auth Control : <img alt="Git" src="https://img.shields.io/badge/-Firebase-yellow"/>  
###### You can also see the list of dependencies in the package.json file.

## 🚩Installation/Environment Setup 

  #### 1. Clone App
  
  * Make a new folder and open the terminal there.
  * Write the following command and press enter.
  
  ```
    $ git clone https://github.com/nitika2000/microsoft-engage.git
  ```
  #### 2. Go to Client Folder
  
  ```
    $ cd client
  ```
    
 #### 3. Install node packages
  * Write the following command and press enter to download all required node modules.
 
   ```
   $ npm install 
  ```
  
#### 4. Run Locally

 * While you are still inside the cloned folder, write the following command to run the website locally. 
 
 ```
   $ npm start
 ```
  
 ###### NOTE: The port by default will be ```https://localhost:3000/```
