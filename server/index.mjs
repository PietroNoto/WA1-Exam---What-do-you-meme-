import express from 'express';
import morgan from "morgan";
import cors from "cors";
import { check, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import { addGame, getPicCaptions, getRandomCaptions, getMatchingCaptions, getRandomImages, getUserGames } from './memeDao.mjs';
import { getUser } from './userDao.mjs';


// init express
const app = new express();
const port = 3001;

//CORS setup
const corsOptions = 
{
    origin: "http://127.0.0.1:5173",
    optionsSuccessStatus: 200,
    credentials: true
}

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.static("pics"));


// Configurazione passport
passport.use(new LocalStrategy(async function verify(username, password, cb) 
{
    const user = await getUser(username, password);
    if (!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) 
{
    cb(null, user);
});
  
passport.deserializeUser(function (user, cb) 
{ 
    return cb(null, user);
});

const isLoggedIn = (req, res, next) => 
{
    
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({error: 'Not authorized'});
}

app.use(session(
{
    secret: "Va bene, tieniti pure i tuoi segreti",
    // Imposto la durata del cookie di sessione a 30min, per mantenere un utente loggato più a lungo
    cookie: {maxAge: 1000 * 60 * 30},
    resave: false,
    saveUninitialized: false,
}));
  
app.use(passport.authenticate('session'));


/* ROUTES */


// Trova n (1 oppure 3) immagini random dal database (senza ripetizioni)
app.get("/api/pics/rand/:n", async (req, res) =>
{
    try
    {
        let picIds = await getRandomImages(req.params.n);
        res.json(picIds);
    }
    catch
    {
        res.status(500).end();
    }
});


// Trova 5 didascalie random tra quelle che NON si abbinano all'immagine pic_id
app.get("/api/captions/exclude/:pic_id", async (req, res) =>
{
    try
    {
        let captions = await getRandomCaptions(req.params.pic_id);
        if (captions.error)
            res.status(404).json(captions);
        else
            res.json(captions);
    }
    catch
    {
        res.status(500).end();
    }
});


// Trova 2 tra le didascalie associate all'immagine picId prese in modo random
app.get("/api/pics/:pic_id/rand/captions", async (req, res) =>
{
    try
    {
        let captions = await getMatchingCaptions(req.params.pic_id);
        if (captions.error)
            res.status(404).json(captions);
        else
            res.json(captions);
    }
    catch
    {
        res.status(500).end();
    }
});


// Trova tutte le didascalie associate a un'immagine: /api/pics/:pic_id/captions
app.get("/api/pics/:pic_id/captions", async(req, res) =>
{
    try
    {
        let captions = await getPicCaptions(req.params.pic_id);
        if (captions.error)
            res.status(404).json(captions);
        else
            res.json(captions);
    }
    catch
    {
        res.status(500).end();
    }
});


// Trova tutte le partite giocate dall'utente con id u_id (deve essere loggato)
app.get("/api/users/:u_id/games", isLoggedIn, async(req, res) =>
{
    try
    {
        let games = await getUserGames(req.params.u_id);
        if (games.error)
            res.status(404).json(games);
        else
            res.json(games);
    }
    catch
    {
        res.status(500).end();
    }
});


// Salva una partita nel DB: /api/users/:u_id/games
app.post(
    "/api/users/:u_id/games",
    isLoggedIn,
    [check("u_id").isNumeric(), check("score").isNumeric()], 
    async(req, res) => 
{
    let errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(422).json({errors: errors.array()});
    else
    {
        try
        {
            const lastId = await addGame(req.body);
            res.status(201).location(lastId).end();
        }
        catch (err)
        {
            res.status(500).end();
        }
    }
});


// Autentica un utente e crea una sessione: /api/sessions
app.post("/api/sessions", 
    [check("username").isEmail()],
    function(req, res, next) 
{
    passport.authenticate('local', (err, user, info) => 
    {
        if (err)
            return next(err);
        if (!user) 
            return res.status(401).send(info);
        req.login(user, (err) => 
        {
            if (err)
                return next(err);
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});


// Recupera la sessione corrente (utente loggato al momento): /api/sessions/current
app.get("/api/sessions/current", (req, res) => 
{
    if(req.isAuthenticated())
        res.json(req.user);
    else
        res.status(401).json({error: 'Not authenticated'});
});


// Effettua il logout cancellando la sessione di login corrente: /api/sessions/current
app.delete("/api/sessions/current", (req, res) => 
{
    req.logout(() => res.end());
});


// activate the server
app.listen(port, () => 
{
    console.log(`Server listening at http://localhost:${port}`);
});