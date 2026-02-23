<script>
    export let onStart;
    export let onGallery;

    let layers = 7;

    function startGame() {
        onStart({ layers });
    }
</script>

<div class="menu-container">
    <h1>Pyramid Solitaire</h1>
    
    <div class="menu-card">
        <div class="control-group">
            <label for="layers">Pyramid Size (Layers): {layers}</label>
            <input type="range" id="layers" min="5" max="10" bind:value={layers} />
        </div>

        <div class="button-group">
            <button class="primary" on:click={startGame}>Play Game</button>
            <button class="secondary" on:click={onGallery}>View Gallery</button>
        </div>
    </div>
</div>

<style>
    .menu-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: white;
        font-family: 'Roboto', sans-serif;
    }

    h1 {
        font-size: 4rem;
        margin-bottom: 2rem;
        text-shadow: 0 4px 10px rgba(0,0,0,0.5);
        text-align: center;
    }

    .menu-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 100%;
        max-width: 400px;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2.5rem;
    }

    label {
        font-size: 1.2rem;
        font-weight: 300;
    }

    input[type=range] {
        width: 100%;
        margin: 10px 0;
        accent-color: #f2c94c;
    }

    .button-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    button {
        padding: 1rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        font-weight: bold;
    }

    button:hover {
        transform: translateY(-2px);
    }

    button.primary {
        background: #f2c94c;
        color: #1a1a2e;
        box-shadow: 0 4px 15px rgba(242, 201, 76, 0.4);
    }

    button.primary:hover {
        box-shadow: 0 6px 20px rgba(242, 201, 76, 0.6);
    }

    button.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    button.secondary:hover {
        background: rgba(255, 255, 255, 0.2);
    }
</style>
