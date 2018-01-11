var CARD_SIZE = [72, 96]
var NEW_SIZE = [144, 192]
var CARD_CENTER = [36, 48]
var SUITS = ['C', 'S', 'H', 'D']
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
var VALUES = {'A':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'T':10, 'J':10, 'Q':10, 'K':10}

var inPlay = false;
var outcome = "";
var playerValue = "";
var dealerValue = "";
var score = 0;
var dealerHand = [];
var playerHand = [];

function Card(suit, rank) {
    if (SUITS.indexOf(suit) !== -1 && RANKS.indexOf(rank) !== -1) {
        this.suit = suit;
        this.rank = rank;
    } else {
        this.suit = null;
        this.rank = null;
        console.log("Invalid card: " + suit + " " + rank);
    }
}

Card.prototype.getSuit = function() {
    return this.suit;
}

Card.prototype.getRank = function() {
    return this.rank;
}

Card.prototype.draw = function(canvas, pos) {
    var xpos = CARD_SIZE[0] * RANKS.indexOf(this.rank);
    var ypos = CARD_SIZE[1] * SUITS.indexOf(this.suit);
    // draw image here.
    canvas.drawImage(cards, xpos, ypos, CARD_SIZE[0], CARD_SIZE[1], pos[0], pos[1], NEW_SIZE[0], NEW_SIZE[1]);
}

function Hand() {
    this.cards = [];
}

Hand.prototype.addCard = function(card) {
    this.cards.push(card);
}

Hand.prototype.getValue = function() {
    valueList = [];
    handValue = 0;
    var p;
    for (var i = 0; i < this.cards.length; i++) {
        p = this.cards[i];
        if (RANKS.indexOf(p.rank) === -1) {
            continue;
        }
        valueList += p.rank;
        handValue += VALUES[p.rank];
    }
    if (valueList.indexOf('A') === -1) {
        return handValue;
    } else {
        if (handValue + 10 <= 21) {
            return handValue + 10;
        }
        return handValue;
    }
}

Hand.prototype.draw = function(canvas) {
    var init = [0, 0]
    for (var i = 0; i < this.cards.length; i++) {
        this.cards[i].draw(canvas, [2 * CARD_SIZE[0] * i, init[1]]);
    }
}

Hand.prototype.print = function() {
    var values = "";
    for (var i = 0; i < this.cards.length; i++) {
        values += this.cards[i];
        console.log(this.cards[i]);
    }
    return "Hand contains " + values;
}

function Deck() {
    this.deck = [];
    for (var i = 0; i < SUITS.length; i++) {
        for (var j = 0; j < RANKS.length; j++) {
            this.deck.push(SUITS[i] + RANKS[j]);
        }
    }
}

function deckShuffle(array) { // found on stackoverflow.
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Deck.prototype.shuffle = function() {
    deckShuffle(this.deck);
}

Deck.prototype.dealCard = function() {
    var newCard;
    newCard = this.deck.pop();
    return new Card(newCard[0], newCard[1]);
}

Deck.prototype.print = function() {
    var item = "";
    for (var i = 0; i < this.deck.length; i++) {
        item += this.deck[i] + " ";
    }
    return "Deck contains " + item;
}

function deal() {
    pctx1.clearRect(0, 0, p1.width, p1.height);
    dctx1.clearRect(0, 0, d1.width, d1.height);
    playerHand = new Hand();
    dealerHand = new Hand();
    deck = new Deck();
    deck.shuffle();
    for (var i = 0; i < 2; i++) {
        playerHand.addCard(deck.dealCard());
        dealerHand.addCard(deck.dealCard());
    }
    playerValue = "Player Total " + playerHand.getValue();
    if (inPlay) {
        score += 1;
    } else {
        inPlay = true;
    }
    outcome = "Hit or Stand?"
}

function hit() {
    // console.log('here');
    if (inPlay) {
        if (playerHand.getValue() <= 21) {
            playerHand.addCard(deck.dealCard());
            playerValue = "Player Total " + playerHand.getValue();

            if (playerHand.getValue() > 21) {
                inPlay = false;
                outcome = "You have busted";
                score -= 1;
            }
        }
    }
}

function stand() {
    if (playerHand.getValue() > 21) {
        outcome = "You have busted";
    } else {
        if (inPlay) {
            while (dealerHand.getValue() <= 17) {
                dealerHand.addCard(deck.dealCard());
                dealerValue = "Dealer Total " + dealerHand.getValue();
            }

            if (dealerHand.getValue() > 21) {
                outcome = "The dealer busted, you won!";
                inPlay = false;
                score += 1;
            } else {
                inPlay = false;
                if (dealerHand.getValue() >= playerHand.getValue()) {
                    outcome = "You lost. New deal?";
                    score -= 1;
                } else {
                    outcome = "You have won! New deal?";
                    score += 1;
                }
            }
        }
    }
}
var blackjackList;
var bjInfo;
var bjScore;
var bjptotal;
var p1;
var d1;
var pctx1;
var dctx1;
var cards;

function blackjackStart() {
    bjInfo = document.getElementById("outcome");
    bjScore = document.getElementById("blackjack-score1");
    bjptotal = document.getElementById("bjptotal");
    p1 = document.getElementById("blackjack-playerhand1");
    d1 = document.getElementById("blackjack-dealerhand1");
    pctx1 = p1.getContext("2d");
    dctx1 = d1.getContext("2d");
    // var url = URL.createObjectURL("../cards_jfitz.png");
    cards = document.getElementById("blackjack-cardimage");
    // var cards = new Image();
    // cards.src = url;
    // ctx.drawImage(cards, 10, 10)
    pctx1.drawImage(cards, 72, 0, 72, 96, 0, 0, 144, 192);
    dctx1.drawImage(cards, 216, 0, 72, 96, 0, 0, 144, 192);
    blackjackList = window.setInterval(function bjDraw() {
        bjInfo.innerHTML = outcome;
        bjptotal.innerHTML = playerValue;
        bjScore.innerHTML = score;
        playerHand.draw(pctx1);
        dealerHand.draw(dctx1);
        if (inPlay || playerHand.getValue >= 21) {
            dctx1.fillStyle = "#ABFFFA";
            dctx1.fillRect(0, 0, NEW_SIZE[0], NEW_SIZE[1]);
        }
    }, 1000/60);
}

function blackjackStop() {
    clearInterval(blackjackList);
}