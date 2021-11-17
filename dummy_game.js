//=========================================================
//  ▄         ▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄ 
// ▐░▌       ▐░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
// ▐░▌       ▐░▌▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀ 
// ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          
// ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ 
// ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
// ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀▀▀▀▀▀█░▌
// ▐░▌       ▐░▌▐░▌       ▐░▌          ▐░▌
// ▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌ ▄▄▄▄▄▄▄▄▄█░▌
// ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
//  ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀ 
//
// ASCII Art Generated at: http://patorjk.com/software/taag/
// 
// Description: This is a matching game, where the tiles are
//  faces of teachers and administrators at UHS.
//
// Author: Mr. P && His Awesome 1st Period Class
//
// Version: 1
// History: 
//  1: 
//    - Get player to show up on screen and move
//  2: 
//    - Get cards to flip over if names don't match
//    - Get matches and timer going
//    - Calculate accuracy bonus at end
//  3: 
//    - Calculating number of matches and misses
//    - Setting up timer and ending game
//    - Put photos in the game
//  4:
//    - Game over popup window
//    - Reveal all cards at end
//    - Calculate BONUS based accuracy and time left
//=========================================================

window.onload = function () {

    /********* BEGIN PROGRAM CODE HERE ************/
    
    // Constants
    var GAME_DURATION = 30;
  
    var NUM_CARDS = 25;
  
    var CARDS = [
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/brian_piltin.jpg", 
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/stephen_paulson.jpg", 
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/elizabeth_arciniega.jpg", 
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/judith_cardenas.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/norma_navarro.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/zelene_pomar.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558504/fall_2021/period_1/molina_desiee.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/armando_molina_jr.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/otila_molina.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558235/fall_2021/period_1/armando_molina.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/deborah_paredes.jpg",
        "https://res.cloudinary.com/united-high-school/image/upload/v1636558236/fall_2021/period_1/paul_aguilar.jpg"
      ];
  
    var musicSound = new Audio("https://res.cloudinary.com/united-high-school/video/upload/v1636490058/fall_2021/period_4/bg_music_game_1.mp3");
    var matchSound = new Audio("https://res.cloudinary.com/united-high-school/video/upload/v1636559559/fall_2021/period_1/match.mp3");
    var missSound = new Audio("https://res.cloudinary.com/united-high-school/video/upload/v1636559559/fall_2021/period_1/miss.mp3");
    var buttonSound = new Audio("https://res.cloudinary.com/united-high-school/video/upload/v1636645942/fall_2021/period_1/btn_click.mp3");
  
    // Global variables go here
    var playGameBtn;
    var insBtn;
    var backBtn;
  
    var cards = []; // This will be where the actual cards end up
    var covers = [];
  
    var turnOver = true;    // Keeps track of when a turn is complete
    var lastCardIdx = -1;   // Keeps track of the first card the player clicked
  
    var matches = 0;
    var misses = 0;
  
    var elapsedTime = 0;
  
    var scoreBoard;

    var hs = HighScore.init("who@ever.com", "dummy_game");
    var hsName = "";
    var hsScore = 0;
    var nameChars = [];

    function start() {
      showNameEntryScreen();
      // Create the welcome screen
      // showWelcomeScreen();
  
      // Set up the mouse click function that will handle clicks of the mouse
      mouseClickMethod(handleMouseClicks);
    }
  
    function startGame() {
      // All of the variables have their correct initial values
      cards = []; 
      covers = [];
      turnOver = true;    
      lastCardIdx = -1;
      matches = 0;
      misses = 0;
      elapsedTime = 0;
  
      // Erase existing screen
      eraseScreen();
  
      makeCards();
  
      drawCards();
  
      // Creat the scoreboard
      scoreBoard = new Text("Matches: " + matches + " Misses: " + misses + " Time Left: " + (GAME_DURATION - elapsedTime));
      scoreBoard.setPosition(0, scoreBoard.getHeight());
      add(scoreBoard);
  
      setTimer(gameClock, 1000);
  
      // Wait a second before starting the music
      setTimeout(function () {
        musicSound.play();
        musicSound.loop = true;
      }, 1000);
    }
  
    function gameClock() {
      elapsedTime++;  // Keeps track of seconds passed
      if (elapsedTime >= GAME_DURATION) {
        // The game is over
        endGame();
      }
      updateScoreBoard();
    }
  
    function endGame() {
  
      stopTimer(gameClock);
      // Play the end game sound
      musicSound.pause();
  
      // This has a 3 second delay
      setTimeout(function() {
        revealAllCards();
        showGameOverScreen();
      }, 3000);

      if (getFinalScore() > hsScore) {
        hsScore = getFinalScore();
        hsName = "Whoever";
        // Show name selection screen
        hs.write(hsName, hsScore);
      }
    }
  
    function revealAllCards() {
      for (var i = 0; i < cards.length; i++) {
        flipCard(i);
      }
    }
  
    function updateScoreBoard() {
      if (matches + misses == 0) {
         scoreBoard.setText("Matches: " + matches + " Misses: " + misses + " Time Left: " + (GAME_DURATION - elapsedTime));
      }  else {
        var accuracy = getAccuracy();
        scoreBoard.setText("Matches: " + matches + " Misses: " + misses + " Time Left: " + (GAME_DURATION - elapsedTime) + " Accuracy: " + accuracy.toFixed(0) + "%");
      }
    }
  
    function getAccuracy() {
      return matches / (matches + misses) * 100;
    }
  
    function drawCards() {
      var numRows = Math.sqrt(cards.length);
      var numCols = numRows;
  
      // Figure the width and height (in pixels) of the rectangles
      var cardWidth = (getWidth() - ((numCols + 1) * 5)) / numCols;
      var cardHeight = (getHeight() - (numRows * 5) - 50) / numRows;
  
      for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
  
          var card = new Rectangle(cardWidth, cardHeight);
          var x = 5 + (col * (cardWidth + 5));    // Formula for the x position
          var y = 50 + (row * (cardHeight + 5));  // Formula for the y position 
          card.setPosition(x, y);
          add(card);
  
          covers.push(card);    // Store each rectangle in an array
        }
      }
    }
  
    function makeCards() {
      // Create the "player's" cards from the master card deck
      for (var i = 0; i < CARDS.length; i++) {
        cards.push(CARDS[i]);
        cards.push(CARDS[i]);
      }
      cards.push("WILD");
  
      // Shuffle the cards
      for (var i = 0; i < 1000; i++) {
        var removedIndex = Randomizer.nextInt(0, cards.length - 1);
        var removedCard = cards.remove(removedIndex);
        cards.push(removedCard);
      }
    }
  
    function eraseScreen() {
      var rect = new Rectangle(getWidth(), getHeight());
      rect.setColor(Color.WHITE);
      add(rect);
    }
  
    function handleMouseClicks(e) {
  
      // Use "getElementAt" to determine what was clicked on
      var thing = getElementAt(e.getX(), e.getY());
  
      if (thing == playGameBtn) {
        // They clicked on the play game button
        buttonSound.play();
        startGame();
      }
  
      if (thing == insBtn) {
        // Show the insrcutions screen
        buttonSound.play();
        showInstructionsScreen();
      }
      
      if (thing == backBtn) {
        buttonSound.play();
        showWelcomeScreen();
      }
  
      // Remove the card that they clicked on
      if (turnOver == true && covers.indexOf(thing) >= 0) {
        doTurn(thing);
      }

      // Handle player clicking on high score name entry screen
      if (nameChars.indexOf(thing) >= 0) {
        // They clicked on a character for the high score name
        if (thing.getText() == "SPACE") {
          hsName += " ";
        } else if (thing.getText() == "BACK") {
          hsName = hsName.slice(0, -1);
        } else if (thing.getText() == "DONE") {
          startGame();
        } else {
          hsName += thing.getText();
        }
      }
      console.log(hsName);
    }
  
    function doTurn(cover) {
      var cardIdx = covers.indexOf(cover);
      var card = cards[cardIdx];
  
      flipCard(covers.indexOf(cover));
  
      if (lastCardIdx < 0) {  // This is the first card they clicked
        // They've clicked on their first card
        lastCardIdx = covers.indexOf(cover);
      } else {
        // They've clicked on their second card 
        var lastCard = cards[lastCardIdx];
        turnOver = false;   // Keeps player from clicking again within 2 seconds
        if (lastCard == card || lastCard == "WILD" || card == "WILD") {
          matches++;
          matchSound.play();
          if (card == "WILD") {
            // Find the name that matches the last card
            cards[lastCardIdx] = "";
            var matchingIdx = cards.indexOf(lastCard);
            flipCard(matchingIdx);
          } else if (lastCard == "WILD") {
            // Find the name that matches this card
            cards[cardIdx] = "";
            var matchingIdx = cards.indexOf(card);
            flipCard(matchingIdx);
          }
          turnOver = true;
          // Leave the cards face up
        } else {
          misses++;
          missSound.play();
          // Cards did not match
          var lastCover = covers[lastCardIdx];
          setTimeout(function() {
            add(lastCover);
            add(cover); 
            turnOver = true;
          }, 2000);
        }
        lastCardIdx = -1;
      }
  
      // Check to see if player won
      if (matches == Math.floor(NUM_CARDS / 2)) {
        endGame();
      }
    }
  
    function flipCard(cardIndex) {
      var cover = covers[cardIndex];
      var card = cards[cardIndex];
  
      remove(cover);
  
      // This displays the name under the cover
      if (card == "WILD") {
        var cardTxt = new Text(card, "12pt Arial");
        cardTxt.setPosition(cover.getX(), cover.getY() + 20);
        add(cardTxt);
      } else {
        var picture = new WebImage(card);
        picture.setSize(cover.getWidth(), cover.getHeight());
        picture.setPosition(cover.getX(), cover.getY());
        add(picture);
      }
    }
    
    function getTimeBonus() {
      return (GAME_DURATION - elapsedTime) * 10;
    }
  
    function getAccuracyBonus() {
      return getAccuracy();
    }
  
    function getFinalScore() {
      return matches * 100 + getAccuracyBonus() + getTimeBonus();
    }
  
    function showGameOverScreen() {
  
      // Calculate the final score
      var accuracyBonus = getAccuracyBonus();
      var timeBonus = getTimeBonus();
      var finalScore = getFinalScore();
  
      var rect = new Rectangle(getWidth() / 2, getHeight() / 2);
      rect.setPosition(getWidth() / 2 - rect.getWidth() / 2, getHeight() / 2 - rect.getHeight() / 2);
      rect.setColor(Color.WHITE);
      add(rect);
  
      var text = new Text("GAME OVER");
      text.setPosition(getWidth() / 2 - text.getWidth() / 2, rect.getY() + text.getHeight() * 2);
      add(text);
  
      var accB = new Text("ACCURACY BONUS: " + accuracyBonus);
      accB.setPosition(getWidth() / 2 - accB.getWidth() / 2, rect.getY() + accB.getHeight() * 4);
      add(accB);
  
      var timeB = new Text("TIME BONUS: " + timeBonus);
      timeB.setPosition(getWidth() / 2 - timeB.getWidth() / 2, rect.getY() + timeB.getHeight() * 5);
      add(timeB);
  
      var score = new Text("FINAL SCORE: " + finalScore);
      score.setPosition(getWidth() / 2 - score.getWidth() / 2, rect.getY() + score.getHeight() * 6);
      add(score);
  
      var btn = new Text("Play Again", "20pt Arial");
      btn.setPosition(getWidth() / 2 - btn.getWidth() / 2, rect.getY() + btn.getHeight() * 8);
      add(btn);
      playGameBtn = btn;
    }
  
    function showWelcomeScreen() {
      eraseScreen();
  
      var img = new WebImage("https://res.cloudinary.com/united-high-school/image/upload/v1636645692/fall_2021/period_1/welcome_screen.jpg");
      img.setSize(getWidth(), getHeight());
      add(img);
  
      var btn = new Text("          ", "40pt Arial");
      btn.setPosition(50, getHeight() - 60);
      add(btn);
      playGameBtn = btn;
  
      btn = new Text("          ", "40pt Arial");
      btn.setPosition(getWidth() - btn.getWidth() - 60, getHeight() - 60);
      add(btn);
      insBtn = btn;

      hs.read(function(obj) {
        if (!obj.error) {
          hsName = obj.name;
          hsScore = obj.score;
          var scoreTxt = new Text("High Score: " + hsScore + " by " + hsName);
          scoreTxt.setPosition(getWidth() / 2 - scoreTxt.getWidth() / 2, scoreTxt.getHeight());
          add(scoreTxt);
        }
      });
    }
  
    function showInstructionsScreen() {
      eraseScreen();
  
      var txt = new Text("HERE ARE THE INSTRUCTIONS", "30pt Arial");
      txt.setPosition(getWidth() / 2 - txt.getWidth() / 2, getHeight() / 2);
      add(txt);
  
      var btn = new Text("Back", "30pt Arial");
      btn.setPosition(0, getHeight() - 5);
      add(btn);
      backBtn = btn;
    }
  
    function showNameEntryScreen() {
      eraseScreen();

      hsName = "";
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var row = 0;
      var col = 0;
      for (var i = 0; i < chars.length; i++) {
        var txt = new Text(chars.charAt(i));
        txt.setPosition(30 + col * 30, 30 + row * 30);
        add(txt);
        nameChars.push(txt);
        col++;
        if (col >= 12) {
          col = 0;
          row++;
        }
      }
      var space = new Text("SPACE");
      space.setPosition(txt.getX() + txt.getWidth() + 20, txt.getY());
      add(space);
      nameChars.push(space);
      var back = new Text("BACK");
      back.setPosition(space.getX() + space.getWidth() + 20, space.getY());
      add(back);
      nameChars.push(back);
      var done = new Text("DONE");
      done.setPosition(back.getX() + back.getWidth() + 20, back.getY());
      add(done);
      nameChars.push(done);
    }

    /*****  END PROGRAM CODE HERE *****/
    
    if (typeof start === 'function') {
      start();
    }
    
  }  