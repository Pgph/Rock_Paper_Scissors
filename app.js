//state
//  score
//  player pick
//  ai pick

const playerWinsLSKey = "playerwins";
const aiWinsLSKey = "aiWins";

const winningResultsMap = {
  paper: ["rock"],
  rock: ["scissors"],
  scissors: ["paper"],
};

let state = {
  playerWins: Number(localStorage.getItem(playerWinsLSKey)) || 0,
  aiWins: Number(localStorage.getItem(aiWinsLSKey)) || 0,
  playerPick: null,
  aiPick: null,
};

const renderScore = () => {
  const pointsElement = document.querySelector(".points");
  pointsElement.innerText = state.playerWins - state.aiWins;
};

const bindPickEvents = () => {
  document.querySelectorAll(".options button").forEach((button) => {
    button.addEventListener("click", pick);
  });

  document.querySelector(".result__button").addEventListener("click", reset);
};

const pick = (e) => {
  pickByPlayer(e.currentTarget.dataset.pick);
  pickByAi();
  hideOptions();
  showFight();
};

const pickByPlayer = (pickedOption) => {
  state = {
    ...state,
    playerPick: pickedOption,
  };
};

let pickByAi = () => {
  const options = ["rock", "paper", "scissors"];
  const aiPick = options[Math.floor(Math.random() * options.length)];

  state = {
    ...state,
    aiPick,
  };
};

const hideOptions = () => {
  const optionsElement = document.querySelector(".options");
  optionsElement.classList.add("slide-left");
};

const showFight = () => {
  const fightElement = document.querySelector(".fight");
  fightElement.classList.remove("hidden");
  fightElement.classList.add("slide-left");
  createElementPickedByPlayer();
  createElementPickedByAi();

  document.querySelectorAll(".options button").forEach((button) => {
    button.setAttribute("tabindex", -1);
  });
  document.querySelector(".result__button").setAttribute("tabindex", 0);

  showResult();
};

const showResult = () => {
  const resultTextElement = document.querySelector(".result__text");
  if (state.aiPick === state.playerPick) {
    resultTextElement.innerText = "DRAW";
    console.log("Draw");
  } else if (winningResultsMap[state.playerPick].includes(state.aiPick)) {
    resultTextElement.innerText = "YOU WIN";
    localStorage.setItem(playerWinsLSKey, state.playerWins + 1);
    console.log("player wins");
    state = {
      ...state,
      playerWins: state.playerWins + 1,
    };
  } else {
    resultTextElement.innerText = "YOU LOSE";
    localStorage.setItem(playerWinsLSKey, state.aiWins + 1);
    console.log("AI wins");
    state = {
      ...state,
      aiWins: state.aiWins + 1,
    };
  }
  setTimeout(renderResult, 1000);

  renderScore();
};

const renderResult = () => {
  document.querySelector(".result").classList.add("shown");
  document.querySelector(".pick--player").classList.add("moved");
  document.querySelector(".pick--ai").classList.add("moved");
};

const createElementPickedByPlayer = () => {
  const playerPick = state.playerPick;

  const pickContainerElement = document.querySelector(
    ".pick__container--player"
  );
  pickContainerElement.innerHTML = "";
  pickContainerElement.appendChild(createPickElement(playerPick));
};

const createElementPickedByAi = () => {
  const aiPick = state.aiPick;
  const pickContainerElement = document.querySelector(".pick__container--ai");
  pickContainerElement.innerHTML = "";
  pickContainerElement.appendChild(createPickElement(aiPick));
};

const createPickElement = (option) => {
  const pickElement = document.createElement("div");
  pickElement.classList.add("button", `button--${option}`);

  const imageContainerElement = document.createElement("div");
  imageContainerElement.classList.add("button__image-container");

  const imgElement = document.createElement("img");
  imgElement.src = `./images/icon-${option}.svg`;
  imgElement.alt = option;

  imageContainerElement.appendChild(imgElement);

  pickElement.appendChild(imageContainerElement);

  return pickElement;
};

const reset = () => {
  const fightElement = document.querySelector(".fight");
  fightElement.classList.remove("slide-left");

  const optionsElement = document.querySelector(".options");
  optionsElement.classList.remove("slide-left");

  document.querySelectorAll(".options button").forEach((button) => {
    button.setAttribute("tabindex", 0);
  });
  document.querySelector(".result__button").setAttribute("tabindex", -1);
};

const init = () => {
  renderScore();
  bindPickEvents();
};

init();
