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
            bg-sky-100
            rounded
            shadow
            hover:cursor-pointer
            hover:drop-shadow-2xl
            hover:border
            hover:border-blue-300
            transition transition-colors
            ease-in-out
            duration-200
        "
        target="_blank"
    >
        <img
            :src="item.picture"
            alt="avatar"
            class="
                object-cover object-center
                w-full
                h-3/6
                border-2 border-stone-300
                ring-1
                hover:saturate-150
                transition transition-colors
                ease-in-out
                duration-200
            "
        />

        <div
            class="
                h-1/6
                p-2
                flex
                items-center
                bg-gradient-to-r
                from-blue-300
                to-teal-100
            "
        >
            <h1 class="mx-auto text-xl font-semibold text-gray-800">
                {{ item.title }}
            </h1>
        </div>

        <div
            class="
                h-1/6
                px-6
                py-4
                hover:contrast-75
                transition transition-colors
                ease-in-out
                duration-500
            "
        >
            <p class="py-2 text-gray-700 text-sm">
                {{ item.description }}
            </p>
            <p class="text-xs text-red-600">{{ item.link }}</p>
        </div>
    </a>
</template>
