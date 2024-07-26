import { db } from "./db.mjs";

// Trova n (1 oppure 3) immagini random dal database (senza ripetizioni)
const getRandomImages = (n) =>
{
    return new Promise((resolve, reject) =>
    {
        const query = "SELECT DISTINCT pic_id FROM MEMES ORDER BY random() LIMIT ?";
        db.all(query, [n], (err, rows) =>
        {
            if (err)
                reject(err);
            else
            {
                let picIds = rows.map((r) => Number(r.pic_id));
                resolve(picIds);
            }
        });
    })
}


// Trova 5 didascalie random tra quelle non abbinate all'immagine con id pic_id
const getRandomCaptions = (picId) =>
{
    return new Promise((resolve, reject) =>
    {
        const query = "SELECT DISTINCT caption FROM CAPTIONS WHERE cap_id NOT IN (SELECT cap_id FROM MEMES WHERE pic_id = ?) ORDER BY random() LIMIT 5";
        db.all(query, [picId], (err, rows) =>
        {
            if (err)
                reject(err);
            else if (rows === undefined)
                resolve({error: "Pic not found"});
            else
            {
                let captions = rows.map((r) => r.caption);
                resolve(captions);
            }
        });
    });
}


// Trova 2 tra le didascalie associate all'immagine picId prese in modo random
const getMatchingCaptions = (picId) =>
{
    return new Promise((resolve, reject) => 
    {
        const query = "SELECT caption FROM CAPTIONS WHERE cap_id IN (SELECT DISTINCT cap_id FROM MEMES WHERE pic_id = ? ORDER BY random() LIMIT 2)";
        db.all(query, [picId], (err, rows) =>
        {
            if (err)
                reject(err);
            else if (rows === undefined)
                resolve({error: "Pic not found"});
            else
            {
                let captions = rows.map((r) => r.caption);
                resolve(captions);
            }
        });
    });
}

// Trova tutte le didascalie associate all'immagine con id picId
const getPicCaptions = (picId) =>
{
    return new Promise((resolve, reject) =>
        {
            const query = "SELECT caption FROM CAPTIONS WHERE cap_id IN (SELECT cap_id FROM MEMES WHERE pic_id = ?)";
            db.all(query, [picId], (err, rows) => 
            {
                if (err)
                    reject(err);
                else if (rows.length === 0)
                    resolve({error: "Pic not found"});
                else
                {
                    let captions = rows.map((r) => r.caption);
                    resolve(captions);
                }
            });
        });
}

// Trova tutte le partite giocate dall'utente uId nella tabella GAMES
const getUserGames = (uId) => 
{
    return new Promise((resolve, reject) =>
        {
            const query = "SELECT * FROM GAMES WHERE u_id = ?";
            db.all(query, [uId], (err, rows) => 
            {
                if (err)
                    reject(err);
                else if (rows === undefined)
                    resolve({error: "User not found"});
                else
                    resolve(rows);
            });
        });
}

// Inserisce nella tabella GAMES l'ultima partita giocata (oggetto game)
const addGame = (game) =>
{
    return new Promise((resolve, reject) =>
        {
            const query = "INSERT INTO GAMES(u_id, score, timestamp, pic_ids) VALUES (?, ?, ?, ?)";
            db.run(query, [game.u_id, game.score, game.timestamp, game.pic_ids], function (err) 
            {
                if (err)
                    reject(err);
                else
                    resolve(this.lastID);
            });
        });
}

export { getRandomImages, getRandomCaptions, getMatchingCaptions, getPicCaptions, getUserGames, addGame };