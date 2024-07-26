import { useEffect, useState } from "react";
import { Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import API from "../API.mjs";


function RoundResultComponent(props)
{
    const [correctCaps, setCorrectCaps] = useState([]);
    const [success, setSuccess] = useState(false);
    const [correctOptions, setCorrectOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Viene eseguita solo al primo rendering del componente (dep = [])
    useEffect(() =>
    {
        const getCorrectCaptions = async () =>
        {
            let success = false;
            let intersection = [];
            let corCaps = await API.getMatchingCaptions(props.picId);

            if (corCaps.includes(props.selectedCaption))
                success = true;
            else
                intersection = props.captions.filter((cap) => corCaps.includes(cap));

            setCorrectOptions(intersection);
            setSuccess(success);
            setCorrectCaps(corCaps);
            if (success)
                props.setGuessedMemes([...props.guessedMemes, props.currentRound]); 
        }
        
        getCorrectCaptions();
        setLoading(false);
    }, []);
    
    const handleNextRound = (event) =>
    {
        event.preventDefault();
        props.setCurrentRound((round) => round + 1);
        props.setCurrentRoundEnded(false);
        props.setTimeExpired(false);
    }

    return (
        <>
            <Row>
                <Col>
                    <h3>
                        {!props.timeExpired ? <Badge bg = {success ? "success" : "danger"}>
                            Risposta {success ? "esatta!" : "sbagliata!"}
                        </Badge> : 
                        <Badge bg = "danger">Tempo scaduto!</Badge>}
                    </h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    {props.rounds === 3 && 
                        <h4>Round concluso, hai ottenuto {success ? 5 : 0} punti</h4>}
                </Col>
            </Row>

            {!success && 
                <>
                    <Row><Col className = "mt-3"><h4>Le due didascalie corrette erano: </h4></Col></Row>

                    {!loading ? correctOptions.map((cop) => 
                        <div key = {cop}>
                            <h5>{<Badge bg = "success">{cop}</Badge>}</h5>
                        </div>) : 
                        <Spinner variant = "border"></Spinner>}
                </>
            }

            {props.rounds === 1 && 
                <Link to = "/" className = "btn btn-primary mt-5" style = {{textDecoration: "none"}} >
                    Torna alla home
                </Link>}
 
            {props.rounds === 3 && 
                <Button variant = "primary" className = "btn btn-primary mt-5" 
                    onClick = {(event) => handleNextRound(event)}>
                    {props.currentRound < props.rounds - 1 && "Prossimo round" }
                    {props.currentRound >= props.rounds - 1 && "Vai al riepilogo" }
                </Button>}
        </>
    );
}


export default RoundResultComponent;