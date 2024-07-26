import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";


function TimerComponent(props)
{
    const [count, setCount] = useState(30);

    // Viene invocata ogni secondo, essendo dep = [count] e count viene aggiornato ogni secondo
    // nella setInterval
    useEffect(() => 
    {
        const timer = setInterval(() => 
        {
            setCount(c => c - 1);
        }, 1000);

        if (count <= 0) 
        {
            // Il round finisce, con stato di tempo scaduto. Viene aggiunta la stringa vuota 
            // come risposta selezionata
            props.setCurrentRoundEnded(true);
            props.setTimeExpired(true);
            props.setSelectedCaptions([...props.selectedCaptions, ""]);
            clearInterval(timer);
        }
            
        return () => clearInterval(timer);
    }, [count]);

    return (
        <h4>
            Tempo rimasto: 
            <Badge className = "ms-2" bg = {count >= 10 ? "success" : "danger"}>{count}</Badge>
        </h4>
    );
}


export default TimerComponent;