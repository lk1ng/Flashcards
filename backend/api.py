from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware    
import random
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

def read_vocab():
    path = './Vocabulario y traducciones.md'
    palabras = []
    definitions = []
    with open(path) as vocabFile:
        linesList = vocabFile.readlines()
        random.shuffle(linesList)
        for line in linesList:
            if "-" not in line:
                continue
            line = line.split("-", 1)
            palabras.append(line[0].strip())
            definitions.append(line[1].strip())

    return [palabras, definitions]

origins = {
    "http://localhost:3001",
    "https://localhost:3001"
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/definitions")
async def root():
    palabras, definitions = read_vocab()
    return {"palabras": palabras,
            "definitions": definitions}

@app.get("/dictionary")
async def dictionary(word: str):
    response = requests.get(f"https://www.dictionaryapi.com/api/v3/references/spanish/json/{word}?key={os.getenv('DICTIONARY_API_KEY')}")
    return response.json()

            