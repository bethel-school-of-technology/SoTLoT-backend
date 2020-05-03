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
        return res.status(200).json(recipes)
    }
    ).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });

})

// GET all saved recipes

app.get('/recipes/:user/saved', (req, res) => {

    var colRef = firestore.collection("users").doc(req.params.user).collection("saved-recipes").orderBy('timeStamp',  'desc');

    colRef.get().then(snapshot => {
        var recipes = [];
        snapshot.forEach(doc => {
            recipes.push(doc.data())
        });
        return res.status(200).json(recipes)
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

app.post('/:recipe/add/:user', (req, res) => {

    return firestore.collection('recipes').doc(req.params.recipe).get().then((doc) => {

        return firestore.collection('users').doc(req.params.user).collection('saved-recipes').add(doc.data())
            .then((newdoc) => {
                firestore.collection('users').doc(req.params.user).collection('saved-recipes')
                    .doc(newdoc.id).update({
                        id: newdoc.id,
                        timeStamp: req.body.timeStamp
                    });
                return res.status(200).json(newdoc.id);
            }).catch((error) => {
                return res.status(400).json({ "message": "Collection/Doc not found!" });
            });
    }).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });

})

//POST to add a new saved recipe

app.post('/users/newrecipe/:user', (req, res) => {

    //pull in the req.body so we have a recipe to add
    //add recipe to the user's collection
    //catch the new doc's id
    //set the field "id" in the doc to match the doc.id
    //return with the new doc.id

    let newRecipe = req.body
    return firestore.collection('users').doc(req.params.user).collection('saved-recipes').add(newRecipe)
        .then((newdoc) => {
            firestore.collection('users').doc(req.params.user).collection('saved-recipes')
                .doc(newdoc.id).update({
                    id: newdoc.id
                });
            return res.status(200).json(newdoc.id);
        }).catch((error) => {
            return res.status(400).json({ "message": "Collection/Doc not found!" });
        });
})


// PUT to edit a saved recipe

app.post('/update/:user/:recipe', (req, res) => {

    let updatedRecipe = req.body
    return firestore.collection('users').doc(req.params.user).collection('saved-recipes').doc(req.params.recipe).update(updatedRecipe)
        .then((r) => {
            return res.status(200).json(updatedRecipe.id)
        }).catch((error) => {
            return res.status(400).json({ "message": "update failed!" });
        })

})

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

//Search All Recipes

app.get('/recipes/search/:search', (req, res) => {

    var colRef = firestore.collection("recipes")

    colRef.get().then(snapshot => {
        var recipes = [];
        snapshot.forEach(docSearch => {
            let name = docSearch.data().name.toLowerCase();
            let input = req.params.search.toLowerCase();
            if(name.includes(input)) {
                recipes.push(docSearch.data())
            }
        });
        return res.status(200).json(recipes)
    }
    ).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });

})

//Search User Recipes

app.get('/recipes/search/:user/:search', (req, res) => {

    var colRef = firestore.collection("users").doc(req.params.user).collection("saved-recipes").orderBy('timeStamp',  'desc');

    colRef.get().then(snapshot => {
        var recipes = [];
        snapshot.forEach(docSearch => {
            let name = docSearch.data().name.toLowerCase();
            let input = req.params.search.toLowerCase();
            if(name.includes(input)) {
                recipes.push(docSearch.data())
            }
        });
        return res.status(200).json(recipes)
    }
    ).catch((error) => {
        return res.status(400).json({ "message": "Unable to connect to Firestore." });
    });

})


exports.api = functions.https.onRequest(app);