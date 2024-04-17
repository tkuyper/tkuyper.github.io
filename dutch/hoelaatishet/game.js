function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

class Time {
	constructor(hour, minute) {
    this.hour = hour;
    this.minute = minute;
    this.hours = ['twaalf', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf'];
    this.positions = [
      () => {
        const modMin = this.minute % 30;
        if (modMin == 0) return null;
        if (modMin == 15) return 'kwart';
        if (modMin % 10 == 0) return 'tien';
        return 'vijf';
      },
      () => {
        if (this.minute % 30 == 0) return null;
        let over = 1;
        if (Math.abs(30 - this.minute) < 15) over = -1;
        if (this.minute > 30) over = -over;
        if (over == 1) return 'over';
        return 'voor';
      },
      () => {
        if (Math.abs(30 - this.minute) < 15) return 'half';
        return null;
      },
      () => {
        if (this.minute <= 15) return this.wordForHour(this.hour);
        return this.wordForHour(this.hour + 1);
      },
      () => {
        if (this.minute == 0) return 'uur';
        return null;
      }
    ]
  }

  spokenString() {
    return this.positions
    	.map((fn) => fn())
      .filter((word) => word !== null)
      .join(' ');
  }

  wordForHour(hour) {
    const modHour = hour % 12;
    return this.hours[modHour];
  }

  static fromString(timeString) {
    timeString = timeString.trim();
    let timeArray = timeString.split('.');
    if (timeArray.length !== 2) {
      throw new Error("Expected format uu.mm");
    }
    console.log(`fromString: "${timeArray[0]}" "${timeArray[1]}"`);
    let hour = parseInt(timeArray[0], 10);
    let minute = parseInt(timeArray[1], 10);
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
      return new Time(hour, minute);
    }
    throw new Error("Invalid time");
  }
  
  toString() {
  	return `${String(this.hour).padStart(2, '0')}.${String(this.minute).padStart(2, '0')}`
  }

  equals(otherTime) {
    if (this.minute !== this.minute) return false;
    if (this.hour % 12 !== otherTime.hour % 12) return false;
    return true;
  }
}

class TimeGame {
	constructor() {
  	this.pickTime();
  }

  pickedTimeDigits() {
    return this.time.toString();
  }

  pickedTimeSpoken() {
    return this.time.spokenString();
  }
  
  pickTime() {
    this.time = new Time(getRandomInt(0, 24), getRandomInt(0, 12) * 5);
    console.log(`Time picked ${this.time.toString()}`);
  }
  
  checkAnswer(answer) {
    console.log(`Given answer is '${answer}'`);
    console.log(`Actual answer is '${this.time.spokenString()}'`);
  	return this.time.spokenString() === answer;
  }
}

class StreakCounter {
	constructor(streakNode) {
  	this.node = streakNode;
    this.resetStreak();
  }
  
  incrementStreak() {
  	this.streak++;
    this.node.innerText = this.streak;
  }
  
  resetStreak() {
  	this.streak = 0;
    this.node.innerText = this.streak;
  }
}

const game = new TimeGame();
const checkButton = document.getElementById("check-answer");
const antwoord = document.getElementById("antwoord");
const displayedTime = document.getElementById("displayed-time");
const streakCounter = document.getElementById("streak-counter");
const speelsoort = document.getElementById("speelsoort");
const errorNode = document.getElementById("error");
const streak = new StreakCounter(streakCounter);

function getDisplay(game) {
  if (speelsoort.checked) {
    return game.pickedTimeSpoken();
  } else {
    return game.pickedTimeDigits();
  }
}

displayedTime.innerText = getDisplay(game);
setQuestionSize();

function displayGame() {
  antwoord.value = '';
  displayedTime.innerText = getDisplay(game);
  displayedTime.classList.remove("success", "failure");
  checkButton.disabled = false;
}

function displaySuccess() {
  console.log("Correct!");
  displayedTime.innerText = "Correct!";
  displayedTime.classList.add("success");
  checkButton.disabled = true;
}

function displayFailure() {
  console.log("Wrong!");
  displayedTime.innerText = "Wrong";
  displayedTime.classList.add("failure");
  checkButton.disabled = true;
}

function setQuestionSize() {
  if (speelsoort.checked) {
    displayedTime.classList.remove("digits");
    displayedTime.classList.add("woords");
  } else {
    displayedTime.classList.remove("woords");
    displayedTime.classList.add("digits");
  }
}

checkButton.addEventListener("click", function() {
  errorNode.innerText = "";
  if (antwoord.value === "") {
    return;
  }
  let answer = antwoord.value.toLowerCase();
  if (speelsoort.checked) {
    try {
      answer = Time.fromString(antwoord.value).spokenString();
    } catch (e) {
      errorNode.innerText = e.message;
      return;
    }
  }
	if(game.checkAnswer(answer)) {
    displaySuccess();
    streak.incrementStreak();
  	game.pickTime();
    setTimeout(() => {
    	displayGame();
    }, 1000);
  } else {
    displayFailure();
    streak.resetStreak();
    setTimeout(() => {
    	displayGame();
    }, 1000);
  }
}, false);

antwoord.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
      checkButton.click();
  }
});

speelsoort.addEventListener("click", function() {
  game.pickTime();
  setQuestionSize();
  displayGame();
});
