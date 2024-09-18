import React from "react";
import { Container } from "react-bootstrap";
import { Information } from "../components";

function About() {
  return (
    <section>
      <Container className="home_container">
        <Information />
      </Container>
    </section>
  );
}

export default About;
