<template>
    <div class="flex flex-col p-6 space-y-8 text-center bg-gray-300 rounded-lg shadow-lg">
        <p class="text-xl font-semibold">Life Counter</p>
        <span class="text-6xl font-semibold">{{ lifeCounter }}</span>

        <div class="flex flex-row justify-around">
            <button @click="decrease(10)" class="w-9 h-9 text-white bg-gray-600 rounded-full hover:bg-gray-900">-10</button>
            <button @click="decrease(5)" class="w-9 h-9 text-white bg-gray-600 rounded-full hover:bg-gray-900">-5</button>
            <button @click="decrease(1)" class="w-9 h-9 text-white bg-gray-600 rounded-full hover:bg-gray-900">-1</button>
            <button @click="increase(1)" class="w-9 h-9 text-white bg-gray-600 rounded-full hover:bg-gray-900">+1</button>
            <button @click="increase(5)" class="w-9 h-9 text-white bg-gray-600 rounded-full hover:bg-gray-900">+5</button>
            <button @click="increase(10)" class="w-9 h-9 text-white bg-gray-600 rounded-full hover:bg-gray-900">+10</button>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            lifeCounter: 40,
        }),
        methods: {
            increase (amount) {
                this.lifeCounter += amount;
            },
            decrease (amount) {
                this.lifeCounter -= amount;
            }
        }
    };
</script>