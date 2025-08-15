import React from 'react';
import ArrowButton from "./ArrowButton.js"
import Card from 'react-bootstrap/Card';
import {Stack, Button} from 'react-bootstrap';
const Flashcard = ({ word, handleCardClick, handleLeftButtonClick, handleRightButtonClick, handleInfoButtonClick, showInfoButton }) => {
    return (
        <Card style={{ width: '30rem', height: "15rem", background: `rgb(0,0,0,0.7)`, borderWidth: "2px", borderColor: 'white' }}>
            <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0"}}>
                <Stack direction="horizontal" gap={5} style={{width: "100%"}}>
                <ArrowButton direction="left" onClick={handleLeftButtonClick}/>
                    <Card.Title style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", color: "white", cursor : "pointer"}} onClick={handleCardClick}>
                        {word}
                    </Card.Title>
                    {showInfoButton && <Button onClick={handleInfoButtonClick}>More info</Button>}
                <ArrowButton direction="right" onClick={handleRightButtonClick}/>
                </Stack>
            </Card.Body>
        </Card>
    );
}

export default Flashcard;