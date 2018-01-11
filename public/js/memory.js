var nums = [];
var turns = 0;
var exposed = [];
var cards = document.getElementsByClassName("memory-card");
function memoryFirst() {
    var turns = 0;
    for (var j = 0; j < 20; j++) {
        nums[j] = j % 10;
    }
    memoryShuffle(nums);
    for (var i = 0; i < cards.length; i++) {
        // cards[i].innerHTML = "<span class='memory-num'>" + nums[i] + "</span>";
        cards[i].onclick = function(i) { memoryExposeElement(this, this.id);}
    }
}

function memoryExposeElement(element, i) {
    if (exposed.length === 2) {
        memoryResetCards();
    }
    element.style.backgroundColor = "black";
    element.style.border = "1px solid #ABFFFA";
    element.innerHTML = "<span class='memory-num'>" + nums[i - 1] + "</span>";
    exposed.push(i - 1);
}

function memoryResetCards() {
    if (nums[exposed[0]] !== nums[exposed[1]]) {
        for (var i = 0; i < exposed.length; i++) {
            el = cards[exposed[i]];
            el.style.backgroundColor = "#ABFFFA";
            el.style.border = "1px solid black";
            el.innerHTML = "";
        }       
    }
    exposed = [];
    memoryIncreaseTurns();
}

function memoryIncreaseTurns() {
    turns += 1;
    document.getElementById('memory-score1').innerHTML = "" + turns;
}

function memoryShuffle(array) { // found on stackoverflow.
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