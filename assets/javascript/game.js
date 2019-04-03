var DeckTypes = {
    "CharacterPick": "CHAR_PICK",
    "Enemies": "ENEMIES",
    "Defender": "DEFENDER"
}

var TRANSITION_SPEED_MS = 200;

Object.freeze(DeckTypes);

jQuery.fn.extend({
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
            $element.addClass();
            temp.remove();
        });
    }
});

function starWarsGame() {
    this.gameDecks = [],
        this.gameCharacter = null,
        this.defenderCharacter = null,
        this.init = function () {

            var ObiWanCharacter = new Character("Obi-Wan Kenoby", 8, 8, 120);
            var LukeSkywalkerCharacter = new Character("Luke Skywalker", 15, 15, 100);
            var DarkSidiousCharacter = new Character("Darth Sidious", 22, 22, 80);
            var DarthMaulCharacter = new Character("Darth Maul", 18, 18, 150);

            var ObiWanCharacterTile = new CharacterTile(ObiWanCharacter, "/assets/images/obiwan.png");
            var LukeSkywalkerCharacterTile = new CharacterTile(LukeSkywalkerCharacter, "/assets/images/luke.png");
            var DarkSidiousCharacterTile = new CharacterTile(DarkSidiousCharacter, "/assets/images/dark.png");
            var DarthMaulCharacterTile = new CharacterTile(DarthMaulCharacter, "/assets/images/darth.png");

            var characterPickDeck = new Deck(DeckTypes.CharacterPick, this);
            var enemiesDeck = new Deck(DeckTypes.Enemies, this);
            var defenderDeck = new Deck(DeckTypes.Defender, this);

            this.addDeck(characterPickDeck);
            this.addDeck(enemiesDeck);
            this.addDeck(defenderDeck);

            this.getDeck(DeckTypes.CharacterPick).addTile(ObiWanCharacterTile, true);
            this.getDeck(DeckTypes.CharacterPick).addTile(LukeSkywalkerCharacterTile, true);
            this.getDeck(DeckTypes.CharacterPick).addTile(DarkSidiousCharacterTile, true);
            this.getDeck(DeckTypes.CharacterPick).addTile(DarthMaulCharacterTile, true);

            this.initiateCharacterSelection(ObiWanCharacterTile);
            this.initiateCharacterSelection(LukeSkywalkerCharacterTile);
            this.initiateCharacterSelection(DarkSidiousCharacterTile);
            this.initiateCharacterSelection(DarthMaulCharacterTile);

        },
        this.attackOpponent = function () {
            if (this.gameCharacter != null && this.defenderCharacter != null) {

                var attackPts = this.gameCharacter.attack();
                this.defenderCharacter.takeAttack(attackPts);

                $('#FIGHT_COMMENTS').empty();
                $('#FIGHT_COMMENTS').append('<p>You attacked ' + this.defenderCharacter.name + ' for ' + attackPts + ' damage.<br></p>');

                if (this.defenderCharacter.lifePts == 0) {
                    $('#attackButton').off('click');
                    $('#FIGHT_COMMENTS').append('<p>You have defeated ' + this.defenderCharacter.name + ', you can choose to fight another enemy.<br></p>');
                } else if (this.defenderCharacter.lifePts > 0) {
                    var counterAttackPts = this.defenderCharacter.counterAttack();
                    this.gameCharacter.takeAttack(counterAttackPts);

                    $('#FIGHT_COMMENTS').append('<p>' + this.defenderCharacter.name + ' attacked you back for ' + counterAttackPts + ' damage.<br></p>');
                    if (this.gameCharacter.lifePts == 0) {
                        $('#attackButton').off('click');
                        $('#FIGHT_COMMENTS').append('<p>You were defeated! Game Over...<br></p>');
                    }
                }

                this.refreshActiveDecks();

            }
        },
        this.refreshActiveDecks = function () {

            var defenderDeck = this.getDeck(DeckTypes.Defender);
            var characterPickDeck = this.getDeck(DeckTypes.CharacterPick);

            for (var characterIndex = 0; characterIndex < defenderDeck.characterTiles.length; characterIndex++) {
                $('#' + defenderDeck.characterTiles[characterIndex].div_id + '__LIFEPTS').text(defenderDeck.characterTiles[characterIndex].tileCharacter.lifePts);
                if (defenderDeck.characterTiles[characterIndex].tileCharacter.lifePts == 0) {
                    $('#' + defenderDeck.characterTiles[characterIndex].div_id).fadeOut("slow", function () {
                        $('#' + defenderDeck.characterTiles[characterIndex].div_id).css('display', 'none');
                    });
                }
            }
            for (var characterIndex = 0; characterIndex < characterPickDeck.characterTiles.length; characterIndex++) {
                $('#' + characterPickDeck.characterTiles[characterIndex].div_id + '__LIFEPTS').text(characterPickDeck.characterTiles[characterIndex].tileCharacter.lifePts);
                if (characterPickDeck.characterTiles[characterIndex].tileCharacter.lifePts == 0) {
                    $('#' + defenderDeck.characterTiles[characterIndex].div_id).fadeOut("slow", function () {
                        $('#' + defenderDeck.characterTiles[characterIndex].div_id).css('display', 'none');
                    });
                }
            }
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
        this.initiateCharacterSelection = function (tile) {
            $('#' + tile.div_id + '__SELECT').off('click');
            $('#' + tile.div_id + '__SELECT').click({
                tile: tile,
                allTiles: this.getDeck(DeckTypes.CharacterPick).characterTiles,
                startDeck: this.getDeck(DeckTypes.CharacterPick),
                endDeck: this.getDeck(DeckTypes.Enemies)
            }, function (s, e) {

                window.CURRENT_GAME.gameCharacter = tile.tileCharacter;
                var tileIndex = 0;
                var totalIterations = s.data.allTiles.length;

                function transferTile() {

                    var currentTile = s.data.allTiles[tileIndex];
                    if (currentTile.id != s.data.tile.id) {
                        s.data.startDeck.removeTile(currentTile);
                        s.data.endDeck.addTile(currentTile, false);
                        currentTile.moveToDeck(s.data.endDeck.name);
                        window.CURRENT_GAME.initiateDefenderSelection(currentTile);
                        tileIndex--;
                    }
                    tileIndex++;
                    if (s.data.allTiles.length > 1)
                        setTimeout(transferTile, TRANSITION_SPEED_MS + 100);
                }

                transferTile();

            });
        },
        this.initiateDefenderSelection = function (tile) {
            $('#' + tile.div_id + '__SELECT').off('click');
            $('#' + tile.div_id + '__SELECT').click({
                tile: tile,
                allTiles: this.getDeck(DeckTypes.Enemies).characterTiles,
                startDeck: this.getDeck(DeckTypes.Enemies),
                endDeck: this.getDeck(DeckTypes.Defender)
            }, function (s, e) {

                for (var tileIndex = 0; tileIndex < s.data.allTiles.length; tileIndex++) {
                    var currentTile = s.data.allTiles[tileIndex];
                    if (currentTile.id == s.data.tile.id) {
                        window.CURRENT_GAME.defenderCharacter = currentTile.tileCharacter;
                        s.data.startDeck.removeTile(currentTile);
                        s.data.endDeck.addTile(currentTile, false);
                        currentTile.moveToDeck(s.data.endDeck.name);
                        break;
                    }
                }

                $('#attackButton').prop('disabled', false);
                $('#attackButton').off('click');
                $('#attackButton').click(function (s) {
                    window.CURRENT_GAME.attackOpponent();
                });

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
        this.div_tile = '<div id="' + this.div_id + '" class="col-md-3 col-md-offset-3">' +
        '<div class="card">' +
        '<div class="card-image">' +
        '<img class="img-responsive" src="https://lorempixel.com/255/255">' +
        '</div>' +
        '<div class="card-content">' +
        '<span class="card-title">' + character.name + '</span>' +
        '<span class="badge badge-danger pull-right" id="' + this.div_id + '__LIFEPTS">' + character.lifePts + '</span>' +
        /*'<button type="button" id="show" class="btn btn-custom pull-right" aria-label="Left Align">' +
        '<i class="fa fa-ellipsis-v"></i>' +
        '</button>' +*/
        '</div>' +
        '<div class="card-action">' +
        '<a href="#" target="new_blank" id="' + this.div_id + '__SELECT">Select</a>' +
        '</div>' +
        '<div class="card-reveal">' +
        '</div>' +
        '</div>' +
        '</div>',
        this.moveToDeck = function (deckType) {
            $('#' + this.div_id).parentToAnimate($('#DECK__' + deckType), TRANSITION_SPEED_MS);
        }
}

function Character(name, initialAttack, counterAttack, lifePoints) {
    this.name = name,
        this.attackPtsIncrease = initialAttack,
        this.attackPts = initialAttack,
        this.counterAttackPts = counterAttack,
        this.lifePts = lifePoints,
        this.attack = function () {
            var currentAttackPts = this.attackPts;
            this.attackPts += this.attackPtsIncrease;
            return currentAttackPts;
        },
        this.counterAttack = function () {
            return this.counterAttackPts;
        },
        this.takeAttack = function (attackStrength) {
            this.lifePts -= attackStrength;
            if (this.lifePts < 0)
                this.lifePts = 0;
        }

}

var game = new starWarsGame();
window.CURRENT_GAME = game;
window.CURRENT_GAME.init();