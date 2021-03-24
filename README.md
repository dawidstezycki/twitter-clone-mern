# Twitter Clone MERN

Twitter Clone MERN is a social media app created to hone and showcase my web dev skills developed in free time while exploring the technology behind modern websites. It's a single-page application built with **ReactJS** that's supported by **REST API** web service created in **Node.js** with **express.js**. The application's data are stored in **MongoDB** database and the regression tests were implemented using **jest** library.

Some of the features offered by backend are creating and accessing microposts, creating users, generating authorization tokens and creating relationships with other users ("following").
Frontend offers three main views for logged-in users. Home Page is where microposts are written and published but also where the microposts published by the followed users are presented. Profile Page is specific for each user and contains a feed of their microposts as well as a sidebar with information about their followers and the follow button. All the registered users can be viewed in a list on the Users Page. If not logged-in, the users are redirected to the Login Page where they can sign in or proceed to the Registration Page to create an account. 

[Click here to open the app on heroku](https://secret-reef-44032.herokuapp.com/)


Even though the website is fully functioning in its current form, it is still a work in progress and these are some of the upcoming changes:
- Mobile-friendly interface
- Move to **GraphQL**
- Email activation in the process of registration
- Password resets
- Posting pictures
- Profile pictures



<img src="/screenshots/LoginPage.png" width="300">          <img src="/screenshots/HomePage.png" width="300">          <img src="/screenshots/ProfilePage.png" width="300">
