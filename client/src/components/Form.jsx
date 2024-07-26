import { useState } from "react";
import { Form, Button } from "react-bootstrap";


function FormComponent(props)
{
    // Anche se la risposta selezionata dall'utente è presente in RoundComponent, essa viene 
    // assegnata solo in fase di conferma, per evitare di scatenare il re-rendering di RoundComponent
    // ogni volta che l'utente cambia risposta
    const [answer, setAnswer] = useState("");
    
    const handleSubmit = (event) =>
    {
        event.preventDefault();
        props.setSelectedCaption(answer);
        props.setSelectedCaptions([...props.selectedCaptions, answer]);
        props.setCurrentRoundEnded(true);
    }
    
    return (
        <>
            <Form className = "mt-2" onSubmit = {handleSubmit}>
                <Form.Label><h2>Scegli una didascalia</h2></Form.Label>
                {
                    props.captions.map((cap) => 
                        <Form.Check key = {cap} className = "mt-1" 
                                    type = "radio" id = {cap} 
                        >
                            <Form.Check.Input   type = "radio" value = {cap}
                                                checked = {answer === cap}
                                                readOnly
                                                onClick = {(event) => setAnswer(event.target.value)} />
                            <Form.Check.Label>{cap}</Form.Check.Label>
                        </Form.Check>
                    )
                }
                <Button variant = "primary" className = "btn btn-primary mt-4" type = "submit">
                    Conferma
                </Button>
            </Form>  
        </>
    );
}


export default FormComponent;