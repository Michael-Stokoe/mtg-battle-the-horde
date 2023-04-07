<template>
    <div class="relative" :class="{
        'rotate-90': tapped
    }">
        <img :src="image" class="shadow-xl" :class="{
            'border-red-500 rounded-lg border-8': isAttacking
        }">

        <div class="absolute top-3 right-5">
            <button class="text-white hover:text-gray-300" title="Destroy" @click="destroyCard">
                <i class="fas fa-trash"></i>
            </button>
        </div>

        <div v-if="card.deathTouch || card.menace || card.firstStrike" class="absolute bottom-2 left-5 flex flex-col space-y-2 bg-black text-white text-xs p-1 rounded">
            <div v-if="card.menace" title="Menace">Menace</div>
            <div v-if="card.deathTouch" title="Deathtouch">Deathtouch</div>
            <div v-if="card.firstStrike" title="First Strike">First Strike</div>
        </div>

        <div v-if="type === 'Creature'" class="absolute bottom-3 rounded right-3 bg-gray-100 text-black font-semibold px-1">
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