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

// GET a specific copied recipe


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

// GET all copied recipes

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

// POST for copying a recipe

// PUT to edit a copied recipe

// DELETE to remove a copied recipe

exports.api = functions.https.onRequest(app);