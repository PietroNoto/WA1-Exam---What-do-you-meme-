import { useEffect } from "react";
import dayjs from "dayjs";
import { Row, Col, Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import API from "../API.mjs";


function GameSummaryComponent(props)
{
    // OPZIONALE: aggiunto timestamp ad ogni partita, in formato di default,
    // che consente di visualizzare orario, giorno, mese, anno della partita

    /*  NOTA 1: a causa della doppia esecuzione della useEffect in modalità dev, 
        la richiesta POST associata a saveGame verrà eseguita due volte.
        Per evitare che vengano scritte due entry nel DB, la tabella GAMES ha come 
        chiave primaria la coppia (userId, timestamp) che garantisce il rispetto del
        costraint di unicità: la prima richiesta ha successo e viene fatto l'inserimento
        nella tabella GAMES; la seconda, in virtù di tale costraint, restituisce codice 500,
        esclusivamente in modalità dev */

    /*  NOTA 2: per garantire l'unicità del timestamp, esso viene generato fuori dalla useEffect
        per evitare che timestamp differenti portino alla scrittura con successo di due entry 
        relative alla stessa partita (il DB non può identificare questa situazione!) */
    const timestamp = dayjs().format();
    const score = 5 * props.guessedMemes.length;
    const imgPath = "http://localhost:3001/img";

    // Rispettivamente meme indovinati e le loro didascalie
    const toBeShownMemes = props.memes.filter((_, index) => props.guessedMemes.includes(index));
    const toBeShownCaps = props.selectedCaptions.filter((_, index) => props.guessedMemes.includes(index));
    
    // Serve a caricare nel server i dati della partita appena giocata
    useEffect(() =>
    {
        // Costruisce l'oggetto game con i dati della partita
        const makeGame = () =>
        {
            // Effettua una "serializzazione" dei meme, giusti o sbagliati:
            // ids = [<picIdRound1><g/n>,<picIdRound2><g/n>,<picIdRound3><g/n>],
            // g = guessed, n = not guessed

            let serialIds = props.memes
                .map((meme, index) =>
                {
                    let guessed = "n";
                    if (props.guessedMemes.includes(index))
                        guessed = "g";
                    let serMeme = meme.id.toString() + guessed;

                    return serMeme;
                })
                .toString();
    
            let game =
            {
                u_id: props.userId,
                score: score,
                timestamp: timestamp,
                pic_ids: serialIds
            };

            return game;
        }
        
        // Carica la partita appena creata nel server
        const saveGame = async (game) =>
        {
            try
            {
                await API.saveGame(game);
            }
            catch (err) {}
        }
        
        let game = makeGame();
        saveGame(game);
    }, [])
    

    return (
        <>
            <Row>
                <h3>Hai totalizzato {score} punti!</h3>
            </Row>

            <Row className = "mt-4">
                <h4>I meme che hai indovinato:</h4>
            </Row>

            <Row>
                {toBeShownMemes.length === 0 && <h4>Purtroppo non hai indovinato alcun meme. Ritenta!</h4> }

                {toBeShownMemes.length > 0 && toBeShownMemes.map((meme, index) => 
                    <Card key = {index} className = "mx-auto mt-2" style = {{ width: '25rem', height: "20rem" }}>
                        <Card.Img variant = "top" 
                            src = {imgPath + meme.id + ".jpg"}
                            height = {220}
                        >
                        </Card.Img>

                        <Card.Title className = "mx-auto mt-2">
                            <Badge bg = "success">5 punti</Badge>
                        </Card.Title>

                        <Card.Text className = "mx-auto">
                            {toBeShownCaps[index]}
                        </Card.Text>
                    </Card>)}
            </Row>

            <Row className = "mt-5">
                <Col>
                    <div className = "mx-auto">
                        <Link to = "/" className = "btn btn-primary main-btn ms-3">Torna alla home</Link>
                    </div>
                </Col>
            </Row>
        </>
    );
}


export default GameSummaryComponent;