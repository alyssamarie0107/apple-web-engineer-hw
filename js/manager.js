// immediately invoked function expression (IIFE)
(function () {
    // !web app's firebase configuration
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
    // !end of web app's firebase configuration

    // !user logout js
    const logoutBtn = document.querySelector('#logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        firebase.auth().signOut().then(() => {
            // logout successful
            // show login page 
            window.location.replace("./login.html");
        }).catch((error) => {
            // error happened
            console.log("error with user logout: " + error);
        });
    });
    // !end of user logout js

    // !user data js -> want to fill in fname, lname, and role in welcome msg and userdropdown
    const welcomeMsg = document.querySelector("#welcomeMsg");
    const userDropdownBtn = document.querySelector("#userDropdownBtn");
    const roleDropdownItem = document.querySelector("#roleDropdownItem");
    const userInitials = document.querySelector("#userInitials");

    // get current user
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // user is signed in
            let uid = user.uid;
            // console.log("user.uid: " + uid);

            let userDocRef = db.collection("users").doc(uid);

            userDocRef.get().then((doc) => {
                if (doc.exists) {
                    let userData = doc.data();
                    console.log("user data:");
                    console.log("==========================");
                    console.log(userData);

                    // innput first name in welcome msg
                    welcomeMsg.innerHTML = `Welcome ${userData.fname}, Reserve a Conference Room`;

                    // set userdropdown to be fname, lname
                    let userFullName = `${userData.fname} ${userData.lname}`;
                    userDropdownBtn.innerHTML += userFullName;

                    let userInitials = userData.fname[0] + userData.lname[0];
                    // set user initials in userInitialsContainer
                    userInitalsContainer.innerHTML = userInitials;

                    // set userdropdown role item to be role
                    roleDropdownItem.innerHTML += userData.role;
                    userRole = userData.role;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("no such document!");
                }
            }).catch((error) => {
                console.log("error getting document:", error);
            });
        } else {
            // user is signed out
            console.log("user is signed out");
        }
    });
    // !end of user data js

    // !method that display all medium and large conference rooms with status 'requesting ' from firebase db
    const displayMedLgRoomsPending = () => {
        db.collection("conference-rooms").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                let data = doc.data();

                // display all large rooms that need approval in table
                if (data.size === "large" && (data.status === "request pending" || data.status === "request still pending" )) {
                    let row =
                        `
                        <tr>
                            <td>${data.name}</td>
                            <td>${data.location}</td>
                            <td>${data.size}</td>
                            <td style="background-color: gray; text-align: center;">${data.status}</td>
                        </tr>
                    `;
                    conferenceRoomTable.innerHTML += row;
                }
            });
        });
    }
    displayMedLgRoomsPending();

    // !approve room js
    const roomNameDropdown = document.querySelector("#roomNameDropdown");

    // get all the room names that are pending
    db.collection("conference-rooms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            // display rooms that need approval in select dropdown
            if (data.size === "large" && (data.status === "request pending" || data.status === "request still pending" )) {
                let roomOption = `<option value=${doc.id}>Name: ${data.name}, Location: ${data.location}, Size: ${data.size}</option>`;

                roomNameDropdown.innerHTML += roomOption;
            }
        });
    });

    roomNameDropdown.addEventListener('change', (e) => {
        let roomSelected = e.target.value;
        console.log("roomSelected: " + roomSelected)

        let approveConfirmBtn = document.querySelector("#approveConfirmBtn");

        // get data of the room selected
        let docRef = db.collection("conference-rooms").doc(roomSelected);
        docRef.get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                // console.log("room selected data: " + data);

                // large rooms are the only rooms that need approval from managers, change room status to unavailable from 'request pending'
                if (data.size === "large") {
                    // reserve now btn clicked, thus update firebase db and change room status to reserved
                    approveConfirmBtn.addEventListener('click', (e) => {
                        console.log("approve clicked");

                        docRef.set({
                                name: data.name,
                                location: data.location,
                                size: data.size,
                                status: "unavailable"
                            })
                            .then(() => {
                                console.log("document successfully updated!");
                                alert(`Conference Room: ${data.name} approved successfully by manager!`);
                                // reload page
                                location.reload();
                            })
                            .catch((error) => {
                                console.error("error updating document: ", error);
                                alert(`Could not approve ${data.name}. Please try again.`);
                            });
                    })
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("no such document!");
            }
        }).catch((error) => {
            console.log("error getting document:", error);
        });
    })
    // !end of approve room js

    // !add room js
    let addConfirmBtn = document.querySelector("#addConfirmBtn");

    addConfirmBtn.addEventListener('click', (e) => {
        // get new room info added by user
        const nameInput = document.querySelector("#nameInput").value;
        const locationInput = document.querySelector("#locationInput").value;
        const sizeInput = document.querySelector("#sizeInput").value;
        const statusInput = document.querySelector("#statusInput").value;

        // console.log("nameInput: " + nameInput);
        // console.log("locationInput: " + locationInput);
        // console.log("sizeInput: " + sizeInput);
        // console.log("statusInput: " + statusInput);

        // add room to firebase db
        // Add a new document with a generated id.
        db.collection("conference-rooms").add({
            name: nameInput,
            location: locationInput,
            size: sizeInput,
            status: statusInput
        })
        .then((docRef) => {
            console.log("document written with ID: ", docRef.id);
            alert(`Conference Room ${nameInput} added successfully!`);
            location.reload();
        })
        .catch((error) => {
            console.error("error adding document: ", error);
            alert(`Could not add Conference Room ${nameInput}. Please try again.`);
        });
    })
    // !end of large room
})();