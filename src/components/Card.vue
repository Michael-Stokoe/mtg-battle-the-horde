<template>
    <div class="relative" :class="{
        'rotate-90': tapped
    }">
        <img :src="image" class="shadow-xl" :class="{
            'border-red-500 rounded-lg border-8': isAttacking
        }">

        <div v-if="showCardActions" class="flex absolute top-1/2 left-1/2 flex-row -translate-x-1/2 -translate-y-1/2">
            <button
                v-if="type === 'Creature'"
                class="text-3xl text-white hover:text-gray-300"
                title="Block"
                @click="block"
            >
                <i class="fas fa-shield"></i>
            </button>
            <button
                v-if="type === 'Creature'"
                class="text-3xl text-white hover:text-gray-300"
                title="Block & Kill"
                @click="blockKill"
            >
                <i class="fas fa-shield-virus"></i>
            </button>
            <button
                class="text-3xl text-white hover:text-gray-300"
                title="Destroy"
                @click="destroyCard"
            >
                <i class="fas fa-trash"></i>
            </button>
        </div>

        <div v-if="card.isBlocked" class="flex absolute bottom-5 left-5 flex-col p-1 space-y-2 text-xs text-white bg-gray-800 rounded">
            <div>Blocked</div>
        </div>
        <div v-if="card.deathTouch || card.menace || card.firstStrike" class="flex absolute bottom-2 left-5 flex-col p-1 space-y-2 text-xs text-white bg-black rounded">
            <div v-if="card.menace" title="Menace">Menace</div>
            <div v-if="card.deathTouch" title="Deathtouch">Deathtouch</div>
            <div v-if="card.firstStrike" title="First Strike">First Strike</div>
        </div>

        <div v-if="type === 'Creature'" class="absolute right-3 bottom-3 px-1 font-semibold text-black bg-gray-100 rounded">
            <p title="Power / Toughnes" class="text-xs">{{ card.power }} / {{ card.toughness }}</p>
        </div>
    </div>
</template>

<script>
    import events from '../events';

    export default {
        props: [
            'card',
            'popupCard',
        ],
        mounted () {
            this.type = this.card.type;
            this.image = '/images/cards/' + this.card.image;
            this.isPopup = this.popupCard;
        },
        data: () => ({
            name: null,
            type: null,
            image: null,
            isAttacking: false,
            isPopup: false,
            isBlocked: false,
        }),
        methods: {
            destroyCard () {
                this.$store.dispatch('destroyCard', this.card.index);
            },
            block () {
                this.$store.dispatch('blockCreature', this.card);
            },
            blockKill () {
                this.$store.dispatch('destroyCard', this.card.index);
            }
        },
        computed: {
            tapped () {
                return this.card.tapped;
            },
            showCardActions() {
                return (
                    this.card.type !== 'Sorcery' &&
                    this.card.inGraveyard === false &&
                    !this.isPopup
                );
            }
        },
        watch: {
            tapped (newVal, oldVal) {
                if (newVal === true && oldVal === false) {
                    this.isAttacking = true;
                    events.$emit('creature-attacking', this.card);
                }
                if (oldVal === true && newVal === false) {
                    this.isAttacking = false;
                    events.$emit('creature-not-attacking', this.card);
                }
            }
        }
    }
</script>