<script>
	
	import { activeCard } from "./lib/stores/activeCard.js";
	
	let thisGrid;
	
	$: active = thisGrid && thisGrid.contains( $activeCard );
	
</script>

<section 
	class="card-grid" 
	class:active
	bind:this={thisGrid}
>

<slot />

</section>

<style>
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--card-min-width, 300px), 1fr));
		grid-gap: 50px 2vw;
		transform-style: preserve-3d;
		height: 100%;
		max-width: 1400px;
		margin: auto;
		padding: 50px;
		position: relative;
	}
	
	.card-grid.active {
		z-index: 99;
	}
		
	@media screen and (max-width: 600px) {
		.card-grid {
			grid-template-columns: 1fr;
			padding: 20px;
		}
	}
		
	:global( .card-grid > .card ) {
		transition: opacity 0.2s ease, transform 0.2s ease;
		margin: 0 auto;
	}
		
	:global( .card-grid > .card.active ) {
		transform: translate3d(0, 0, 0.1px)!important;
	}
	
</style>
