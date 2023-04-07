<template>
    <div class="relative" :class="{
        'rotate-90': tapped
    }">
        <img :src="image" class="shadow-xl" :class="{
            'border-red-500 rounded-lg border-8': isAttacking
        }">

        <div v-if="showDestroyButton" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button class="text-3xl text-white hover:text-gray-300" title="Destroy" @click="destroyCard">
                <i class="fas fa-trash"></i>
            </button>
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
    export default {
        props: [
            'card',
        ],
        mounted () {
            this.type = this.card.type;
            this.image = '/images/cards/' + this.card.image;
        },
        data: () => ({
            name: null,
            type: null,
            image: null,
            isAttacking: false,
        }),
        methods: {
            destroyCard () {
                this.$store.dispatch('destroyCard', this.card.index);
            }
        },
        computed: {
            tapped () {
                return this.card.tapped;
            },
            showDestroyButton() {
                return (
                    this.card.type !== 'Sorcery' &&
                    this.card.inGraveyard === false
                );
            }
        },
        watch: {
            tapped (newVal, oldVal) {
                if (newVal === true && oldVal === false) {
                    this.isAttacking = true;
                }
                if (oldVal === true && newVal === false) {
                    this.isAttacking = false;
                }
            }
        }
    }
</script>