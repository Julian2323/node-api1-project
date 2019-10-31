const db = require('./data/db');
const express = require('express');


const server = express();


server.listen(4000, () => {
    console.log('=== server listening on port 4000 ===');
});


server.use(express.json());



server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ message: 'User object must contain a name and bio.'}).end()

    }   else {
            db.insert(user)
                .then(id => {
                    res.status(201).json({ success: true, ...user });
                })
                .catch(err => {
                    res.status(500).json({ success: false, err});
                })
    }

});


server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: "The user with the specified ID does not exist."})
        })
});

server.get('/api/users/:id', (req, res) => {
    const id  = req.params.id;

    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ err: 'That user ID does not exist on this server.'});
            }   else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({message: "The users information could not be retrieved."})
        })
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(204).end();
            }   else {
                res.status(404).json({message: "The user with the specified ID does not exist."});
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, err });
        });
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userInfo = req.body;

    db.update(id, userInfo)
        .then(users => {
            if(users) {
                res.status(200).json({ success: true, users });
            }   else {
                res.status(400).json({ success: false, message: `id ${id} does not exist` });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, err });
        });
});


