import { useState } from "react";
import { Row, Col, Badge, Image } from "react-bootstrap";

import TimerComponent from "./Timer";
import FormComponent from "./Form";
import RoundResultComponent from "./RoundResultLayout";


function RoundComponent(props)
{
    const [currentRoundEnded, setCurrentRoundEnded] = useState(false);
    const [selectedCaption, setSelectedCaption] = useState("");
    const [timeExpired, setTimeExpired] = useState(false);
    let score = 0;

    // Per utenti anonimi (rounds = 1) non ha senso calcolare lo score
    if (props.rounds === 3)
        score = 5 * props.guessedMemes.length;
        
    const currentMeme = props.currentMeme;
    let picId = null;
    let imgName = null;
    let captions = [];

    if (currentMeme)
    {
        picId = currentMeme.id;
        captions = currentMeme.candidates;
        imgName = "http://localhost:3001/img" + picId + ".jpg";
    }
    
    return (
        <>
            <Row>
                <Col>{ props.rounds === 3 && 
                    <>
                        <h3>Round {props.currentRound + 1} di 3</h3>
                        <h4>
                            Punteggio: 
                            <Badge className = "score-badge ms-2" bg = "primary">{score}</Badge>
                        </h4>
                    </>}
                </Col>
            </Row>

            <Row>
                 <Col>
                        {!currentRoundEnded && 
                            <TimerComponent     currentRound = {props.currentRound}
                                                currentRoundEnded = {currentRoundEnded}
                                                setCurrentRoundEnded = {setCurrentRoundEnded} 
                                                setTimeExpired = {setTimeExpired}
                                                selectedCaptions = {props.selectedCaptions}
                                                setSelectedCaptions = {props.setSelectedCaptions}
                        />}
                </Col>
            </Row>

            <Row>
                <Col className = "mt-2">
                    <Image src = {imgName} width = {500} thumbnail></Image>
                </Col>

                <Col>
                    {!currentRoundEnded ? 
                        <FormComponent      captions = {captions}
                                            setCurrentRoundEnded = {setCurrentRoundEnded}
                                            setSelectedCaption = {setSelectedCaption}
                                            selectedCaptions = {props.selectedCaptions}
                                            setSelectedCaptions = {props.setSelectedCaptions}
                        /> : 

                        <RoundResultComponent   rounds = {props.rounds}
                                                currentRound = {props.currentRound}
                                                setCurrentRound = {props.setCurrentRound}
                                                setCurrentRoundEnded = {setCurrentRoundEnded}
                                                picId = {picId}
                                                captions = {captions} 
                                                selectedCaption = {selectedCaption}
                                                guessedMemes = {props.guessedMemes}
                                                setGuessedMemes = {props.setGuessedMemes}
                                                timeExpired = {timeExpired}
                                                setTimeExpired = {setTimeExpired}
                        />}
                </Col>
            </Row>
        </>
    );
}


export default RoundComponent;