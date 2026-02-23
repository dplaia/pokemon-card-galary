<script>
    import { onMount } from "svelte";
    import Card from "./lib/components/CardProxy.svelte";

    export let options = { layers: 7 };
    export let onMenu = () => {};

    let cards = [];
    let pyramid = [];
    let stock = [];
    let waste = [];
    let selectedCards = [];
    let gameState = "playing"; // "playing", "won", "lost"
    
    // Playing cards configuration
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    const cardValues = {
        'ace': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, 
        '8': 8, '9': 9, '10': 10, 'jack': 11, 'queen': 12, 'king': 13
    };

    // Rarity configuration for CSS effects
    const rarities = [
        { name: "Common", weight: 50 },
        { name: "Uncommon", weight: 30 },
        { name: "Rare Holo", weight: 15 },
        { name: "Rare Ultra", weight: 4 },
        { name: "Rare Secret", weight: 1 }
    ];

    function getRandomRarity() {
        const rand = Math.random() * 100;
        let sum = 0;
        for (let r of rarities) {
            sum += r.weight;
            if (rand <= sum) return r.name;
        }
        return "Common";
    }

    function generateDeck() {
        let deck = [];
        let idCounter = 0;
        for (let suit of suits) {
            for (let value of values) {
                deck.push({
                    id: `card-${idCounter++}`,
                    name: `${value} of ${suit}`,
                    value: cardValues[value],
                    img: `/images/Playing Cards/PNG-cards-1.3/${value}_of_${suit}.png`,
                    rarity: getRandomRarity(),
                    // Fake pokemon data to trigger effects
                    set: "base1",
                    number: "1",
                    supertype: "Pokémon",
                    subtypes: ["Basic"],
                    types: ["Colorless"],
                    isReverse: Math.random() > 0.8
                });
            }
        }
        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    let stockCycles = 0;
    const MAX_CYCLES = 3;

    function initGame() {
        gameState = "playing";
        selectedCards = [];
        cards = generateDeck();
        pyramid = [];
        stockCycles = 0;
        
        let cardIndex = 0;
        // Build pyramid layers
        for (let row = 0; row < options.layers; row++) {
            let rowCards = [];
            for (let col = 0; col <= row; col++) {
                if (cardIndex < cards.length) {
                    rowCards.push({
                        ...cards[cardIndex++],
                        row,
                        col,
                        isFaceUp: true, // In standard pyramid, all cards are face up but blocked
                        removed: false
                    });
                }
            }
            pyramid.push(rowCards);
        }

        // Remaining cards go to stock
        stock = cards.slice(cardIndex).map(c => ({...c, isFaceUp: false}));
        waste = [];
    }

    function drawCard() {
        if (stock.length > 0) {
            const card = stock.pop();
            card.isFaceUp = true;
            waste.push(card);
            waste = waste; // trigger reactivity
            stock = stock;
        } else if (waste.length > 0 && stockCycles < MAX_CYCLES - 1) {
            // Recycle waste to stock
            stock = waste.reverse().map(c => ({...c, isFaceUp: false}));
            waste = [];
            stockCycles++;
        }
        selectedCards = []; // clear selection on draw
        setTimeout(checkLossCondition, 0); // Check loss condition after drawing
    }

    function isCardPlayable(row, col) {
        // A card in the pyramid is playable if it's not covered by any cards in the row below it
        if (row === pyramid.length - 1) return true; // Bottom row is always playable
        
        const leftChild = pyramid[row + 1][col];
        const rightChild = pyramid[row + 1][col + 1];
        
        return (leftChild.removed && rightChild.removed);
    }

    function checkWinCondition() {
        // Win if all pyramid cards are removed
        const allRemoved = pyramid.every(row => row.every(card => card.removed));
        if (allRemoved) {
            gameState = "won";
            return;
        }

        // Check if there are any possible moves left
        // Wait until next tick so the state is updated
        setTimeout(checkLossCondition, 0);
    }

    function checkLossCondition() {
        if (gameState !== "playing") return;

        let availableCards = [];
        
        // Add playable pyramid cards
        for (let row = 0; row < pyramid.length; row++) {
            for (let col = 0; col < pyramid[row].length; col++) {
                if (!pyramid[row][col].removed && isCardPlayable(row, col)) {
                    availableCards.push(pyramid[row][col]);
                }
            }
        }

        // Add top of waste if exists
        if (waste.length > 0) {
            availableCards.push(waste[waste.length - 1]);
        }

        // If there are cards in the stock, game is not lost yet
        if (stock.length > 0 || stockCycles < MAX_CYCLES - 1) return;

        // Check if any card is a King (13)
        if (availableCards.some(c => c.value === 13)) return;

        // Check if any two available cards sum to 13
        for (let i = 0; i < availableCards.length; i++) {
            for (let j = i + 1; j < availableCards.length; j++) {
                if (availableCards[i].value + availableCards[j].value === 13) {
                    return; // Move is possible
                }
            }
        }

        // No moves possible and stock is empty -> game over
        gameState = "lost";
    }

    function selectCard(source, index, row, col) {
        let card;
        
        if (source === 'pyramid') {
            if (!isCardPlayable(row, col)) return;
            card = pyramid[row][col];
            if (card.removed) return;
        } else if (source === 'waste') {
            if (waste.length === 0 || index !== waste.length - 1) return;
            card = waste[index];
        }

        // Toggle selection
        const selectedIndex = selectedCards.findIndex(c => c.card === card);
        if (selectedIndex >= 0) {
            selectedCards.splice(selectedIndex, 1);
            selectedCards = selectedCards;
            return;
        }

        // Add to selection
        selectedCards.push({ card, source, row, col, index });
        selectedCards = selectedCards;

        // Check for match
        if (card.value === 13) {
            // King can be removed alone
            removeSelectedCards();
        } else if (selectedCards.length === 2) {
            if (selectedCards[0].card.value + selectedCards[1].card.value === 13) {
                removeSelectedCards();
            } else {
                // Not a match, deselect all but the newly selected one
                selectedCards = [selectedCards[1]];
            }
        }
    }

    function removeSelectedCards() {
        setTimeout(() => {
            selectedCards.forEach(sel => {
                if (sel.source === 'pyramid') {
                    pyramid[sel.row][sel.col].removed = true;
                } else if (sel.source === 'waste') {
                    waste.pop();
                }
            });
            pyramid = pyramid;
            waste = waste;
            selectedCards = [];
            checkWinCondition();
        }, 300);
    }

    function isSelected(card) {
        return selectedCards.some(s => s.card === card);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    onMount(() => {
        initGame();
    });

</script>

<div class="game-container" style="--card-min-width: {Math.max(60, Math.min(120, 800 / options.layers))}px;">
    <header class="game-header">
        <button class="btn-menu" on:click={onMenu}>← Menu</button>
        <div class="title">Pyramid Solitaire</div>
        <button class="btn-icon" on:click={toggleFullscreen} title="Toggle Fullscreen">
            ⛶
        </button>
    </header>

    <div class="play-area">
        {#if gameState !== "playing"}
            <div class="overlay">
                <div class="result-modal">
                    <h2>{gameState === "won" ? "You Won! 🎉" : "Game Over"}</h2>
                    <button class="primary" on:click={initGame}>Play Again</button>
                    <button class="secondary" on:click={onMenu}>Main Menu</button>
                </div>
            </div>
        {/if}

        <div class="pyramid">
            {#each pyramid as rowCards, row}
                <div class="pyramid-row">
                    {#each rowCards as card, col}
                        <div class="card-slot {card.removed ? 'removed' : ''} {isSelected(card) ? 'selected' : ''} {!isCardPlayable(row, col) ? 'blocked' : ''}">
                            {#if !card.removed}
                                <div class="card-wrapper" role="button" tabindex="0" on:click={() => selectCard('pyramid', null, row, col)} on:keydown={(e) => e.key === 'Enter' && selectCard('pyramid', null, row, col)}>
                                    <Card
                                        id={card.id}
                                        name={card.name}
                                        number={card.number}
                                        set={card.set}
                                        types={card.types}
                                        supertype={card.supertype}
                                        subtypes={card.subtypes}
                                        rarity={card.rarity}
                                        isReverse={card.isReverse}
                                        img={card.img}
                                    />
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>

        <div class="deck-area">
            <div class="stock" role="button" tabindex="0" on:click={drawCard} on:keydown={(e) => e.key === 'Enter' && drawCard()}>
                {#if stock.length > 0}
                    <div class="card-wrapper">
                        <Card
                            id="stock-back"
                            name="Card Back"
                            number="0"
                            set="base1"
                            img=""
                            rarity="Common"
                            isReverse={false}
                        />
                    </div>
                {:else if stockCycles < MAX_CYCLES - 1}
                    <div class="empty-slot">↺</div>
                {:else}
                    <div class="empty-slot">✕</div>
                {/if}
                <div class="cycle-indicator">Cycles: {stockCycles + 1}/{MAX_CYCLES}</div>
            </div>

            <div class="waste">
                {#if waste.length > 0}
                    {@const topCard = waste[waste.length - 1]}
                    <div class="card-wrapper {isSelected(topCard) ? 'selected' : ''}" role="button" tabindex="0" on:click={() => selectCard('waste', waste.length - 1)} on:keydown={(e) => e.key === 'Enter' && selectCard('waste', waste.length - 1)}>
                        <Card
                            id={topCard.id}
                            name={topCard.name}
                            number={topCard.number}
                            set={topCard.set}
                            types={topCard.types}
                            supertype={topCard.supertype}
                            subtypes={topCard.subtypes}
                            rarity={topCard.rarity}
                            isReverse={topCard.isReverse}
                            img={topCard.img}
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .game-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: radial-gradient(circle at center, #2b580c 0%, #1a3c05 100%);
        color: white;
        overflow: hidden;
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: rgba(0, 0, 0, 0.4);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 10;
    }

    .title {
        font-size: 1.5rem;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    .btn-menu {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .btn-menu:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .btn-icon {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
    }

    .btn-icon:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .play-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        position: relative;
        overflow-y: auto;
    }

    .pyramid {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 3rem;
        z-index: 1;
    }

    .pyramid-row {
        display: flex;
        justify-content: center;
        margin-top: calc(var(--card-min-width) * -0.6); /* Overlap rows */
    }

    .pyramid-row:first-child {
        margin-top: 0;
    }

    .card-slot {
        width: var(--card-min-width);
        height: calc(var(--card-min-width) * 1.39);
        margin: 0 5px;
        transition: transform 0.2s, filter 0.2s;
        position: relative;
        z-index: 1;
    }

    .card-slot:hover {
        z-index: 10;
    }

    .card-wrapper {
        width: 100%;
        height: 100%;
        cursor: pointer;
        border-radius: 8px;
        position: relative;
    }

    /* Transform Card component down slightly to fit slot */
    .card-wrapper :global(.card) {
        width: var(--card-min-width) !important;
        height: calc(var(--card-min-width) * 1.39) !important;
        font-size: calc(var(--card-min-width) / 20) !important;
        pointer-events: none; /* Let wrapper handle clicks to avoid capturing click events from Svelte */
    }

    /* Keep the hover effect on the wrapper instead of the card itself */
    .card-wrapper:hover :global(.card) {
        --pointer-x: 25% !important;
        --pointer-y: 10% !important;
        --card-scale: 1.1 !important;
        --card-opacity: 1 !important;
        --translate-y: -10px !important;
        --rotate-x: 7deg !important;
        --rotate-y: -19deg !important;
        --background-x: 44% !important;
        --background-y: 36% !important;
    }

    .card-slot.selected {
        transform: translateY(-15px);
        filter: drop-shadow(0 0 10px #f2c94c);
    }

    .card-slot.blocked {
        filter: brightness(0.6);
        pointer-events: none;
    }

    .card-slot.removed {
        pointer-events: none;
    }

    .deck-area {
        display: flex;
        gap: 2rem;
        margin-top: auto;
        padding-bottom: 2rem;
    }

    .stock, .waste {
        width: var(--card-min-width);
        height: calc(var(--card-min-width) * 1.39);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
        border: 2px dashed rgba(255, 255, 255, 0.2);
        position: relative;
    }

    .stock {
        cursor: pointer;
        transition: transform 0.1s;
    }

    .stock:active {
        transform: scale(0.95);
    }

    .waste .card-wrapper.selected {
        transform: translateY(-15px);
        filter: drop-shadow(0 0 10px #f2c94c);
    }

    .empty-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 3rem;
        color: rgba(255, 255, 255, 0.3);
    }

    .cycle-indicator {
        position: absolute;
        bottom: -25px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
    }

    /* Modals */
    .overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        backdrop-filter: blur(5px);
    }

    .result-modal {
        background: #1a1a2e;
        padding: 3rem;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1);
    }

    .result-modal h2 {
        font-size: 3rem;
        margin-bottom: 2rem;
        color: #f2c94c;
    }

    .result-modal button {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
        padding: 1rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
    }

    .result-modal button.primary {
        background: #f2c94c;
        color: #1a1a2e;
    }

    .result-modal button.secondary {
        background: rgba(255,255,255,0.1);
        color: white;
    }
</style>
