<template>
    <div class="flex flex-col space-y-4 p-12">
        <h1 class="text-xl text-red-500">Welcome to Battle The Horde</h1>
        <p class="text-xl text-red-500">The horde has {{ remainingCards }} cards remaining in its library</p>
        <p class="text-xl text-red-500">Current turn: {{ turn }}</p>
        <!-- {{ library }} -->

        <div clas="flex space-x-2">
            <button
                @click="shuffleHordeLibrary"
                class="bg-blue-600 hover:bg-blue-900 transition-all text-white py-2 px-4 rounded"
            >
                Shuffle
            </button>
            
            <button
                v-if="currentPhase === 'Game not started'"
                @click="startGame"
                class="bg-blue-600 hover:bg-blue-900 transition-all text-white py-2 px-4 rounded"
            >
                Start Game
            </button>
            
            <button
                v-if="currentPhase === 'Waiting...'"
                @click="playSpells"
                class="bg-blue-600 hover:bg-blue-900 transition-all text-white py-2 px-4 rounded"
            >
                Play Spells
            </button>
            
            <button
                v-if="currentPhase === 'Spells Played'"
                @click="declareAttackers"
                class="bg-blue-600 hover:bg-blue-900 transition-all text-white py-2 px-4 rounded"
            >
                Declare Attackers
            </button>
            
            <button
                v-if="currentPhase === 'Attackers Declared'"
                @click="resolveDamage"
                class="bg-blue-600 hover:bg-blue-900 transition-all text-white py-2 px-4 rounded"
            >
                Resolve Damage
            </button>
            
            <button
                v-if="currentPhase === 'Declare Blockers and Damage Resolution'"
                @click="endTurn"
                class="bg-blue-600 hover:bg-blue-900 transition-all text-white py-2 px-4 rounded"
            >
                End Turn
            </button>

        </div>

        <p class="text-xl text-red-500">
            Status: {{ currentPhase }}
        </p>

        <h2 class="text-xl font-semibold">Artifacts ({{ boardArtifacts.length }}):</h2>
        <div class="grid grid-cols-5 gap-12 p-6 bg-gray-200 rounded-lg" v-if="boardArtifacts.length">
            <div v-for="card in boardArtifacts" :key="card.index">
                <card :card="card" />
            </div>
        </div>

        <h2 class="text-xl font-semibold">Creatures ({{ boardCreatures.length }}):</h2>
        <div class="grid grid-cols-5 gap-12 p-6" v-if="boardCreatures.length">
            <div v-for="card in boardCreatures" :key="card.index">
                <card :card="card" />
            </div>
        </div>

        <h2 class="text-xl font-semibold">Graveyard ({{ graveyard.length }}):</h2>
        <div class="grid grid-cols-5 gap-12 p-6 bg-gray-300 rounded-lg" v-if="graveyard.length">
            <div v-for="card in graveyard" :key="card.index">
                <card :card="card" />
            </div>
        </div>
    </div>

</template>

<script>
    import Card from '../components/Card.vue';

    export default {
        components: {
            Card,
        },
        data: () => ({
            currentPhase: 'Game not started',
            advanceText: 'Start game',
        }),
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
            },
            endTurn () {
                this.currentPhase = 'Waiting...';
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
            }
        }
    };
</script>
