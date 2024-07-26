const SERVER_URL = "http://localhost:3001";


// Trova n (1 oppure 3) immagini random dal database (senza ripetizioni)
const getRandomImages = async (n) =>
{
    const URL = SERVER_URL + "/api/pics/rand/" + n;
    const response = await fetch(URL);

    if (response.ok)
    {
        const picIds = await response.json();
        return picIds;
    }
    else
        throw new Error()
}


// Trova 5 didascalie random tra quelle che NON si abbinano all'immagine pic_id
const getRandomCaptions = async (picId) =>
{
    const URL = SERVER_URL + "/api/captions/exclude/" + picId;
    const response = await fetch(URL);

    if (response.ok)
    {
        const captions = await response.json();
        return captions;
    }
    else
        throw new Error(response.statusText);
}


// Trova 2 tra le didascalie associate all'immagine picId prese in modo random
const getRandMatchingCaptions = async (picId) =>
{
    const URL = SERVER_URL + "/api/pics/" + picId + "/rand/captions";
    const response = await fetch(URL);

    if (response.ok)
    {
        const captions = await response.json();
        return captions;
    }
    else
        throw new Error(response.statusText);
}


// Trova tutte le didascalie associate a un'immagine
const getMatchingCaptions = async (picId) =>
{
    const URL = SERVER_URL + "/api/pics/" + picId + "/captions";
    const response = await fetch(URL);

    if (response.ok)
    {
        const captions = await response.json();
        return captions;
    }
    else
        throw new Error(response.statusText);
}


// Trova tutte le partite giocate dall'utente con id uId
const getUserGames = async (uId) =>
{
    const URL = SERVER_URL + "/api/users/" + uId + "/games";
    const response = await fetch(URL, {credentials: "include"});

    if (response.ok)
    {
        const games = await response.json();
        return games;
    }
    else
        throw new Error(response.statusText);
} 


// Salva una partita giocata dall'utente u_id nel DB
const saveGame = async (game) =>
{
    const URL = SERVER_URL + "/api/users/" + game.u_id + "/games";
    const response = await fetch(URL,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(
                {
                    u_id: game.u_id,
                    score: game.score,
                    timestamp: game.timestamp,
                    pic_ids: game.pic_ids
                }
            ),
            credentials: "include"
        }
    );
    if (response.ok)
        return null;
    else
    {
        const errMsg = await response.json();
        throw errMsg;
    }
}


// Effettua il login (se le credenziali sono giuste) di un utente dato username e password
const logIn = async (username, password) =>
{
    const URL = SERVER_URL + "/api/sessions";
    const response = await fetch(URL, 
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify(
                {
                    username: username,
                    password: password
                }
            )
        }
    );
    if (response.ok)
    {
        const user = await response.json();
        return user;
    }
    else
    {
        const errMsg = await response.text();
        throw errMsg;
    }
}


// Ritorna la sessione di login corrente (informazioni utente)
const getUserInfo = async () =>
{
    const URL = SERVER_URL + "/api/sessions/current";
    const response = await fetch(URL, { credentials: "include" });
    const user = await response.json();
    if (response.ok)
        return user;
    else
        throw new Error(response.statusText);
}


//Cancella la sessione di login corrente, effettuando il logout dell'utente
const logOut = async () =>
{
    const URL = SERVER_URL + "/api/sessions/current"
    const response = await fetch(URL, 
        {
            method: "DELETE", 
            credentials: "include"
        }
    );
    if (response.ok)
        return null;
}


const API = { getRandomImages, getRandomCaptions, getRandMatchingCaptions, getMatchingCaptions, getUserGames, saveGame, logIn, getUserInfo, logOut };
export default API;