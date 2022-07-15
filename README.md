# apple-web-engineer-hw

## Description
Website that is a conference room reservation system.

## General Requirements 
- [x] Application has a frontend UI and backend API.
- [x] Implemented in any lanugages, framework, data storage, or tools.
    - **Stack used:**
        - HTML
        - CSS
        - JavaScript
        - Bootstrap
    - **Database used:**
        - Firebase's Cloud Firestore 
        - Chose this Cloud Firestore  the Firebase's Realtime Database because it builds on the successes of the Realtime Database, but with a new, more intuitive data model. Also features richer, faster quieries and scales further than the Realtime Database. 
- [x] Supports the following three roles:
    - **Member:** able to reserve a room.
    - **Admin:** approves/denies room reservations.
    - **Faculty Manager:** approves/denies room reservations

- [x] Suppors the following three rooms:
    - **Small room:** user with any role can book it if available.
    - **Medium room:** like small room, but requires admin to approve.
    - **Large room:** like medium room, but requires additional approval from a faculty manager (i.e. needs admin & faculty approval).

## Functional Requirements (required)
- [x] Has a simple login screen with username and password
- [x] Page that shows all rooms with some details like name, location, and status of a room
- **NOTE:** Member can reserve a room if:
    - A small room is available (recall users with this Member role does not need approval to book this room).
    - A medium room is available and gets an approval from an Admin.
    - A large room is available but will require approvals from both an Admin and Faculty Manager.

## Other Functional Requirements (optional)
- User registration page
    - [x] Implemented a user registration modal instead
- [x] Room detail page
    - When user logins successfully, shows a page with all rooms and their details
- [ ] Conference room management
    - Add room [x]
    - Remove room [ ]
    - Edit room [ ]
    - NOTE: only admin and manager can do this, not members

## Special Feature
- [x] Add filter by size for conference table

## For Testing
- **Login Info:**
    - Member Login:
        - username: member@apple.com
        - pw: hireme1
    - Admin Login:
        - username: admin@apple.com
        - pw: hireme2
    - Manager Login:
        - username: manager@apple.com
        - pw: hireme3
