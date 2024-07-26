import sqlite from 'sqlite3';


// Funzione che apre il DB 
export const db = new sqlite.Database('meme_game.db', (err) => 
{
    if (err) 
        throw err;
});