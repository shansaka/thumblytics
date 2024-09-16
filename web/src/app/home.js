import React from "react";
import { Container } from "react-bootstrap";
import { Welcome, ThumbnailUploader } from "../components";

function Home() {
  return (
    <section>
      <Container className="home_container">
        <Welcome />
        <ThumbnailUploader />
      </Container>
    </section>
  );
}

export default Home;
