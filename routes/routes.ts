import userModel from "../models/userModel";
import favoritesongModel from "../models/favoritesongModel";
import favoritealbumModel from "../models/favoritealbumModel";
import favoriteartistModel from "../models/favoriteartistModel";
import favoriteplaylistModel from "../models/favoriteplaylistModel";

const jwt = require('jsonwebtoken');
const routes = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

routes.post('/hello', (res: any, req: any) => {
    res.send("Hello Boy!");
})

routes.post('/register', async (req: any, res: any) => {
    try {
        const { username, password } = req.body;
        const temp = await userModel.find({ Login: username });
        if (temp.length > 0) {
            res.json({ successfully: false });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({ Login: username, Password: hashedPassword });
            await newUser.save().catch((error: any) => { console.log(error); })
            res.json({ successfully: true });
        }
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        })
    }
})

routes.post('/login', async (req: any, res: any) => {
    try {
        const { username, password } = req.body;
        const temp = await userModel.find({ Login: username });
        if (temp.length < 1 || !await bcrypt.compare(password, temp[0].Password)) {
            res.send({
                successfully: false,
            })
        } else {
            const token = jwt.sign(temp[0]._id.toString(), 'eternal');
            res.cookie('eternaljwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({ successfully: true });
        }
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        })
    }
})

routes.get('/user', async (req: any, res: any) => {
    try {
        const cookie = req.cookies['eternaljwt'];
        const claims = jwt.verify(cookie, 'eternal');
        const objectId = new mongoose.Types.ObjectId(claims);
        const result = await userModel.find({ _id: objectId });
        res.send({
            authentification: true,
            username: result[0].Login,
        })
    } catch (error) {
        res.send({
            authentification: false,
        })
    }
})

routes.get('/logout', (req: any, res: any) => {
    res.cookie('eternaljwt', '', {
        httpOnly: true,
        maxAge: 0,
    })
    res.send({
        successfully: true,
    })
})

routes.delete('/delete', async (req: any, res: any) => {
    try {
        const claims = jwt.verify(req.cookies['eternaljwt'], 'eternal');
        const objectId = new mongoose.Types.ObjectId(claims);
        await favoritesongModel.deleteMany({ userId: objectId });
        await favoritealbumModel.deleteMany({ userId: objectId });
        await favoriteartistModel.deleteMany({ userId: objectId });
        await favoriteplaylistModel.deleteMany({ userId: objectId });
        await userModel.deleteMany({ _id: objectId });
        res.send({
            successfully: true
        })
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        });
    }
})

routes.put('/addFavorite', async (req: any, res: any) => {
    try {
        const { browseId, type } = req.body;
        const claims = jwt.verify(req.cookies['eternaljwt'], 'eternal');
        const objectId = new mongoose.Types.ObjectId(claims);
        if (objectId !== undefined) {
            let temp;
            switch (type) {
                case 'song':
                    temp = new favoritesongModel({ userId: objectId, browseId: browseId });
                    await temp.save().catch((error: any) => { console.log(error); });
                    break;
                case 'album':
                    temp = new favoritealbumModel({ userId: objectId, browseId: browseId });
                    await temp.save().catch((error: any) => { console.log(error); });
                    break;
                case 'artist':
                    temp = new favoriteartistModel({ userId: objectId, browseId: browseId });
                    await temp.save().catch((error: any) => { console.log(error); });
                    break;
                case 'playlist':
                    temp = new favoriteplaylistModel({ userId: objectId, browseId: browseId });
                    await temp.save().catch((error: any) => { console.log(error); });
                    break;
                default:
                    res.send({
                        successfully: false
                    });
                    break;
            }
            res.send({
                successfully: true
            });
        } else {
            res.send({
                successfully: false
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false,
        });
    }
});


routes.delete('/removeFavorite', async (req: any, res: any) => {
    try {
        const { browseId, type } = req.body;
        const claims = jwt.verify(req.cookies['eternaljwt'], 'eternal');
        const objectId = new mongoose.Types.ObjectId(claims);
        if (objectId != undefined) {
            switch (type) {
                case 'song':
                    await favoritesongModel.deleteMany({ userId: objectId, browseId: browseId });
                    break;
                case 'album':
                    await favoritealbumModel.deleteMany({ userId: objectId, browseId: browseId });
                    break;
                case 'artist':
                    await favoriteartistModel.deleteMany({ userId: objectId, browseId: browseId });
                    break;
                case 'playlist':
                    await favoriteplaylistModel.deleteMany({ userId: objectId, browseId: browseId });
                    break;
                default:
                    res.send({
                        successfully: false
                    });
                    break;
            }
            res.send({
                successfully: true
            });
        } else {
            res.send({
                successfully: false
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false
        });
    }
})

routes.get('/checkFavorite', async (req: any, res: any) => {
    try {
        const { browseId, type } = req.query;
        const claims = jwt.verify(req.cookies['eternaljwt'], 'eternal');
        const objectId = new mongoose.Types.ObjectId(claims);
        if (objectId !== undefined) {
            let exist = false;
            switch (type) {
                case 'song':
                    if ((await favoritesongModel.find({ userId: objectId, browseId: browseId })).length > 0) {
                        exist = true;
                    }
                    break;
                case 'album':
                    if ((await favoritealbumModel.find({ userId: objectId, browseId: browseId })).length > 0) {
                        exist = true;
                    }
                    break;
                case 'artist':
                    if ((await favoriteartistModel.find({ userId: objectId, browseId: browseId })).length > 0) {
                        exist = true;
                    }
                    break;
                case 'playlist':
                    if ((await favoriteplaylistModel.find({ userId: objectId, browseId: browseId })).length > 0) {
                        exist = true;
                    }
                    break;
            }
            res.send({
                exist: exist
            });
        } else {
            res.send({
                exist: false
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false
        });
    }
})

module.exports = routes;