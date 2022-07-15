// immediately invoked function expression (IIFE)
(function () {
  // https://firebase.google.com/docs/web/setup#available-libraries

  // web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBQvL8FvUN8smbdDvSwAPGz_G1H7cRYnq8",
    authDomain: "apple-room-reservation-system.firebaseapp.com",
    projectId: "apple-room-reservation-system",
    storageBucket: "apple-room-reservation-system.appspot.com",
    messagingSenderId: "463773884430",
    appId: "1:463773884430:web:db87e428666350f5ed1c5f"
  };

  // initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // initialize Firestore
  const db = firebase.firestore();

  // !user login js
  // when a user signs in, pass the user's email address and password to signInWithEmailAndPassword
  // if logged in successfully, get user role and show new page based on role
  const loginBtn = document.querySelector("#loginBtn");

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const loginErrorMsg = document.querySelector('#loginErrorMsg');
    const existingEmail = document.querySelector("#existingEmail").value;
    const existingPassword = document.querySelector("#existingPassword").value;

    firebase.auth().signInWithEmailAndPassword(existingEmail, existingPassword)
      .then((userCredential) => {
        // logged in successfully
        console.log("logged in successfully");

        let user = userCredential.user;
        console.log("user: ", user);
        let uid = user.uid;

        // hide error msg
        loginErrorMsg.style.display = "none";

        // get user role data
        // if user has member role, show main page that shows conference rooms available
        // if user has admin or manager role, show admin-manager page 
        let userDocRef = db.collection("users").doc(uid);
        userDocRef.get().then((doc) => {
          if (doc.exists) {
            let userData = doc.data();
            let userRole = userData.role;
            console.log("user role: " + userRole);

            if (userRole === "member") {
              // show conference rooms available -> main page
              window.location.replace("./member.html");
            } else if (userRole === "admin"){
              // show admin-manager page
              window.location.replace("./admin.html");
            } else {window.location.replace("./manager.html");}
          } else {
            // doc.data() will be undefined in this case
            console.log("no such document!");
          }
        }).catch((error) => {
          console.log("error getting document:", error);
        });
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;

        console.log("errorCode: " + errorCode);
        console.log("errorMessage: " + errorMessage);

        // display login error msg
        loginErrorMsg.innerHTML = errorMessage;
        loginErrorMsg.style.display = "block";
      });
  })
  // !end of user login js

  // !create new user account js 
  const createAccountBtn = document.querySelector("#createBtn");

  // when user clicks on create-btn, check if passwords match first
  // if mismatch, display error msg
  // if match, hide error msg and save new user account in firebase db
  createAccountBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const passwordErrorMsg = document.querySelector("#passwordErrorMsg");
    const createAccountErrorMsg = document.querySelector("#createAccountErrorMsg");
    const newPassword = document.querySelector("#newPassword").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;

    if (newPassword !== confirmPassword) {
      passwordErrorMsg.style.display = "block";
    } else {
      passwordErrorMsg.style.display = "none";

      // password verified 
      // can now create a new account and save to firebase db
      // achieved by passing the new user's email address and password to createUserWithEmailAndPassword
      // reference: https://firebase.google.com/docs/auth/web/password-auth#web-version-8
      let newEmail = document.querySelector("#newEmail").value;
      console.log("newEmail: " + newEmail);

      firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
        .then((userCredential) => {
          // created account successfully
          console.log("user account created successfully");

          let user = userCredential.user;
          console.log("user: ", user);
          console.log("userid: ", user.uid);

          // !save user's fname, lname, and role to firebase db as a new collection called 'users'
          const fname = document.querySelector("#fname").value;
          const lname = document.querySelector("#lname").value;
          const role = document.querySelector("#roleStatus").value;

          console.log("fname: " + fname);
          console.log("lname: " + lname);
          console.log("role: " + role);

          // !documents for this user collection will be the user.uid
          // referenced: https://stackoverflow.com/questions/47871288/how-to-create-collection-in-cloud-firestore-from-javascript 
          db.doc('users/' + user.uid).set({
              fname: fname,
              lname: lname,
              role: role
            })
            .then(() => {
              console.log("document successfully written to user collection");

              // hide createAccount error msg
              createAccountErrorMsg.style.display = "none";

              // show conference rooms available -> main page
              window.location.replace("./member.html");
            })
            .catch((error) => {
              console.error("error writing document: ", error);
            });
        })
        .catch((error) => {
          // *NOTE: firebase handles the following error handling:
          // * password character length check (has to be > 6)
          // * valid email address
          // * whether email address is already in use by another account
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log("errorCode: " + errorCode);
          console.log("errorMessage: " + errorMessage);

          // display firebase create account error msg
          createAccountErrorMsg.innerHTML = errorMessage;
          createAccountErrorMsg.style.display = "block";
        });
    }
  })
  // !end of create new user account js 
})();