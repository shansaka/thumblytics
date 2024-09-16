import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "./app/home";

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import logo from "./logo.png";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary nav_bar">
            <Container>
              <Navbar.Brand>
                <Nav.Link as={NavLink} to="/">
                  <img src={logo} height="50" className="d-inline-block align-top" alt="Logo" />
                </Nav.Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto custom-nav">
                  <>
                    <Nav.Link as={NavLink} to="/" activeclassname="active">
                      Thumbnail Rater
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/games" activeclassname="active">
                      About
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/games" activeclassname="active">
                      Contact
                    </Nav.Link>
                  </>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        <div className="main_container ">
          <Container fluid className="home-section">
            <Routes>
              <>
                <Route path="/" element={<Home />} />
              </>
            </Routes>
          </Container>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
