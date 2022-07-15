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

    // !method that display all conference rooms from firebase db
    const displayAllRooms = () => {
        const roomMsg = document.querySelector("#roomMsg");
        roomMsg.innerHTML = "All Rooms";

        const conferenceRoomTable = document.querySelector("#conferenceRoomTable");

        // need to get user's role data first
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let uid = user.uid;
                // console.log("user.uid: " + uid);

                let userDocRef = db.collection("users").doc(uid);

                userDocRef.get().then((doc) => {
                    if (doc.exists) {
                        let userData = doc.data();
                        let userRole = userData.role;

                        // now that role data is acquired, display all rooms
                        console.log("displaying all rooms");
                        console.log("==========================");
                        db.collection("conference-rooms").get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                console.log(doc.id, " => ", doc.data());

                                let data = doc.data();

                                if (data.status === "available") {
                                    let row =
                                        `
                                        <tr>
                                            <td>${data.name}</td>
                                            <td>${data.location}</td>
                                            <td>${data.size}</td>
                                            <td style="background-color: green; text-align: center;">${data.status}</td>
                                        </tr>
                                    `;
                                    conferenceRoomTable.innerHTML += row;
                                } else if (data.status === "unavailable") {
                                    let row =
                                        `
                                        <tr>
                                            <td>${data.name}</td>
                                            <td>${data.location}</td>
                                            <td>${data.size}</td>
                                            <td style="background-color: red; text-align: center;">${data.status}</td>
                                        </tr>
                                    `;
                                    conferenceRoomTable.innerHTML += row;
                                } else {
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
    }
    // invoking to display all rooms first
    displayAllRooms();
    // !end of display all conference rooms

    // !filtering based on room size js
    // get all the filter btns
    const filterBtns = document.querySelectorAll("#filterBtnsContainer > .btn");

    // iterate through filterBtns array and add a click event listener
    for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener('click', (e) => {
            // query firebase db based on the filter btn value
            let filterBtnValue = e.target.value;
            // console.log("filterBtnValue: " + filterBtnValue);

            const roomMsg = document.querySelector("#roomMsg");
            roomMsg.innerHTML = `${filterBtnValue.charAt(0).toUpperCase() + filterBtnValue.slice(1)} Rooms`;

            const conferenceRoomTable = document.querySelector("#conferenceRoomTable");

            // since we display all conference rooms first, clear conference room table 
            conferenceRoomTable.innerHTML = "";

            // 'small', 'medium', 'large' are the only valid queries, 'all' indicates to show all rooms
            if (filterBtnValue !== "all") {
                db.collection("conference-rooms").where("size", "==", filterBtnValue)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(doc.id, " => ", doc.data());

                            let data = doc.data();
                            if (data.status === "available") {
                                let row =
                                    `
                                    <tr>
                                        <td>${data.name}</td>
                                        <td>${data.location}</td>
                                        <td>${data.size}</td>
                                        <td style="background-color: green; text-align: center;">${data.status}</td>
                                    </tr>
                                `;
                                conferenceRoomTable.innerHTML += row;
                            } else if (data.status === "unavailable") {
                                let row =
                                    `
                                    <tr>
                                        <td>${data.name}</td>
                                        <td>${data.location}</td>
                                        <td>${data.size}</td>
                                        <td style="background-color: red; text-align: center;">${data.status}</td>
                                    </tr>
                                `;
                                conferenceRoomTable.innerHTML += row;
                            } else {
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
                    })
                    .catch((error) => {
                        console.log("error getting documents: ", error);
                    });
            } else {
                displayAllRooms();
            }
        })
    }
    // !end of filtering based on room size js

    // !reserve js
    const roomNameDropdown = document.querySelector("#roomNameDropdown");

    // get all the room names
    db.collection("conference-rooms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            // display only available rooms in select dropdown
            if (data.status === "available") {
                let roomOption = `<option value=${doc.id}>Name: ${data.name}, Location: ${data.location}, Size: ${data.size}</option>`;

                roomNameDropdown.innerHTML += roomOption;
            }
        });
    });

    roomNameDropdown.addEventListener('change', (e) => {
        let roomSelected = e.target.value;
        console.log("roomSelected: " + roomSelected)

        let reserveRequestBtn = document.querySelector("#reserveRequestBtn");

        // get data of the room selected
        let docRef = db.collection("conference-rooms").doc(roomSelected);
        docRef.get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                // console.log("room selected data: " + data);

                // if user wants to reserve a small room, can do so without approval from admin or manager
                if (data.size === "small") {
                    reserveRequestBtn.style.display = "block";
                    reserveRequestBtn.innerHTML = "Reserve Now";

                    // reserve now btn clicked, thus update firebase db and change room status to reserved
                    reserveRequestBtn.addEventListener('click', (e) => {
                        // console.log("reserve now clicked");

                        docRef.set({
                                name: data.name,
                                location: data.location,
                                size: data.size,
                                status: "unavailable"
                            })
                            .then(() => {
                                console.log("document successfully update!");
                                alert(`Conference Room: ${data.name} reserved successfully!`);
                                // reload page
                                location.reload();
                            })
                            .catch((error) => {
                                console.error("error updating document: ", error);
                                alert(`Could not reserve ${data.name}. Please try again.`);
                            });
                    })
                } else if (data.size === "medium") {
                    reserveRequestBtn.style.display = "block";
                    reserveRequestBtn.innerHTML = "Request Approval from Admin";

                    reserveRequestBtn.addEventListener('click', (e) => {
                        // console.log("request to admin clicked");

                        docRef.set({
                                name: data.name,
                                location: data.location,
                                size: data.size,
                                status: "request pending"
                            })
                            .then(() => {
                                console.log("document successfully updated!");
                                alert(`Submitted request for ${data.name} to admin!`);
                                // reload page
                                location.reload();
                            })
                            .catch((error) => {
                                console.error("error updating document: ", error);
                                alert(`Could not submit request for ${data.name}. Please try again.`);
                            });
                    })
                } else {
                    reserveRequestBtn.style.display = "block";
                    reserveRequestBtn.innerHTML = "Request Approval from Admin and Manager";

                    reserveRequestBtn.addEventListener('click', (e) => {
                        // console.log("request to admin and manager clicked");

                        docRef.set({
                                name: data.name,
                                location: data.location,
                                size: data.size,
                                status: "request pending"
                            })
                            .then(() => {
                                console.log("document successfully updated!");
                                alert(`Submitted request for ${data.name} to admin and manager!`);
                                // reload page
                                location.reload();
                            })
                            .catch((error) => {
                                console.error("error updating document: ", error);
                                alert(`Could not submit request for ${data.name}. Please try again.`);
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
    // !end of reserve js
})();