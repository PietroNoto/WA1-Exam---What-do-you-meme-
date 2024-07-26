import { useEffect, useState } from "react";
import { Accordion, Badge, Card, Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import API from "../API.mjs";


function History(props)
{
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const imgPath = "http://localhost:3001/img";
    
    // Questa useEffect viene invocata al primo (e unico) rendering del componente (dep = []).
    // Ottiene dal server tutte le partite giocate dall'utente (loggato), oltre alle sue info.
    useEffect(() => 
    {
        const getUserGames = async () =>
        {
            try
            {
                let games = await API.getUserGames(props.user.id);

                // Esegue una "deserializzazione" della stringa "<id><g/n>,<id><g/n>,<id><g/n>" in un array
                // [{id: id, guessed: true/false}, {id: id, guessed: true/false}, {id: id, guessed: true/false}]
                let mappedGames = games.map((game) => 
                {
                    let memes = game.pic_ids.split(",").map((meme) => 
                    {
                        let id = Number(meme.substring(0, meme.length - 1));
                        let gn = meme.slice(-1);
        
                        return {id: id, guessed: gn === "g" ? true : false};
                    });
        
                    let mappedGame = 
                    {
                        u_id: game.u_id,
                        score: game.score,
                        timestamp: game.timestamp,
                        memes: memes,
                    };
        
                    return mappedGame;
                });

                setGames(mappedGames);
                setLoading(false);
            } 
            catch {}
        }

        getUserGames();
    }, []);    

    return (
        <>  
            <Row>
                <Col>
                    <h1>
                        <Link to = "/" className = "btn btn-primary me-3">
                            <i className = "bi bi-arrow-90deg-left"></i>
                        </Link>
                        {props.user.name}
                    </h1> 
                </Col>
            </Row>
            <Row className = "mt-2">
                <Col>
                    <h6>
                        Email:
                        <Badge pill bg = "secondary" className = "history-pill ms-2">{props.user.username}</Badge>
                    </h6>
                </Col>
            </Row>
            <Row className = "mt-4">
                <Col>
                    <h4>
                        Le tue partite
                        <Badge pill bg = "secondary" className = "history-pill ms-2 me-2">
                            {games.length}
                        </Badge>
                        :
                    </h4>
                </Col>
            </Row>
            <Row className = "mt-2">
                <Accordion>
                    {games.map((game) => 
                        <Accordion.Item key = {game.timestamp} eventKey = {game.timestamp}>

                            <Accordion.Header>
                                <Col>
                                    <h6>{dayjs(game.timestamp).format("HH:mm, DD MMMM YYYY")}</h6>
                                </Col>
                                <Col>
                                    <Badge bg = {game.score >= 10 ? "success" : (game.score === 5 ? "warning" : "danger")}>
                                        <h6>{game.score} punti</h6>
                                    </Badge>
                                </Col>
                            </Accordion.Header>

                            <Accordion.Body>
                                <Row>
                                    {game.memes.map((meme) => 
                                        <Col key = {meme.id}>
                                            <Card key = {meme.id} style = {{ width: '12rem', height: "10rem" }}>
                                                <Card.Img variant = "top" src = {imgPath + meme.id + ".jpg"} height = {120}>
                                                </Card.Img>

                                                <Card.Title className = "mx-auto mt-2">
                                                    {meme.guessed ? <Badge bg = "success">5 punti</Badge> : 
                                                        <Badge bg = "danger">0 punti</Badge>}
                                                </Card.Title>
                                            </Card>
                                        </Col>)}
                                </Row> 
                            </Accordion.Body>
                        </Accordion.Item>)}
                </Accordion>
            </Row>
        </>
    );
}


export default History;