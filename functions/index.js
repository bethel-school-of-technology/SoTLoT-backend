'use strict';
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors')({ origin: true });
app.use(cors);


// GET a specific recipe

app.get('/recipes/:recipe', (req, res) => {
    var docRef = firestore.collection("recipes").doc(req.params.recipe);

    docRef.get().then((doc) => {
        if (doc.exists) {
            return res.status(200).json(doc.data());
        } else {
            return res.status(400).json({ "message": "Collection not found!" });
        }
    }).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });
});

// GET a specific saved recipe

app.get('/users/:user/:recipe', (req, res) => {
    var docRef = firestore.collection("users").doc(req.params.user).collection("saved-recipes").doc(req.params.recipe);

    docRef.get().then((doc) => {
        if (doc.exists) {
            return res.status(200).json(doc.data());
        } else {
            return res.status(400).json({ "message": "Collection not found!" });
        }
    }).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });
});


// GET all recipes

app.get('/recipes', (req, res) => {
    
    var colRef = firestore.collection("recipes")
    
    colRef.get().then(snapshot => {
        var recipes = [];
        snapshot.forEach(doc => {
            recipes.push(doc.data())
        });
        return res.json(recipes)
      }
      ).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });

})

// GET all saved recipes

app.get('/recipes/:user/saved', (req, res) => {
    
    var colRef = firestore.collection("users").doc(req.params.user).collection("saved-recipes");
    
    colRef.get().then(snapshot => {
        var recipes = [];
        snapshot.forEach(doc => {
            recipes.push(doc.data())
        });
        return res.json(recipes)
      }
      ).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });

})

// GET user info

app.get('/users/:user', (req, res) => {
    var docRef = firestore.collection("users").doc(req.params.user);

    docRef.get().then((doc) => {
        if (doc.exists) {
            return res.status(200).json(doc.data());
        } else {
            return res.status(400).json({ "message": "Collection not found!" });
        }
    }).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });
});


// POST for copying/saving a recipe

// PUT to edit a saved recipe

// DELETE to remove a saved recipe

app.get('/users/:user/:recipe/delete', (req, res) => {
    var docRef = firestore.collection("users").doc(req.params.user).collection("saved-recipes").doc(req.params.recipe);

    docRef.delete().then((doc) => {
        if (doc.exists) {
            return res.status(400).json({ "message": "Recipe delete failed!" });
        } else {
            return res.status(200).json({ "message": "Recipe delete successful!" });
        }
    }).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });
});

exports.api = functions.https.onRequest(app);