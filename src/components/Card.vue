<template>
    <div class="relative" :class="{
        'rotate-90': tapped
    }">
        <img :src="image" class="shadow-xl" :class="{
            'border-red-500 rounded-lg border-8': isAttacking
        }">

        <div class="absolute top-3 right-5">
            <button class="text-white hover:text-gray-300" title="Destroy">
                <i class="fas fa-trash"></i>
            </button>
        </div>

        <div class="absolute bottom-2 left-5 flex space-x-4">
            <button v-if="card.deathTouch" class="text-black" title="Death Touch">
                <i class="fas fa-skull"></i>
            </button>
            <button v-if="card.firstStrike" class="text-black" title="First Strike">
                <i class="fas fa-person-running"></i>
            </button>
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
        }),
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