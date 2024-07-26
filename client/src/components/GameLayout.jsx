import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import API from "../API.mjs";
import RoundComponent from "./RoundLayout";
import GameSummaryComponent from "./GameSummaryLayout";


function Game(props)
{
    const ROUNDS = props.user ? 3 : 1;
    const [memes, setMemes] = useState([]);

    // loading = true provoca passaggio di meme parzialmente elaborati causando bug: ciò è causato
    // dalla "lentezza" della useEffect, che completa DOPO che JS renderizza il DOM
    const [loading, setLoading] = useState(true);

    // Mescola randomicamente l'array usando l'algoritmo di Fisher-Yates.
    // Per ottenere una maggiore entropia viene eseguito 3 volte.
    const arrayShuffle = (array) =>
    {
        for (let m = 0; m < 3; m++)
        {
            for (let i = array.length - 1; i > 0; i--) 
            {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        
        return array;
    }

    // Viene eseguita una sola volta, al caricamento del componente (dep = [])
    useEffect(() => 
    {
        const initialize = async () =>
        {  
            try
            {
                // Recupera 1 o 3 (utente anonimo/loggato) immagini dal DB
                const retrievedPicIds = await API.getRandomImages(ROUNDS);
                let memes_ = [];

                for (let picId of retrievedPicIds)
                {
                    // Recupera, per ogni immagine, 2 tra le didascalie corrette e altre 5 random
                    const wrongCaps = await API.getRandomCaptions(picId);
                    const rightCaps = await API.getRandMatchingCaptions(picId);

                    // Concatena didascalie giuste e sbagliate e mescola l'array risultante
                    const allCaps = rightCaps.concat(wrongCaps);
                    const shuffledCaps = arrayShuffle(allCaps);

                    // Costruisce l'oggetto meme
                    const meme = 
                    {
                        id: picId,
                        candidates: shuffledCaps
                    };
                    memes_.push(meme);
                }
                setMemes(memes_);
            }  
            catch {}       
        }

        initialize();

        // Fine caricamento: meme pronti ad essere passati
        setLoading(false);
    }, []);


        return (
        <>    
            {loading && <Spinner animation = "border"></Spinner>}
            
            {!loading && props.user && <GameComponent   memes = {memes}
                                                        rounds = {ROUNDS}
                                                        userId = {props.user.id}
            />}

            {!loading && !props.user && <GameComponent  memes = {memes}
                                                        rounds = {ROUNDS}
            />}
        </>
    );
}


function GameComponent(props)
{
    const [currentRound, setCurrentRound] = useState(0);

    // guessedMemes è un array di indici di props.memes e può avere, al più, 
    // 3 elementi nell'intervallo [0, 2]
    const [guessedMemes, setGuessedMemes] = useState([]);

    // selectedCaptions : tutte le didascalie selezionate dall'utente durante una partita
    // selectedCaption (in RoundComponent): didascalia selezionata dall'utente in un certo round
    const [selectedCaptions, setSelectedCaptions] = useState([]);

    const memes = props.memes;
    let currentMeme = null;

    // Mi assicuro che i dati passati dal Game non siano undefined, a causa della asincronicità
    // della useEffect con la quale sono stati ottenuti. Controlli analoghi sono ripetuti anche in 
    // RoundComponent
    if (memes)
        currentMeme = memes[currentRound];
    
    return (
        <>
            {currentRound < props.rounds   ? 
                <RoundComponent         rounds = {props.rounds}
                                        currentRound = {currentRound}
                                        setCurrentRound = {setCurrentRound}
                                        currentMeme = {currentMeme} 
                                        guessedMemes = {guessedMemes}
                                        setGuessedMemes = {setGuessedMemes}
                                        selectedCaptions = {selectedCaptions}
                                        setSelectedCaptions = {setSelectedCaptions}
                />  :
                <GameSummaryComponent   memes = {props.memes}
                                        guessedMemes = {guessedMemes} 
                                        selectedCaptions = {selectedCaptions}
                                        userId = {props.userId}
            /> }
        </>
    );
}


export default Game;