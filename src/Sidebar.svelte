<script>
  export let minWidth = 300;
  
  const MIN_CARD_WIDTH = 150;
  const MAX_CARD_WIDTH = 500;
  const STEP = 50;

  function increaseSize() {
    if (minWidth < MAX_CARD_WIDTH) {
      minWidth += STEP;
    }
  }

  function decreaseSize() {
    if (minWidth > MIN_CARD_WIDTH) {
      minWidth -= STEP;
    }
  }

  function resetSize() {
    minWidth = 300;
  }
</script>

<aside class="sidebar">
  <h3>Gallery Controls</h3>
  
  <div class="controls">
    <div class="control-group">
      <div id="card-size-label" class="label">Card Size</div>
      <div class="buttons" role="group" aria-labelledby="card-size-label">
        <button on:click={decreaseSize} disabled={minWidth <= MIN_CARD_WIDTH} aria-label="Decrease card size">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l14 0" />
          </svg>
        </button>
        <span class="size-indicator">{Math.round((minWidth / 300) * 100)}%</span>
        <button on:click={increaseSize} disabled={minWidth >= MAX_CARD_WIDTH} aria-label="Increase card size">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
        </button>
      </div>
    </div>
    
    <button class="reset-btn" on:click={resetSize} disabled={minWidth === 300}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
      </svg>
      Reset View
    </button>
  </div>
</aside>

<style>
  .sidebar {
    background: hsla(220, 7%, 17%, .8);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    height: 100vh;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 100;
  }

  h3 {
    margin: 0;
    font-family: Roboto, sans-serif;
    font-size: 1.2rem;
    color: white;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .label {
    font-family: Roboto, sans-serif;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .size-indicator {
    font-family: monospace;
    font-size: 1.1rem;
    color: white;
    font-weight: bold;
    min-width: 3ch;
    text-align: center;
  }

  button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  button:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary, #3b82f6);
  }

  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .reset-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-family: Roboto, sans-serif;
    font-size: 0.9rem;
    display: flex;
    gap: 8px;
    padding: 10px;
    width: 100%;
  }

  .reset-btn:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
</style>
