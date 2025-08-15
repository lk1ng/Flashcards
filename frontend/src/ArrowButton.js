import React from 'react';
import {Button} from 'react-bootstrap';
const ArrowButton = ({direction, onClick}) => {
    return (
        <Button className="h-100" style={{background: "transparent", border: "0px"}} onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={"bi bi-chevron-compact-"+{direction}} viewBox="0 0 16 16">
                {direction === "left" ? (
                    <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
                ) : (
                    <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 0-.223.67L9.44 8l-2.888 5.776a.5.5 0 0 0 .894.448l3-6a.5.5 0 0 0 0-.448l-3-6a.5.5 0 0 0-.67-.223"/>
                )}
            </svg>
        </Button>
    );
}

export default ArrowButton;