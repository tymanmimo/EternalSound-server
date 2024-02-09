import { get_album, get_song, search, get_playlist, get_artist, get_search_suggestions, get_artist_albums, get_album_browse_id } from "libmuse";
import favoritesongModel from "../models/favoritesongModel";
import favoritealbumModel from "../models/favoritealbumModel";
import favoriteartistModel from "../models/favoriteartistModel";
import favoriteplaylistModel from "../models/favoriteplaylistModel";

const jwt = require('jsonwebtoken');
const mroutes = require('express').Router();
const mongoose = require('mongoose');

mroutes.get('/searchSongs', async (req: any, res: any) => {
    const { query } = req.query;
    let tempID: number = 1;
    let result: {}[] = [];
    await search(query, { filter: 'songs' })
        .then((data: any) => {
            if (data.categories.length == 0) {
                result.push({ successfull: false });
            } else {
                result.push({ successfull: true });
                data.categories[0].results.forEach((temp: {
                    artists: any;
                    title: any;
                    duration_seconds: any;
                    thumbnails: any;
                    videoId: any;
                }) => {
                    if (temp.duration_seconds < 600)
                        result.push({
                            id: tempID,
                            videoId: temp.videoId,
                            preview: temp.thumbnails[temp.thumbnails.length - 1].url,
                            duration: temp.duration_seconds,
                            title: temp.title,
                            artist: temp.artists[0].name
                        })
                    tempID += 1;
                });
            }
            res.send(result);
        })
        .catch((error) => {
            return res.status(404).send({
                error: 'Server error'
            })
        });
});

mroutes.get('/getSong', async (req: any, res: any) => {
    const { videoId } = req.query;
    try {
        await get_song(videoId)
            .then((data) => {
                res.send({
                    url: data.formats[0].url
                });
            })
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        })
    }
});

mroutes.get('/searchAlbums', async (req: any, res: any) => {
    const { query } = req.query;
    let result: {}[] = [];
    await search(query, { filter: 'albums' })
        .then((data: any) => {
            if (data.categories.length == 0) {
                result.push({ successfull: false });
            } else {
                result.push({ successfull: true });
                let tempID = 1;
                data.categories[0].results.forEach((temp: {
                    title: any;
                    artists: any;
                    thumbnails: any;
                    browseId: any;
                    year: any;
                }) => {
                    result.push({
                        id: tempID,
                        title: temp.title,
                        artist: temp.artists[0].name,
                        thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                        browseId: temp.browseId,
                        year: temp.year
                    })
                    tempID += 1;
                });
            }
            res.send(result);
        })
        .catch((error) => {
            return res.status(404).send({
                error: 'Server error'
            })
        });
});

mroutes.get('/getAlbumList', async (req: any, res: any) => {
    const { browseId } = req.query;
    let result: {}[] = [];
    let tempID: number = 1;
    try {
        await get_album(browseId)
            .then((data) => {
                data.tracks.forEach((temp: {
                    title: any;
                    duration_seconds: any;
                    videoId: any;
                }) => {
                    result.push({
                        id: tempID,
                        videoId: temp.videoId,
                        duration: temp.duration_seconds,
                        title: temp.title,
                    })
                    tempID += 1;
                });
                res.send(result);
            });
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        })
    }
});

mroutes.get('/searchPlaylists', async (req: any, res: any) => {
    const { query } = req.query;
    let result: {}[] = [];
    await search(query, { filter: 'playlists' })
        .then((data: any) => {
            if (data.categories.length == 0) {
                result.push({ successfull: false });
            } else {
                result.push({ successfull: true });
                let tempID = 1;
                data.categories[0].results.forEach((temp: {
                    title: any;
                    authors: any;
                    thumbnails: any;
                    browseId: any;
                    songs: any;
                }) => {
                    if (temp.songs != null) {
                        result.push({
                            id: tempID,
                            title: temp.title,
                            author: temp.authors[0].name,
                            thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                            browseId: temp.browseId
                        })
                        tempID += 1;
                    }
                });
            }
            res.send(result);
        })
        .catch((error) => {
            return res.status(404).send({
                error: 'Server error'
            })
        });
});

mroutes.get('/getPlaylist', async (req: any, res: any) => {
    const { browseId } = req.query;
    let result: {}[] = [];
    let tempID: number = 1;
    try {
        await get_playlist(browseId)
            .then((data) => {
                data.tracks.forEach((temp: {
                    title: any;
                    duration_seconds: any;
                    videoId: any;
                    artists: any;
                    thumbnails: any;
                }) => {
                    result.push({
                        id: tempID,
                        videoId: temp.videoId,
                        duration: temp.duration_seconds,
                        title: temp.title,
                        artists: temp.artists[0].name,
                        thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url
                    })
                    tempID += 1;
                });
                res.send(result);
            });
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        })
    }
});

mroutes.get('/searchArtists', async (req: any, res: any) => {
    const { query } = req.query;
    let result: {}[] = [];
    await search(query, { filter: 'artists' })
        .then((data: any) => {
            if (data.categories.length == 0) {
                result.push({ successfull: false });
            } else {
                result.push({ successfull: true });
                let tempID = 1;
                data.categories[0].results.forEach((temp: {
                    name: any;
                    subscribers: any;
                    thumbnails: any;
                    browseId: any;
                }) => {
                    result.push({
                        id: tempID,
                        name: temp.name,
                        subscribers: temp.subscribers,
                        thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                        browseId: temp.browseId
                    })
                    tempID += 1;
                });
            }
            res.send(result);
        })
        .catch((error) => {
            return res.status(404).send({
                error: 'Server error'
            })
        });
});

mroutes.get('/getArtist', async (req: any, res: any) => {
    const { browseId } = req.query;
    try {
        const data = await get_artist(browseId);
        const songs: any = [];
        let albums: any = [];
        let singles: any = [];
        let tempID = 1;
        if (data.songs != undefined)
            if (data.songs.browseId != null)
                await get_playlist(data.songs.browseId).then((dataPlaylist) => {
                    dataPlaylist.tracks.forEach((temp: {
                        artists: any;
                        title: any;
                        duration_seconds: any;
                        thumbnails: any;
                        videoId: any;
                    }) => {
                        songs.push({
                            id: tempID,
                            videoId: temp.videoId,
                            preview: temp.thumbnails[temp.thumbnails.length - 1].url,
                            duration: temp.duration_seconds,
                            title: temp.title,
                            artist: temp.artists[0].name
                        })
                        tempID += 1;
                    });
                });
        if (data.albums != undefined)
            if (data.albums.browseId != null && data.albums.params != null)
                await get_artist_albums(data.albums.browseId, data.albums.params).then((albumsData) => {
                    albumsData.results.forEach((temp: {
                        title: any;
                        artists: any;
                        thumbnails: any;
                        browseId: any;
                        year: any;
                    }) => {
                        albums.push({
                            title: temp.title,
                            artist: data.name,
                            thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                            browseId: temp.browseId,
                            year: temp.year
                        })
                    });
                })
            else
                data.albums.results.forEach((temp: {
                    title: any;
                    artists: any;
                    thumbnails: any;
                    browseId: any;
                    year: any;
                }) => {
                    albums.push({
                        title: temp.title,
                        artist: data.name,
                        thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                        browseId: temp.browseId,
                        year: temp.year
                    })
                });
        if (data.singles != undefined)
            if (data.singles.browseId != null && data.singles.params != null)
                await get_artist_albums(data.singles.browseId, data.singles.params).then((singlesData) => {
                    singlesData.results.forEach((temp: {
                        title: any;
                        artists: any;
                        thumbnails: any;
                        browseId: any;
                        year: any;
                    }) => {
                        singles.push({
                            title: temp.title,
                            artist: data.name,
                            thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                            browseId: temp.browseId,
                            year: temp.year,
                            singles: true,
                        })
                    });
                })
            else
                data.singles.results.forEach((temp: {
                    title: any;
                    artists: any;
                    thumbnails: any;
                    browseId: any;
                    year: any;
                }) => {
                    singles.push({
                        title: temp.title,
                        artist: data.name,
                        thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                        browseId: temp.browseId,
                        year: temp.year,
                        singles: true,
                    })
                });
        const artistData = {
            name: data.name,
            subscribers: data.subscribers,
            thumbnail: data.thumbnails[data.thumbnails.length - 1].url,
            songs: songs,
            albums: albums,
            singles: singles,
        }
        res.send(artistData);
    } catch (error) {
        return res.status(404).send({
            error: 'Server error'
        })
    }
});

mroutes.get('/getFavoriteSongs', async (req: any, res: any) => {
    try {
        const token = req.cookies['eternaljwt'];
        if (!token) {
            return res.status(404).send({
                successfully: false
            });
        }
        const claims = jwt.verify(token, 'eternal');
        if (!claims) {
            return res.status(404).send({
                successfully: false
            });
        }
        const userId = new mongoose.Types.ObjectId(claims);
        const songsIdQueryResult = await favoritesongModel.find({ userId: userId });
        const songsId = songsIdQueryResult.map((item: { browseId: any; }) => item.browseId);
        const trackList = [];
        if (songsId.length > 0) {
            trackList.push({
                successfully: true
            });
            for (let i = 0; i < songsId.length; i++) {
                const temp = await (await get_song(songsId[i])).videoDetails;
                trackList.push({
                    id: i + 1,
                    videoId: temp.videoId,
                    preview: temp.thumbnail.thumbnails[temp.thumbnail.thumbnails.length - 1].url,
                    duration: temp.lengthSeconds,
                    title: temp.title,
                    artist: temp.author
                });
            }
        } else {
            trackList.push({
                successfully: false
            });
        }
        res.send(trackList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false
        });
    }
});


mroutes.get('/getFavoriteAlbums', async (req: any, res: any) => {
    try {
        const token = req.cookies['eternaljwt'];
        if (!token) {
            return res.status(404).send({
                successfully: false
            });
        }
        const claims = jwt.verify(token, 'eternal');
        if (!claims) {
            return res.status(404).send({
                successfully: false
            });
        }
        const userId = new mongoose.Types.ObjectId(claims);
        const albumsIdQueryResult = await favoritealbumModel.find({ userId: userId });
        const albumsId = albumsIdQueryResult.map((item: { browseId: any; }) => item.browseId);
        const albumList = [];
        if (albumsId.length > 0) {
            albumList.push({
                successfully: true
            });
            for (const albumId of albumsId) {
                const temp = await get_album(albumId);
                albumList.push({
                    title: temp.title,
                    artist: temp.artists[0].name,
                    thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                    browseId: temp.id,
                    year: temp.year
                });
            }
        } else {
            albumList.push({
                successfully: false
            });
        }
        res.send(albumList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false
        });
    }
});


mroutes.get('/getFavoritePlaylists', async (req: any, res: any) => {
    try {
        const token = req.cookies['eternaljwt'];
        if (!token) {
            return res.status(404).send({
                successfully: false
            });
        }
        const claims = jwt.verify(token, 'eternal');
        if (!claims) {
            return res.status(404).send({
                successfully: false
            });
        }
        const userId = new mongoose.Types.ObjectId(claims);
        const playlistsIdQueryResult = await favoriteplaylistModel.find({ userId: userId });
        const playlistsId = playlistsIdQueryResult.map((item: { browseId: any; }) => item.browseId);
        const playlists = [];
        if (playlistsId.length > 0) {
            playlists.push({
                successfully: true
            });
            for (const playlistId of playlistsId) {
                const temp = await get_playlist(playlistId);
                playlists.push({
                    title: temp.title,
                    author: temp.authors[0].name,
                    thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                    browseId: playlistId
                });
            }
        } else {
            playlists.push({
                successfully: false
            });
        }
        res.send(playlists);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false
        });
    }
});


mroutes.get('/getFavoriteArtists', async (req: any, res: any) => {
    try {
        const token = req.cookies['eternaljwt'];
        if (!token) {
            return res.status(404).send({
                successfully: false
            });
        }
        const claims = jwt.verify(token, 'eternal');
        if (!claims) {
            return res.status(404).send({
                successfully: false
            });
        }
        const userId = new mongoose.Types.ObjectId(claims);
        const artistsIdQueryResult = await favoriteartistModel.find({ userId: userId });
        const artistsId = artistsIdQueryResult.map((item: { browseId: any; }) => item.browseId);
        const artists = [];
        if (artistsId.length > 0) {
            artists.push({
                successfully: true
            });
            for (const artistId of artistsId) {
                const temp = await get_artist(artistId);
                artists.push({
                    name: temp.name,
                    subscribers: `${temp.subscribers} subscribers`,
                    thumbnails: temp.thumbnails[temp.thumbnails.length - 1].url,
                    browseId: artistId
                });
            }
        } else {
            artists.push({
                successfully: false
            });
        }
        res.send(artists);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            successfully: false
        });
    }
});


module.exports = mroutes;