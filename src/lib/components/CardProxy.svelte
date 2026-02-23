<script>
  import { onMount } from "svelte";
  import altArts from "./alternate-arts.json";
  import promos from "./promos.json";
  import Card from "./Card.svelte";
  import { activeCardId, rarityOverride } from "../stores/rarityOverride.js";

  // data / pokemon props
  export let id = undefined;
  export let name = undefined;
  export let number = undefined;
  export let set = undefined;
  export let types = undefined;
  export let subtypes = undefined;
  export let supertype = undefined;
  export let rarity = undefined;
  export let isReverse = false;

  // image props
  export let img = undefined;
  export let back = undefined;
  export let foil = undefined;
  export let mask = undefined;

  // context/environment props
  export let showcase = false;

  const server = "https://poke-holo.simey.me";
  let currentRarity = "";
  let hasRarityOverride = false;
  let baseRarity = "";
  let debugCardEffects = false;

  $: hasRarityOverride = $activeCardId === id && !!$rarityOverride;
  $: baseRarity = hasRarityOverride ? $rarityOverride : rarity;

  $: isShiny = isDefined(number) && String(number).toLowerCase().startsWith( "sv" );
  /**
   Trainer / Galar Gallery Card (not shiny)
   */
  $: isGallery = isDefined(number) && !!String(number).match(/^[tg]g/i);
  /**
   Alternate Art Card (not shiny / gallery)
   */
  $: isAlternate = isDefined(id) && altArts.includes( id ) && !isShiny && !isGallery;
  /**
   Promo Card
   */
  $: isPromo = isDefined(set) && set === "swshp";
  
  $: {
    currentRarity = baseRarity;

    if (currentRarity && !hasRarityOverride && isReverse) {
      if (!currentRarity.includes("Reverse Holo")) {
        currentRarity = currentRarity + " Reverse Holo";
      }
    }

    if (currentRarity && !hasRarityOverride && isGallery) {
      if ( currentRarity.startsWith( "Trainer Gallery" ) ) {
        currentRarity = currentRarity.replace( /Trainer Gallery\s*/, "" );
      }
      if ( currentRarity.includes( "Rare Holo V" ) && (subtypes || []).includes("VMAX") ) {
        currentRarity = "Rare Holo VMAX";
      }
      if ( currentRarity.includes( "Rare Holo V" ) && (subtypes || []).includes("VSTAR") ) {
        currentRarity = "Rare Holo VSTAR";
      }
    }

    if (currentRarity && !hasRarityOverride && isPromo) {
      if ( id === "swshp-SWSH076" || id === "swshp-SWSH077" ) {
        currentRarity = "Rare Secret";

      } else if ( (subtypes || []).includes("V") ) {
        currentRarity = "Rare Holo V";
      } else if ( (subtypes || []).includes("V-UNION") ) {
        currentRarity = "Rare Holo VUNION";
      } else if ( (subtypes || []).includes("VMAX") ) {
        currentRarity = "Rare Holo VMAX";
      } else if ( (subtypes || []).includes("VSTAR") ) {
        currentRarity = "Rare Holo VSTAR";
      } else if ( (subtypes || []).includes("Radiant") ) {
        currentRarity = "Radiant Rare";
      }
    }
  }

  
  function isDefined (v) {
    return typeof v !== "undefined" && v !== null;
  }
  
  function isArray (v) {
    return typeof v !== "undefined" && Array.isArray(v);
  }

  function cardImage () {
    if ( isDefined( id ) ) {
      return `/images/cards/${id}.png`;
    }
    if ( isDefined( img ) ) {
      return img;
    }
    if ( isDefined( set ) && isDefined( number ) ) {
      return `https://images.pokemontcg.io/${ set.toLowerCase() }/${ number }_hires.png`;
    }
    return "";
  }
  
  function foilMaskImage ( prop, type = "masks" ) {

    let etch = "holo";
    let style = "reverse";
    let ext = "webp";

    if ( isDefined( prop ) ) {
      if ( prop === false ) {
        return "";
      }
      return prop;
    }

    if( !isDefined( currentRarity ) || !isDefined( subtypes ) || !isDefined( supertype ) || !isDefined( set ) || !isDefined( number ) ) {
      return "";
    }

    const fRarity = currentRarity.toLowerCase();
    const rawNumber = number.toString().toLowerCase();
    const promoNumber = rawNumber.replace(/[^a-z0-9]/g, "");
    const regularNumber = rawNumber.replace( "swsh", "" ).padStart( 3, "0" );
    const fNumber = isPromo ? promoNumber : regularNumber;
    const fSet = set.toString().toLowerCase().replace( /(tg|gg|sv)/, "" );

    if ( fRarity === "rare holo" ) {
      style = "swholo";
    }

    if ( fRarity === "rare holo cosmos" ) {
      style = "cosmos";
    }

    if ( fRarity === "radiant rare" ) {
      etch = "etched";
      style = "radiantholo";
    }

    if ( fRarity === "rare holo v" || fRarity === "rare holo vunion" || fRarity === "basic v" ) {
      etch = "holo";
      style = "sunpillar";
    }
    
    if ( fRarity === "rare holo vmax" || fRarity === "rare ultra" || fRarity === "rare holo vstar" ) {
      etch = "etched";
      style = "sunpillar";
    }
    
    if ( fRarity === "amazing rare" || fRarity === "rare rainbow" || fRarity === "rare secret" ) {
      etch = "etched";
      style = "swsecret";
    }

    if ( isShiny ) {

      etch = "etched";
      style = "sunpillar";

      if ( fRarity === "rare shiny vmax" || (fRarity === "rare holo vmax" && fNumber.startsWith( "sv" )) ) {
        style = "swsecret";
      }

    }

    if ( isGallery ) {

      etch = "holo";
      style = "rainbow";

      if ( fRarity.includes( "rare holo v" ) || fRarity.includes( "rare ultra" ) ) {

        etch = "etched";
        style = "sunpillar";

      }

      if ( fRarity.includes( "rare secret" ) ) {

        etch = "etched";
        style = "swsecret";

      }

    }

    if ( isAlternate ) {

      etch = "etched";

      if ( (subtypes || []).includes( "VMAX" ) ) {

        style = "swsecret";

      } else {

        style = "sunpillar";

      }

    }

    if ( isPromo ) {

      let promoStyle = promos[ id ];
      if ( promoStyle ) {
        style = promoStyle.style.toLowerCase();
        etch = promoStyle.etch.toLowerCase();

        if (style === "none" || etch === "none") {
          return "";
        }
      }

    }

    // Most swshp promo foil/mask files are missing on the public CDN.
    // Return empty to avoid repeated startup 404/CORS noise.
    if (fSet === "swshp") {
      return "";
    }

    // CDN fallback: swsh12pt5 does not consistently provide swsecret variants.
    if (fSet === "swsh12pt5" && style === "swsecret") {
      style = "sunpillar";
      etch = "etched";
    }

    // List of specific foil/mask combinations known to be missing on the CDN.
    // Return empty to avoid repeated 404/CORS errors.
    const missingFoilMasks = [
      "swsh8/250/etched/sunpillar",
      "pgo/029/holo/swholo",
      "swsh12/116/holo/reverse",
      "swsh12/127/holo/reverse",
      "swsh45/051/etched/sunpillar",
      "swsh12/197/etched/swsecret",
      "sm115/007/holo/reverse",
      "pgo/012/holo/swholo",
      "swsh12/085/holo/reverse",
      "swsh9/186/etched/swsecret",
      "swsh2/209/etched/swsecret",
      "swsh12/059/etched/radiantholo",
      "pgo/024/holo/swholo",
      "swsh12pt5/160/etched/sunpillar",
      "swsh45/046/etched/swsecret",
      "swsh45/sv110/etched/sunpillar",
      "pgo/049/holo/sunpillar",
      "swsh3/183/etched/sunpillar",
      "swsh4/188/etched/swsecret",
      "swsh45/sv107/etched/swsecret",
      "swsh45/sv076/etched/sunpillar",
      "swsh45/sv094/etched/sunpillar",
      "swsh10/204/etched/swsecret",
      "swsh8/138/holo/reverse",
      "swsh12/tg26/etched/sunpillar",
      "swsh4/138/etched/swsecret",
      "sm35/001/holo/reverse",
      "sm10/033/holo/reverse",
      "swsh9/132/holo/swholo",
      "swsh1/085/holo/swholo",
      "pgo/011/etched/radiantholo",
      "swsh45/060/holo/cosmos",
      "pgo/043/holo/swholo",
      "swsh12/120/etched/radiantholo",
      "swsh11/tg03/holo/rainbow",
      "swsh12/tg02/holo/rainbow",
      "swsh11/tg05/holo/rainbow",
      "swsh12/138/holo/sunpillar",
      "swsh7/110/holo/sunpillar",
      "pgo/011/holo/radiantholo"
    ];

    if (missingFoilMasks.includes(`${fSet}/${fNumber}/${etch}/${style}`)) {
      return "";
    }

    return `${ server }/foils/${ fSet }/${ type }/upscaled/${ fNumber }_foil_${ etch }_${ style }_2x.${ ext }`;

  }

  function foilImage () {
    return foilMaskImage( foil, "foils" );
  }

  function maskImage () {
    return foilMaskImage( mask, "masks" );
  }

  $: {
    if (debugCardEffects && $activeCardId === id) {
      console.debug("[CardProxy Debug] Resolved rarity/effects", {
        id,
        inputRarity: rarity,
        override: $rarityOverride,
        currentRarity,
        foil: foilImage(),
        mask: maskImage(),
      });
    }
  }

  onMount(() => {
    debugCardEffects = window.localStorage.getItem("debugCardEffects") === "1";
  });

</script>

<Card
  img={cardImage()}
  back={back}
  foil={foilImage()}
  mask={maskImage()}
  id={id}
  name={name}
  number={number}
  set={set}
  types={types}
  subtypes={subtypes}
  supertype={supertype}
  rarity={currentRarity}
  showcase={showcase}
/>