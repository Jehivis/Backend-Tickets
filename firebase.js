const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('firebase/firestore');

firebase.initializeApp({
    apiKey: "OGI5NzY1MDItZmU5Ni00OTE5LWIzMGEtN2ViMTMyOGFiNzlh",
    authDomain: "reporteria-ed1f4.firebaseapp.com",
    databaseURL: "https://reporteria-ed1f4.firebaseio.com",
    projectId: "reporteria-ed1f4",
    storageBucket: "reporteria-ed1f4.appspot.com",
    messagingSenderId: "17663230382",
    appId: "1:17663230382:web:0f956c08af25906b26883f",
    //measurementId: "G-0JSCMHXRV0"
});

const auth = firebase.auth();
const db = firebase.database();
const firestore = firebase.firestore();

module.exports = { auth, db, firestore };