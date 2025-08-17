import "./App.css";
import React, { useState, setState, useEffect } from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import {Navbar, Nav, Form, Accordion} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import background from "./images/madrid.jpg"
import Flashcard from "./Flashcard.js"

const APP_URL = 'https://flashcards-vw9p.onrender.com/';

const App = () => {
  const [data, setData] = useState(null);
  const [i, setI] = useState(0);
  const [curFront, setCurFront] = useState(true);
  const [defaultFront, setDefaultFront] = useState(true);
  const [defintionsVisible, setDefinitionsVisible] = useState(false);
    
  useEffect(() => {
    console.log("Fetching data...");
    fetch(APP_URL + 'definitions')
      .then(response => {
        console.log("Response received", response);
        return response.json();
      })
      .then(data => {
        console.log("Data parsed", data);
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (data && data.palabras) {
        setI(0);
    }
  }, [data]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        handleRightButtonClick();
        break;
      case 'ArrowLeft':
        handleLeftButtonClick();
        break;
      case ' ':
        e.preventDefault();
        handleCardClick();
        break;
      case '1':
        handleDifficulty(1);
        break;
      case '2':
        handleDifficulty(2);
        break;
      case '3':
        handleDifficulty(3);
        break;
      case '4':
        handleDifficulty(4);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, curFront]);
    
    let currentFront = []  
    if (data) {
      currentFront = curFront ? data.palabras : data.definitions;
    }
    const word = data ? currentFront[i] : "Loading...";

    const handleLeftButtonClick = () => {
      setInformation(null);
      setPronunciation(null);
      setDefinitionsVisible(false);
      setI(prevI => (prevI - 1) > -1 ? prevI - 1 : data.palabras.length - 1);
      setCurFront(defaultFront)
    }

    const handleRightButtonClick = () => {
      setInformation(null);
      setPronunciation(null);
      setDefinitionsVisible(false);
      setI(prevI => (prevI + 1) % data.palabras.length);
      setCurFront(defaultFront)
    }
    
    const handleCardClick = () => {
      setInformation(null);
      setPronunciation(null);
      setDefinitionsVisible(false);
      setCurFront(!curFront);
      console.log("inverting curfont", curFront);
    }

    const handleToggle = () => {
      setDefaultFront(!defaultFront);
      console.log("current front and default front", curFront, defaultFront)
    }

    const handleDifficultyClick = (data) => {
      handleDifficulty(data.target.value);
    }

    const handleDifficulty = (rating) => {
      console.log("difficulty rated as " + rating);
    }

    const encodeURIComponent = (phrase) => {
      return phrase.replace(/ /g, "%20");
    }

    const [information, setInformation] = useState(null);
    const [pronunciation, setPronunciation] = useState(null);

    const handleInfoButtonClick = () => {
      setDefinitionsVisible(!defintionsVisible);
      if (!information) {
        console.log("information is null");
        const encodedWord = encodeURIComponent(word);
        fetch(APP_URL + 'dictionary?word=' + encodedWord)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data[0]?.meta) {
                    setInformation(data);
                }
                return data;
            })
            .then(data => {
              if (data[0]?.hwi?.prs?.length > 0) {
                console.log("data condition passed");
                const audioFile = data[0].hwi.prs[0].sound.audio;
                const subdirectory = getSubdirectory(audioFile);
                fetch(`https://media.merriam-webster.com/audio/prons/es/me/mp3/${subdirectory}/${audioFile}.mp3`)
                  .then(response => response.blob())
                  .then(blob => {
                    const audioUrl = URL.createObjectURL(blob);
                    setPronunciation(audioUrl);
                  })
                  .catch(error => console.error('Error fetching audio:', error));
              }
            })
            .catch(error => console.error('Error:', error));
    }
    }

    const getSubdirectory = (audioFile) => {
      if (!audioFile) return '';
      
      if (audioFile.startsWith('bix')) {
        return 'bix';
      }
      if (audioFile.startsWith('gg')) {
        return 'gg'; 
      }
      
      const firstChar = audioFile.charAt(0);
      if (/[0-9_]/.test(firstChar)) {
        return 'number';
      }
      
      return firstChar;
    }

    const buttonSpanishStyle = {
      backgroundColor: "darkRed", 
      color: "darkYellow", 
      borderColor: "darkRed"
    }

    return ( 
        <div style={{ height: "100vh", backgroundImage: `url(${background})`, backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
          <Navbar>
            <Container>
              <Navbar.Brand>
                Flashcards
              </Navbar.Brand>
              <Nav>
              <div class="form-check form-switch" onClick={handleToggle}>
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
              </div>
              <label class="form-check-label">Default: {defaultFront ? "Spanish" : "English"}</label>
              </Nav>
            </Container>
          </Navbar>
        <Container className="d-flex justify-content-start py-3">
          <Form>
            <Form.Label>Search vocab</Form.Label>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              style={{ width: '300px' }}
            />
          </Form>
        </Container>
        <Container className="d-flex flex-column justify-content-center align-items-center" style={{height: "50vh"}}>
          <Container className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
            <p className="h5 mb-0 me-3 text-white">How difficult was this card?</p>
            <ToggleButtonGroup onChange={handleDifficulty} type="radio" name="ratings">
            {[1, 2, 3, 4].map(num => (
              <ToggleButton key={num} value={num} style={{margin: "0 10px", height: "40px", backgroundColor: "darkRed", color: "darkYellow", borderColor: "darkRed"}}>{num}</ToggleButton>
            ))}
            </ToggleButtonGroup>
          </Container>
          <Container className="d-flex justify-content-center align-items-center" style={{margin: "0 30px"}}>
            <Button className="mx-4" style={buttonSpanishStyle}>
              Incorrect
            </Button>
            <Flashcard 
              word={data && data.palabras && data.palabras.length > i ? word : 'Loading...'}
              handleCardClick={handleCardClick}
              handleLeftButtonClick={handleLeftButtonClick}
              handleRightButtonClick={handleRightButtonClick}
              showInfoButton={curFront}
              handleInfoButtonClick={handleInfoButtonClick}
            ></Flashcard>
            <Button className="mx-4" style={buttonSpanishStyle}>
              Correct
            </Button>
            </Container>
          <Container className="d-flex flex-column align-items-center mt-4">
            <div style={{visibility: defintionsVisible ? 'visible' : 'hidden'}}>
            { !information ? <p className="text-white p-3" style={{background: 'rgba(0,0,0,0.7)', borderRadius: '0.375rem'}}>No information available</p> :
              <Container>
                <figure>
                  <figcaption style={{color: 'white'}}>Pronunciation</figcaption>
                  <audio controls src={pronunciation} style={{width: '30rem'}}></audio>
                </figure>
              <Accordion style={{width: '30rem', background: 'rgba(0,0,0,0.7)'}}>
                {information[0]["shortdef"].map((def, i) => (
                  <Accordion.Item key={i} eventKey={i.toString()}>
                    <Accordion.Header style={{color: 'white'}}>
                      {def}
                    </Accordion.Header>
                    <Accordion.Body style={{color: 'white'}}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Example sentence goes here</span>
                        <Button 
                          variant="outline-light"
                          size="sm"
                          onClick={() => console.log('Play audio')}
                        >
                          <i className="bi bi-volume-up"></i>
                        </Button>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
              </Container>
            }     
            </div>
          </Container>
          </Container>
        </div>
    );
};

export default App;
