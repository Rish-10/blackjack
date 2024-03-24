let player = {
    name: "You",
    chips: 250,
    stake: 10,
    currentStake: 0
}
let cards = []
let displayed = [false, false, false, false, false]
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
let aceAdapt = [false, false, false, false, false]
let survived = false

let messageEl = document.getElementById("message-el")
let playerEl = document.querySelector("#player-el")
let stakeEl = document.querySelector("#stake-el")
let currentStakeEl = document.querySelector("#current-stake-el")
let gameOptions = document.getElementById("game-options")
let startingMenu = document.getElementById("starting-menu")
let sumEl = document.getElementById("sum-el")


let stand = false
let endGame = true

let dealerSum = 0 
let dealerCards = []
let dealerDisplayed = [false, false, false, false, false]
let dealerHasBlackJack = false
let dealerAceAdapt = [false, false, false, false, false]
let dealerSurvived = false
let dealerIsAlive = false

playerEl.textContent = player.name + ": $" + player.chips


function getRandomCard() {
    let theCard = Math.floor(Math.random() * 13) + 1
    return theCard
}


function newGame() {
    resetGame()
    dealerStart()
    sum = 0 
    hasBlackJack = false
    survived = false
    isAlive = true
    stand = false
    endGame = false
    survived = false
    messageEl.className = "disappear"


    player.currentStake = player.stake
    currentStakeEl.textContent = "Current Stake: $" + player.currentStake
    if (player.chips !== 0) {
        player.chips -= player.currentStake
    }
    playerEl.textContent = player.name + ": $" + player.chips

    gameOptions.className = ""
    startingMenu.className = "disappear"

    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards = [firstCard, secondCard]

    if (firstCard === 11 || firstCard === 12 || firstCard === 13) {
        sum += 10
    } else if (firstCard === 1) {
        sum += 11
    } else {
        sum += firstCard
    }

    if (secondCard === 11 || secondCard === 12 || secondCard === 13) {
        sum += 10
    } else if (secondCard === 1) {
        sum += 11
    } else {
        sum += secondCard
    }

    renderGame()
    
}


function resetGame() {
    for (let i = 0; i < 5; i++) {
        let x = i + 1
        let theCardElement = "card" + x + "-el"
        let currentCard = document.getElementById(theCardElement)
        currentCard.src = ""
        currentCard.className = "empty"
        displayed[i] = false
        aceAdapt[i] = false

        let dealerCardElement = "dealer" + x
        let dealerCurrentCard = document.getElementById(dealerCardElement)
        dealerCurrentCard.src = ""
        dealerCurrentCard.className = "empty"
        dealerDisplayed[i] = false
        dealerAceAdapt[i] = false
    }
}


function renderGame() {
    if (stand === false && endGame === false) {
        for (let i = 0; i < cards.length; i++) {
            if (displayed[i] === false) {
                let suit = Math.floor(Math.random() * 4) + 1
                let x = i + 1
                let theCardElement = "card" + x + "-el"
                let currentCard = document.getElementById(theCardElement)
                let cardImg = cards[i] + ".png"
                currentCard.className = "card-img"
                currentCard.src = "cards/" + suit + "/" + cardImg
                displayed[i] = true
            } 
        }


        if (dealerSum === 21) {
            for (let i = 0; i < dealerCards.length; i++) {
                if (dealerDisplayed[i] === false) {
                    let dealerSuit = Math.floor(Math.random() * 4) + 1
                    let dealerX = i + 1
                    let theDealerCardElement = "dealer" + dealerX
                    let currentDealerCard = document.getElementById(theDealerCardElement)
                    let dealerCardImg = dealerCards[i] + ".png"
                    currentDealerCard.className = "card-img"
                    currentDealerCard.src = "cards/" + dealerSuit + "/" + dealerCardImg
                    dealerDisplayed[i] = true
                }
            }

            dealerHasBlackJack = true
            messageEl.className = ""
            endGame = true 
            playerLoses()
            message = "Unlucky, Dealer got Blackjack! Try again:"
            messageEl.className = "lost"

        } else {

            if (sum <= 21 && cards.length === 5) {
                messageEl.className = ""
                message = "Wow, a 5-Card Charlie. You win!"
                messageEl.className = "won"
                endGame = true
                playerWins()
            } else if (sum === 21) {
                messageEl.className = "won"
                message = "You've got Blackjack!"
                hasBlackJack = true
                endGame = true 
                playerWins()
            } else if (sum <= 20) {
                message = "HIT or STAND?"
            } else {
                survived = false
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i] === 1 && aceAdapt[i] == false && sum > 21) {
                        sum = sum - 10
                        survived = true
                        aceAdapt[i] = true
                    }
                }
                if (survived === false) {
                    messageEl.className = ""
                    message = "Busted! Try again:"
                    messageEl.className = "lost"
                    isAlive = false
                    endGame = true
                    playerLoses()
                } else {
                    message = "HIT OR STAND?"
                    isAlive = true
                }
            }
        }
    }
    


    if (stand === true && displayed[0] === true && endGame === false) {
        for (let i = 0; i < dealerCards.length; i++) {
            if (dealerDisplayed[i] === false) {
                let suit = Math.floor(Math.random() * 4) + 1
                let x = i + 1
                let theCardElement = "dealer" + x
                let currentCard = document.getElementById(theCardElement)
                let cardImg = dealerCards[i] + ".png"
                currentCard.className = "card-img"
                currentCard.src = "cards/" + suit + "/" + cardImg
                dealerDisplayed[i] = true
            } 
        }
    

        if (dealerSum === 21) {
            dealerHasBlackJack = true
            messageEl.className = ""
            message = "Unlucky, Dealer got Blackjack! Try again:"
            messageEl.className = "lost"
            endGame = true 
            playerLoses()
        } else if (dealerSum > sum && dealerSum <= 21) {
            messageEl.className = ""
            message = "Dealer Wins! Try again:"
            messageEl.className = "lost"
            endGame = true
            playerLoses()
        } else if (dealerSum === sum) {
            messageEl.className = ""
            message = "That's a push. Try again:"
            messageEl.className = "lost"
            endGame = true
            playerTies()
        } else if (dealerSum < 17 && dealerSum < sum && dealerCards.length < 5){
            messageEl.className = ""
            message = "Dealer is now drawing. *drumroll*"
            dealerNewCard()
        } else {
            dealerSurvived = false
            for (let i = 0; i < dealerCards.length; i++) {
                if (dealerCards[i] === 1 && dealerAceAdapt[i] == false && dealerSum > 21) {
                    dealerSum = dealerSum - 10
                    dealerSurvived = true
                    dealerAceAdapt[i] = true
                }
            }
            if (dealerSurvived === false && sum > dealerSum) {
                messageEl.className = ""
                message = "You win!"
                messageEl.className = "won"
                dealerIsAlive = false
                endGame = true
                playerWins()
            } else if (dealerSurvived === false) {
                messageEl.className = ""
                message = "You win! Dealer busted!"
                messageEl.className = "won"
                dealerIsAlive = false
                endGame = true
                playerWins()
            } else if (dealerSurvived === true && dealerCards.length < 5){
                messageEl.className = ""
                message = "Dealer is now drawing. *drumroll*"
                dealerIsAlive = true
                dealerNewCard()
            } else {
                messageEl.className = ""
                message = "You win!"
                messageEl.className = "won"
                dealerIsAlive = false
                endGame = true
                playerWins()
            }
        }
    }
    sumEl.textContent = `${sum}`
    messageEl.textContent = message 
}


function newCard() {
    if (isAlive === true && hasBlackJack === false && cards.length < 5 && endGame === false) {
        let newCard = getRandomCard()
        if (newCard === 11 || newCard === 12 || newCard === 13) {
            sum += 10
        } else if (newCard === 1) {
            sum += 11
        } else {
            sum += newCard
        }
        cards.push(newCard)
        sumEl.textContent = sum
        renderGame()
    } else if (isAlive === true && hasBlackJack === false && cards.length === 5 && endGame === false) {
        // stand = true
        sumEl.textContent = sum
        renderGame()
    }
}


function dealerStart() {
    let dealerFirstCard = getRandomCard()
    let dealerSecondCard = getRandomCard()
    dealerCards = [dealerFirstCard, dealerSecondCard]
    dealerSum = 0 
    dealerHasBlackJack = false
    dealerSurvived = false
    dealerIsAlive = true

    if (dealerFirstCard === 11 || dealerFirstCard === 12 || dealerFirstCard === 13) {
        dealerSum += 10
    } else if (dealerFirstCard === 1) {
        dealerSum += 11
    } else {
        dealerSum += dealerFirstCard
    }

    if (dealerSecondCard === 11 || dealerSecondCard === 12 || dealerSecondCard === 13) {
        dealerSum += 10
    } else if (dealerSecondCard === 1) {
        dealerSum += 11
    } else {
        dealerSum += dealerSecondCard
    }

    let dealerSuit = Math.floor(Math.random() * 4) + 1
    let dealerCurrentCard = document.getElementById("dealer2")
    dealerCurrentCard.className = "card-img"
    let dealerCardImg = dealerSecondCard + ".png"
    dealerCurrentCard.src = "cards/" + dealerSuit + "/" + dealerCardImg
    dealerDisplayed[1] = true

    let otherCard = document.getElementById("dealer1")
    otherCard.className = "card-img"
    otherCard.src = "cards/covers/red.png"
    dealerDisplayed[0] = false
}


function dealerNewCard() {
    setTimeout(function () {
        if (dealerIsAlive === true && dealerHasBlackJack === false && dealerCards.length < 5 && endGame === false) {
            let dealerNewCard = getRandomCard()
            if (dealerNewCard === 11 || dealerNewCard === 12 || dealerNewCard === 13) {
                dealerSum += 10
            } else if (dealerNewCard === 1) {
                dealerSum += 11
            } else {
                dealerSum += dealerNewCard
            }
            dealerCards.push(dealerNewCard)
            renderGame()
        } else {
            renderGame()
        }
    }, 2000)
}


function nowStand() {
    if (endGame === false) {
        stand = true
        renderGame()
    }
}





function playerWins() {
    endGame = true
    player.currentStake = player.currentStake * 2
    player.chips += player.currentStake
    currentStakeEl.textContent = "You just won $" + player.currentStake
    playerEl.textContent = player.name + ": $" + player.chips
    player.currentStake = 0
    gameOptions.className = "disappear"
    startingMenu.className = ""

}

function playerLoses() {
    endGame = true
    currentStakeEl.textContent = "You just lost $" + player.currentStake
    player.currentStake = 0 
    gameOptions.className = "disappear"
    startingMenu.className = ""
    if (player.chips === 0) {
        player.stake = 10 
        stakeEl.textContent = "Stake: $" + player.stake
    } else if (player.stake > player.chips) {
        player.stake = player.chips
        stakeEl.textContent = "Stake: $" + player.stake
    }
}

function playerTies() {
    endGame = true
    currentStakeEl.textContent = "Nothing is won or lost"
    player.currentStake = 0 
    gameOptions.className = "disappear"
    startingMenu.className = ""
}


function raiseStake() {
    if (player.stake < player.chips && endGame === true) {
        player.stake += 10
        stakeEl.textContent = "Stake: $" + player.stake
    } else if (player.chips === 0 && endGame === true) {
        player.stake = 10 
        stakeEl.textContent = "Stake: $" + player.stake
    }
}

function lowerStake() {
    if (player.stake > 0 && endGame === true) {
        player.stake -= 10
        stakeEl.textContent = "Stake: $" + player.stake
    }
}

function max() {
    if (endGame === true) {
        player.stake = player.chips
        stakeEl.textContent = "Stake: $" + player.stake
    } 
    
    if (player.chips === 0 && endGame === true) {
        player.stake = 10 
        stakeEl.textContent = "Stake: $" + player.stake
    }
}

function min() {
    if (endGame === true) {
        player.stake = 0
        stakeEl.textContent = "Stake: $" + player.stake
    }
}
