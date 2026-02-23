<script>
    import MainMenu from "./MainMenu.svelte";
    import PyramidGame from "./PyramidGame.svelte";
    import Gallery from "./Gallery.svelte";

    let currentView = "menu"; // "menu", "game", "gallery"
    let gameOptions = {
        layers: 7
    };

    function startGame(options) {
        gameOptions = options;
        currentView = "game";
    }

    function openGallery() {
        currentView = "gallery";
    }

    function returnToMenu() {
        currentView = "menu";
    }
</script>

<main>
    {#if currentView === "menu"}
        <MainMenu onStart={startGame} onGallery={openGallery} />
    {:else if currentView === "game"}
        <PyramidGame options={gameOptions} onMenu={returnToMenu} />
    {:else if currentView === "gallery"}
        <Gallery onMenu={returnToMenu} />
    {/if}
</main>

<style>
    main {
        width: 100vw;
        min-height: 100vh;
        overflow-x: hidden;
    }
</style>
