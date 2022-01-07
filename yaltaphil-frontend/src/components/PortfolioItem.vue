<script setup>
defineProps({
    item: Object,
});

</script>

<template>
    <a
        :href="item.link"
        class="
            w-64
            h-96
            bg-sky-100
            rounded-lg
            shadow-lg
            hover:cursor-pointer
            hover:drop-shadow-2xl
            hover:border
            hover:border-blue-300
            transition transition-colors
            ease-in-out
            duration-100
            overflow-hidden
        "
        target="_blank"
    >
        <img
            :src="item.picture"
            alt="avatar"
            class="
                object-cover object-center
                w-full
                h-1/2
                rounded-t-lg
            "
        />
        <h3 class="text-xl
                font-bold
                text-gray-800
                p-4
                bg-gradient-to-r
                from-blue-500
                to-teal-300
                text-center">
            {{ item.title }}
        </h3>
        <p class="p-2 text-gray-700 text-sm text-center">
            {{ item.description }}
        </p>
        <p class="p-2 text-xs text-red-600 text-center">{{ item.link }}</p>

    </a>
</template>
