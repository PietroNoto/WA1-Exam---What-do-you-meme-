import { Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";


function NavHeader(props)
{
    return (
        <Navbar className = 'primary' data-bs-theme = "dark" style = {{backgroundColor: "orangered"}}>
            <Container fluid>
                <span className = "mb-2 mt-2">
                    <Link to = "/" style = {{textDecoration: "none"}}>
                        <i className = "bi bi-question-lg nav-bi h4"></i>
                        <i className = "bi bi-images nav-bi h4"></i>
                        <i className = "bi bi-question-lg nav-bi h4"></i>
                        <Navbar.Brand className = "h1 ms-2">What do you meme?</Navbar.Brand>
                    </Link> 
                </span>
                
                <span className = "me-3">
                    {props.user ? 
                        <UserDropdown   user = {props.user}
                                        handleLogout = {props.handleLogout} /> :
                        <Link to = "/login" className = "btn btn-outline-light">Login</Link>}
                </span>
            </Container>
        </Navbar>
    );
}


function UserDropdown(props)
{
    return (
        <NavDropdown title = {props.user.name} className = "dropdown" id = "basic-nav-dropdown" align = "end">
            <NavDropdown.Item>
                <Link to = "/user-history">La mia cronologia</Link>
            </NavDropdown.Item>
            
            <NavDropdown.Divider />
            
            <NavDropdown.Item>
                <Button variant = "danger" onClick = {() => props.handleLogout()}>Logout</Button>
              </NavDropdown.Item>
        </NavDropdown>
    );
}


export default NavHeader;