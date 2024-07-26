import { useState } from "react";
import { Form, FloatingLabel, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";


function LoginForm(props)
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) =>
    {
        event.preventDefault();
        props.handleLogin(username, password);
    }

    return (  
        <>
            {props.loginErrMsg !== "" && 
                <Alert variant = "danger" onClose = {() => props.setLoginErrMsg("")} dismissible> 
                    {props.loginErrMsg}
                </Alert>
            }

            <Form className = "mt-4 col-3 mx-auto" onSubmit = {handleSubmit}>
                <Form.Text><h3>Accedi</h3></Form.Text>
                <Form.Group className = "mt-4">
                    <FloatingLabel controlId = "floatingEmail" label = "email">
                        <Form.Control type = "email" value = {username} required = {true} minLength = {5}
                            onChange = {(event) => setUsername(event.target.value)}/>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className = "mt-3">
                    <FloatingLabel controlId = "floatingPassword" label = "password">
                        <Form.Control type = "password" value = {password} required = {true} minLength = {4}
                            onChange = {(event) => setPassword(event.target.value)}/>
                    </FloatingLabel>
                </Form.Group>

                <Button type = "submit" className = "btn btn-primary mt-4">Login</Button>
                <Link to = "/" className = "btn btn-danger mt-4 ms-1"
                    onClick = {() => props.setLoginErrMsg("")}>Annulla</Link>
            </Form>
        </>    
    );
}


export default LoginForm;