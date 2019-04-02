var DeckTypes = {
    "CharacterPick": "CHAR_PICK",
    "Enemies": "ENEMIES",
    "Defender": "DEFENDER"
}

var TRANSITION_SPEED_MS = 500;

Object.freeze(DeckTypes);

jQuery.fn.extend({
    // Modified and Updated by MLM
    // Origin: Davy8 (http://stackoverflow.com/a/5212193/796832)
    parentToAnimate: function (newParent, duration) {
        duration = duration || 'slow';

        var $element = $(this);

        newParent = $(newParent); // Allow passing in either a JQuery object or selector
        var oldOffset = $element.offset();
        var oldWidth = $element.width() + 30;
        var oldHeight = $element.height() + 255;
        $(this).appendTo(newParent);
        var newOffset = $element.offset();
        var newWidth = $element.width() + 30;
        var newHeight = $element.height() + 255;

        var temp = $element.clone().removeAttr('id').appendTo('body');

        temp.css({
            'position': 'absolute',
            'left': oldOffset.left,
            'top': oldOffset.top,
            'width': oldWidth,
            'height': oldHeight,
            'zIndex': 1000
        });

        $element.hide();

        temp.animate({
            'top': newOffset.top,
            'left': newOffset.left,
            'width': newWidth,
            'height': newHeight
        }, duration, function () {
            $element.show();
            temp.remove();
        });
    }
});

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

            this.getDeck(DeckTypes.CharacterPick).addTile(ObiWanCharacterTile, true);
            this.getDeck(DeckTypes.CharacterPick).addTile(LukeSkywalkerCharacterTile, true);
            this.getDeck(DeckTypes.CharacterPick).addTile(DarkSidiousCharacterTile, true);
            this.getDeck(DeckTypes.CharacterPick).addTile(DarthMaulCharacterTile, true);

            this.attachSelectionEvent(ObiWanCharacterTile);
            this.attachSelectionEvent(LukeSkywalkerCharacterTile);
            this.attachSelectionEvent(DarkSidiousCharacterTile);
            this.attachSelectionEvent(DarthMaulCharacterTile);

        },
        this.addDeck = function (deck) {
            this.gameDecks.push(deck);
        },
        this.getDeck = function (deckType) {
            var returnValue = this.gameDecks.filter(function (deck) {
                return deck.name == deckType;
            });

            if (returnValue.length > 0) {
                return returnValue[0];
            }
        },
        this.attachSelectionEvent = function (tile) {
            $('#' + tile.div_id + '__SELECT').click({
                tile: tile,
                allTiles: this.getDeck(DeckTypes.CharacterPick).characterTiles,
                startDeck: this.getDeck(DeckTypes.CharacterPick),
                endDeck: this.getDeck(DeckTypes.Enemies)
            }, function (s, e) {

                var tileIndex = 0;
                var totalIterations = s.data.allTiles.length;

                function transferTile() {

                    var currentTile = s.data.allTiles[tileIndex];
                    if (currentTile.id != s.data.tile.id) {
                        s.data.startDeck.removeTile(currentTile);
                        s.data.endDeck.addTile(currentTile, false);
                        currentTile.moveToDeck(s.data.endDeck.name);
                        tileIndex--;
                    }
                    tileIndex++;
                    if (s.data.allTiles.length > 1)
                        setTimeout(transferTile, TRANSITION_SPEED_MS + 100);
                }

                transferTile();

            });
        }
}

function Deck(name) {
    this.name = name,
        this.characterTiles = [],
        this.addTile = function (characterTile, addDiv) {
            this.characterTiles.push(characterTile);
            if (addDiv)
                $('#DECK__' + this.name).append(characterTile.div_tile);
        },
        this.removeTile = function (tile) {
            var indexToRemove = -1;
            $.each(this.characterTiles, function (index, characterTile) {
                if (characterTile.id == tile.id) {
                    indexToRemove = index;
                }
            });
            this.characterTiles.splice(indexToRemove, 1);
            //$('#' + tile.div_id).remove();
        }
}

function CharacterTile(character) {
    this.id = character.name,
        this.tileCharacter = character,
        this.div_id = "CHAR_TILE__" + character.name.replace(' ', '_'),
        /* this.div_tile =
        '<div id="' + this.div_id + '" class="col-xs-12 col-sm-12 col-md-6 col-lg-3 mb-4">' +
        '<div class="card" style="">' +
        '<div class="card-header"><h5 class="card-title text-center">' + character.name + '</h5></div>' +
        '<img class="card-img-top" src="https://dummyimage.com/200" alt="Card image cap">' +
        '<div class="card-body"><p class="card-text text-center">' + character.lifePoints + '</p></div></div></div>',   */
        this.div_tile = '<div id="' + this.div_id + '" class="col-md-3 col-md-offset-3">' +
        '<div class="card">' +
        '<div class="card-image">' +
        '<img class="img-responsive" src="https://dummyimage.com/255">' +
        '</div>' +
        '<div class="card-content">' +
        '<span class="card-title">' + character.name + '</span>' +
        '<span class="badge badge-danger pull-right">' + character.lifePoints + '</span>' +
        /*'<button type="button" id="show" class="btn btn-custom pull-right" aria-label="Left Align">' +
        '<i class="fa fa-ellipsis-v"></i>' +
        '</button>' +*/
        '</div>' +
        '<div class="card-action">' +
        '<a href="#" target="new_blank" id="' + this.div_id + '__SELECT">Select</a>' +
        '</div>' +
        '<div class="card-reveal">' +
        '<span class="card-title">Card Title</span> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
    '<p>Here is some more information about this product that is only revealed once clicked on.</p>' +
    '</div>' +
    '</div>' +
    '</div>',
    this.moveToDeck = function (deckType) {
        $('#' + this.div_id).parentToAnimate($('#DECK__' + deckType), TRANSITION_SPEED_MS);
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