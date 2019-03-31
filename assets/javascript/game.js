var DeckTypes = {
    "CharacterPick": "CHAR_PICK",
    "Enemies": "ENEMIES",
    "Defender": "DEFENDER"
}

Object.freeze(DeckTypes);

function starWarsGame() {
    this.gameDecks = [],
        this.init = function () {
            
            var ObiWanCharacter = new Character("Obi-Wan Kenoby", 8, 120);
            var LukeSkywalkerCharacter = new Character("Luke Skywalker", 15, 100);
            var DarkSidiousCharacter = new Character("Darth Sidious", 22, 80);
            var DarthMaulCharacter = new Character("Darth Maul", 18, 150);

            var ObiWanCharacterTile = new CharacterTile(ObiWanCharacter, "/assets/images/obiwan.png");
            var LukeSkywalkerCharacterTile = new CharacterTile(LukeSkywalkerCharacter, "/assets/images/luke.png");
            var DarkSidiousCharacterTile = new CharacterTile(DarkSidiousCharacter, "/assets/images/dark.png");
            var DarthMaulCharacterTile = new CharacterTile(DarthMaulCharacter, "/assets/images/darth.png");

            var characterPickDeck = new Deck(DeckTypes.CharacterPick);
            var enemiesDeck = new Deck(DeckTypes.Enemies);
            var defenderDeck = new Deck(DeckTypes.Defender);

            this.addDeck(characterPickDeck);
            this.addDeck(enemiesDeck);
            this.addDeck(defenderDeck);

            this.getDeck(DeckTypes.CharacterPick).addTile(ObiWanCharacterTile);
            this.getDeck(DeckTypes.CharacterPick).addTile(LukeSkywalkerCharacterTile);
            this.getDeck(DeckTypes.CharacterPick).addTile(DarkSidiousCharacterTile);
            this.getDeck(DeckTypes.CharacterPick).addTile(DarthMaulCharacterTile);

        },
        this.addDeck = function(deck)
        {
            this.gameDecks.push(deck);
        },
        this.getDeck = function (deckType) {
            var returnValue =  this.gameDecks.filter(function (deck) {
                return deck.name == deckType;
            });

            if(returnValue.length > 0)
            {
                return returnValue[0];
            }
        }
}

function Deck(name) {
    this.name = name,
        this.characterTiles = [],
        this.addTile = function (tileCharacter) {
            this.characterTiles.push(tileCharacter);
        },
        this.removeTile = function (tileId) {
            $.each(characterTiles, function (index, characterTile) {
                if (characterTile.id == tileId) {
                    someArray.splice(index, 1);
                }
            });
        }
}

function CharacterTile(character) {
    this.id = character.name,
        this.tileCharacter = character,
        this.moveToDeck = function (deckName) {

        }
}

function Character(name, initialAttack, lifePoints) {
    this.name = name,
        this.attack = initialAttack,
        this.lifePoints = lifePoints,
        this.increaseAttack = function (increase) {
            this.attack += increase;
        }
}

var game = new starWarsGame();
game.init();