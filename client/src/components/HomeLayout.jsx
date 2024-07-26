import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";


function Home(props)
{
    return (
        <>
            <h3><strong>What do you meme?</strong>
                &nbsp; è un gioco in cui bisogna associare un meme alla didascalia migliore.
            </h3>
            <div className = "mt-5"> 
                {!props.user ?
                    <>
                        <Row>
                            <Col><h4>Hai già un account?</h4></Col>
                            <Col><Link to = "/login" className = "btn btn-primary ms-3">Login</Link></Col>
                        </Row>

                        <Row className = "mt-2">
                            <Col><h4>Oppure gioca lo stesso in modo anonimo:</h4></Col>
                            <Col><Link to = "/play" className = "btn btn-primary ms-3">Gioca</Link></Col>
                        </Row>    
                    </> :
                            
                    <>
                        <Row><Col><h4>Benvenuto, {props.user.name}!</h4></Col></Row>
                        <Row>
                            <Col className = "mx-auto"><h4>Gioca:</h4></Col>
                            <Col><Link to = "/play" className = "btn btn-primary ms-3">Gioca</Link></Col>
                        </Row>
                    </>             
                }  
            </div>  
        </>
    );
}


export default Home;