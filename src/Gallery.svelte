<script>
  import { onMount } from "svelte";

        import Search from "./Search.svelte";
        import CardList from "./Cards.svelte";
        import Card from "./lib/components/CardProxy.svelte";
        import Sidebar from "./Sidebar.svelte";

        export let onMenu = () => {};

        let allCards = [];
        let filteredCards = [];
        let showcase;

        let query = "";
        let isLoading = true;
        let cardMinWidth = 300;
        let showPlayingCards = false;

        const playingCards = [
                "10_of_clubs", "10_of_diamonds", "10_of_hearts", "10_of_spades",
                "2_of_clubs", "2_of_diamonds", "2_of_hearts", "2_of_spades",
                "3_of_clubs", "3_of_diamonds", "3_of_hearts", "3_of_spades",
                "4_of_clubs", "4_of_diamonds", "4_of_hearts", "4_of_spades",
                "5_of_clubs", "5_of_diamonds", "5_of_hearts", "5_of_spades",
                "6_of_clubs", "6_of_diamonds", "6_of_hearts", "6_of_spades",
                "7_of_clubs", "7_of_diamonds", "7_of_hearts", "7_of_spades",
                "8_of_clubs", "8_of_diamonds", "8_of_hearts", "8_of_spades",
                "9_of_clubs", "9_of_diamonds", "9_of_hearts", "9_of_spades",
                "ace_of_clubs", "ace_of_diamonds", "ace_of_hearts", "ace_of_spades",
                "black_joker", "red_joker",
                "jack_of_clubs", "jack_of_diamonds", "jack_of_hearts", "jack_of_spades",
                "king_of_clubs", "king_of_diamonds", "king_of_hearts", "king_of_spades",
                "queen_of_clubs", "queen_of_diamonds", "queen_of_hearts", "queen_of_spades"
        ];

        function getPlayingCardImg(index) {
                const cardName = playingCards[index % playingCards.length];
                return `/images/Playing Cards/PNG-cards-1.3/${cardName}.png`;
        }

        const getCards = async () => {
                let cardFetch = await fetch("/data/cards.json");
                let cards = await cardFetch.json();
                return cards;
        };

        const loadCards = async() => {
                return getCards()
                        .then((cards) => {
                                allCards = cards;
                                filteredCards = cards;
                                showcase = cards[0];
                                isLoading = false;
                        });
        };

        onMount(() => {
                loadCards();
                const $headings = document.querySelectorAll("h1,h2,h3");
                const $anchor = [...$headings].filter((el) => {
                        const id = el.getAttribute("id")?.replace(/^.*?-/g,"");
                        const hash = window.location.hash?.replace(/^.*?-/g,"")
                        return id === hash;
                })[0];
                if( $anchor ) {
                        setTimeout(() => {
                                $anchor.scrollIntoView();
                        },100);
                }
        });

        // Filter cards when query changes
        $: {
                if (query.trim() === "") {
                        filteredCards = allCards;
                } else {
                        const lowercaseQuery = query.toLowerCase();
                        filteredCards = allCards.filter(card => 
                                card.name?.toLowerCase().includes(lowercaseQuery) ||
                                card.supertype?.toLowerCase().includes(lowercaseQuery) ||
                                card.subtypes?.some(subtype => subtype.toLowerCase().includes(lowercaseQuery)) ||
                                card.types?.some(type => type.toLowerCase().includes(lowercaseQuery)) ||
                                card.rarity?.toLowerCase().includes(lowercaseQuery) ||
                                card.set?.toLowerCase().includes(lowercaseQuery)
                        );
                }
        }
</script>

<div class="app-container" style="--card-min-width: {cardMinWidth}px">
        <Sidebar bind:minWidth={cardMinWidth} />
        <main>
                <header>
                        <div class="header-nav">
                                <button class="btn-menu" on:click={onMenu}>← Main Menu</button>
                        </div>
                        <h1 id="⚓-top">Pokemon Cards <sup>Gallery</sup></h1>

                <p class="author">By <a href="https://twitter.com/simeydotme"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> @simeydotme</a> |
                        <em><a href="https://github.com/simeydotme/pokemon-cards-css"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Simon Goellner</em>
                </p>

                <section class="intro" id="⚓-intro">
                        <p>
                                A collection of <mark>advanced CSS</mark> styles to create
                                <mark>realistic-looking effects</mark> for the faces of Pokemon cards.
                                The cards use <mark>3d transforms</mark>, <mark>filters</mark>, <mark>blend modes</mark>,
                                <mark>css gradients</mark> and interactions to provide a unique experience when taking a closer look!
                        </p>
                </section>

                <div class="showcase">
                        {#if !showcase}
                                loading...
                        {:else}
                                <Card
                                        id={showcase.id}
                                        name={showcase.name}
                                        set={showcase.set}
                                        number={showcase.number}
                                        types={showcase.types}
                                        supertype={showcase.supertype}
                                        subtypes={showcase.subtypes}
                                        rarity={showcase.rarity}
                                        isReverse={showcase.isReverse}
                                        showcase={true}
                                        img={showPlayingCards ? getPlayingCardImg(0) : undefined}
                                />
                        {/if}
                </div>

                <section class="info">
                        <h2>Click on a Card to take a Closer look!</h2>

                        <hr />

                        <p class="small">
                                I'm using SvelteJS to handle interactivity and state; <strong>
                                assigning values to css custom properties </strong> (variables) which
                                in-turn drive the effects and 3d transforms.
                                <br>
                                        <a href="https://github.com/simeydotme/pokemon-cards-css">Source code is in the repository</a>.
                        </p>
                </section>
        </header>

        <Search bind:query />

        {#if isLoading}
                <div class="loading-state">
                        <h2>Loading awesome cards...</h2>
                </div>
        {:else if filteredCards.length === 0}
                <div class="empty-state">
                        <h2>No cards found for "{query}"</h2>
                        <p>Try searching for a different Pokemon, type, or rarity.</p>
                </div>
        {:else}
                <div class="gallery-controls">
                        <div class="gallery-info">
                                Showing {filteredCards.length} of {allCards.length} cards
                        </div>
                        <div class="toggle-container">
                                <label class="switch">
                                        <input type="checkbox" bind:checked={showPlayingCards}>
                                        <span class="slider round"></span>
                                </label>
                                <span>Show Playing Cards</span>
                        </div>
                </div>
                <CardList>
                        {#each filteredCards as card, i (card.id)}
                                <Card
                                        id={card.id}
                                        name={card.name}
                                        number={card.number}
                                        set={card.set}
                                        types={card.types}
                                        supertype={card.supertype}
                                        subtypes={card.subtypes}
                                        rarity={card.rarity}
                                        isReverse={card.isReverse || (card.rarity === "Common" || card.rarity === "Uncommon" ? Math.random() > 0.8 : false)}
                                        img={showPlayingCards ? getPlayingCardImg(i + 1) : undefined}
                                />
                        {/each}
                </CardList>
        {/if}
        </main>
</div>

<div class="back-to-top">
  <a href="#⚓-top">Back to Top</a>
</div>

<style>
  .app-container {
        display: flex;
        min-height: 100vh;
  }
  
  main {
        flex: 1;
        padding-left: 2rem;
        padding-right: 2rem;
        max-width: calc(100vw - 250px);
  }

  @media screen and (max-width: 900px) {
        .app-container {
                flex-direction: column;
        }
        main {
                max-width: 100vw;
                padding-left: 0;
                padding-right: 0;
        }
  }

  .header-nav {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 2rem;
  }

  .btn-menu {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s;
  }

  .btn-menu:hover {
        background: rgba(255, 255, 255, 0.2);
  }

  .back-to-top a {
    color: inherit;
    text-decoration: none;
                z-index: 999;
  }
  
  .loading-state, .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        margin: 2rem auto;
        max-width: 600px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        backdrop-filter: blur(10px);
  }
  
  .gallery-info {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: -1rem;
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 300;
  }

  .gallery-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        margin-bottom: -1rem;
  }

  .gallery-controls .gallery-info {
        margin-top: 0;
        margin-bottom: 0;
  }

  .toggle-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
  }

  /* Switch styling */
  .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
  }
  .switch input {
        opacity: 0;
        width: 0;
        height: 0;
  }
  .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.2);
        transition: .4s;
        border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
  }
  input:checked + .slider {
        background-color: var(--primary, #f2c94c);
        border-color: var(--primary, #f2c94c);
  }
  input:focus + .slider {
        box-shadow: 0 0 1px var(--primary, #f2c94c);
  }
  input:checked + .slider:before {
        transform: translateX(26px);
  }
  .slider.round {
        border-radius: 24px;
  }
  .slider.round:before {
        border-radius: 50%;
  }
</style>
