<template>
    <div class="flex flex-col p-12 space-y-4">
        <div class="grid grid-cols-7 gap-4">
            <div class="col-span-4">
                <h1 class="text-6xl font-semibold text-red-500">Battle The Horde</h1>

                <div class="mt-2">
                    <button @click="showGuide = !showGuide" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-900">Toggle Rules/Guide</button>
                </div>

                <ul v-if="showGuide" class="p-4 mt-2 bg-gray-300 rounded-lg">
                    <li>If you're playing a standard 40 card deck, play your first turn then the minotaurs start playing.</li>
                    <li>If you're playing a commander deck, take your first 3 turns then start playing.</li>
                    <li>If you want an increased challenge, reduce the amount of set-up turns you take, or allow the minotaurs to go first.</li>
                    <li>A red border on a creature indicates that creature is attacking this turn.</li>
                    <li>When sorceries are played by the horde, the card will appear first on screen at the top, and go straight to the horde's graveyard.</li>
                    <li>Attacking the horde on your turn will put X cards from the horde's library into its graveyard, where X is the damage you dealt.</li>
                    <li>The horde has infinite mana, and as such will always pay for costs for cards such as Rhystic Study, Smothering Tithe etc.</li>
                </ul>
            </div>
            <div class="col-span-3">
                <life-counter />
            </div>
        </div>

        <div clas="relative flex space-x-2">
            <div class="absolute z-10 mt-12 w-full h-full" v-if="highlightedCards.length">
                <div class="grid grid-cols-4">
                    <card :popupCard="true" class="shadow-xl" v-for="card in highlightedCards" :key="card" :card="card" />
                </div>
            </div>
            <div class="absolute z-10 w-full h-full" v-if="showDamageBox">
                <div class="flex p-6 w-96 bg-white shadow-xl">
                    You dealt {{ damageDealt }} to the horde, it has put {{ damageDealt }} cards from ontop of its library into its graveyard.
                </div>
            </div>
            <!-- <button
                @click="shuffleHordeLibrary"
                class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
            >
                Shuffle
            </button> -->
                    
            <div class="flex flex-row space-x-2">
                <button
                    v-if="currentPhase === 'Game not started'"
                    @click="startGame"
                    class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                >
                    Start Game
                </button>
                <button
                    v-if="currentPhase === 'Waiting...'"
                    @click="playSpells"
                    class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                >
                    Play Spells
                </button>
                <button
                    v-if="currentPhase === 'Spells Played'"
                    @click="declareAttackers"
                    class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                >
                    Declare Attackers
                </button>
                
                <button
                    v-if="currentPhase === 'Attackers Declared'"
                    @click="resolveDamage"
                    class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                >
                    Resolve Damage
                </button>
                
                <button
                    v-if="currentPhase === 'Declare Blockers and Damage Resolution'"
                    @click="endTurn"
                    class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                >
                    End Turn
                </button>
                <button
                    v-if="currentPhase !== 'Game not started'"
                    @click="newGame"
                    class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                >
                    New Game
                </button>
                <div v-if="currentPhase !== 'Game not started'">
                    <input type="text" v-model="damage" class="px-2 py-2 rounded border">
                    <button
                        @click="dealDamage"
                        class="px-4 py-2 text-white bg-blue-600 rounded transition-all hover:bg-blue-900"
                    >
                        Deal damage
                    </button>
                </div>
            </div>

            <p class="mt-6 text-xl text-red-500">
                Status: {{ currentPhase }}
            </p>

            <p class="text-xl">Current Turn: {{ turn }}</p>

            <p class="text-xl">The horde has {{ remainingCards }} cards remaining in its library</p>
        </div>

        <div class="py-6">
            <label for="autoDamage">
                <input name="autoDamage" type="checkbox" v-model="autoDamage">
                Automatically subtract damage from unblocked attackers
            </label>
        </div>

        <h2 class="pt-8 text-xl font-semibold">Artifacts ({{ boardArtifacts.length }}):</h2>
        <div class="grid grid-cols-3 gap-12 p-6 bg-gray-200 rounded-lg sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8" v-if="boardArtifacts.length">
            <div v-for="card in boardArtifacts" :key="card.index">
                <card :popupCard="false" :card="card" />
            </div>
        </div>

        <h2 class="text-xl font-semibold">Creatures ({{ boardCreatures.length }}):</h2>
        <div class="grid grid-cols-3 gap-12 p-6 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8" v-if="boardCreatures.length">
            <div v-for="card in boardCreatures" :key="card.index">
                <card :popupCard="false" :card="card" />
            </div>
        </div>

        <h2 class="text-xl font-semibold">Graveyard ({{ graveyard.length }}):</h2>
        <div class="grid grid-cols-3 gap-12 p-6 bg-gray-300 rounded-lg sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8" v-if="graveyard.length">
            <div v-for="card in graveyard" :key="card.index">
                <card :popupCard="false" :card="card" />
            </div>
        </div>
    </div>

</template>

<script>
    import Card from '../components/Card.vue';
    import LifeCounter from '../components/LifeCounter.vue';
    import events from '../events';
    import functions from '../functions';

    export default {
        components: {
            Card,
            LifeCounter,
        },
        data: () => ({
            currentPhase: 'Game not started',
            advanceText: 'Start game',
            highlightedCards: [],
            showGuide: false,
            damage: 0,
            damageDealt: 0,
            showDamageBox: false,
            autoDamage: false,
        }),
        mounted () {
            events.$on('creature-attacking', card => {
                this.$store.dispatch('creatureAttacking', card);
            });

            events.$on('creature-not-attacking', card => {
                this.$store.dispatch('creatureNotAttacking', card);
            });
        },
        methods: {
            shuffleHordeLibrary () {
                this.$store.dispatch("shuffle");
            },
            startGame() {
                this.currentPhase = 'Waiting...';
            },
            playSpells () {
                this.currentPhase = 'Spells Played'
                this.$store.dispatch('handleMainPhase');
            },
            declareAttackers () {
                this.currentPhase = 'Attackers Declared'
                this.$store.dispatch('startAttackPhase');
            },
            resolveDamage () {
                this.currentPhase = 'Declare Blockers and Damage Resolution';
                this.$store.dispatch('handleEndStep');

                if (this.autoDamage) {
                    events.$emit('lose-life', this.totalUnblockedDamage);
                }
            },
            endTurn () {
                this.$store.dispatch('cleanUp');
                this.currentPhase = 'Waiting...';
            },
            showSorceryPlayed (card) {
                this.highlightedCards.push(card);

                setTimeout(() => {
                    this.highlightedCards.splice(0, 1);
                }, 3000);
            },
            dealDamage () {
                this.$store.dispatch('dealDamage', this.damage);
                this.showDamage(this.damage);
                this.damage = 0;
            },
            showDamage (damage) {
                this.showDamageBox = true;
                this.damageDealt = damage;

                setTimeout(() => {
                    this.showDamageBox = false;
                }, 3000);
            }
        },
        computed: {
            library() {
                return this.$store.getters['library'];
            },
            turn () {
                return this.$store.getters['turn'];
            },
            remainingCards () {
                return this.$store.getters['remainingCards'];
            },
            boardCreatures () {
                return this.$store.getters['boardCreatures'];
            },
            boardArtifacts () {
                return this.$store.getters['boardArtifacts'];
            },
            graveyard () {
                return this.$store.getters['graveyard'];
            },
            cardsPlayedThisTurn () {
                return this.$store.getters['cardsPlayedThisTurn'];
            },
            sorceriesPlayed () {
                return this.cardsPlayedThisTurn.filter(card => {
                    return card.type === 'Sorcery';
                });
            },
            totalUnblockedDamage () {
                let attackingCreatures = this.boardCreatures.filter(creature => creature.isAttacking && !creature.isBlocked);
                return functions.arraySum(attackingCreatures, 'power');
            }
        },
        watch: {
            sorceriesPlayed (cards) {
                if (cards.length) {
                    cards.forEach(card => {
                        this.showSorceryPlayed(card);
                    });
                }
            }
        }
    };
</script>
