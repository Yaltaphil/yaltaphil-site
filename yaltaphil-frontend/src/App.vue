<script setup>
    import portfolioItem from "./components/portfolio-item.vue";
    const sertificates = [
        {
            title: "DOIT gaming portal",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
        {
            title: "Porten landing",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
        {
            title: "Porten landing",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
        {
            title: "Porten landing",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
        {
            title: "Porten landing",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
        {
            title: "Porten landing",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
        {
            title: "Porten landing",
            picture: "/src/assets/sertificates/4.png",
            link: "https://doit.yaltaphil.ru",
        },
    ];
</script>

<template>
    <div class="min-w-full min-h-screen">
        <div class="max-w-screen-xl bg-gray-100 mx-auto">
            <nav class="bg-white shadow dark:bg-gray-800">
                <div class="container px-6 py-3 mx-auto md:flex">
                    <div class="flex items-center justify-between">
                        <img
                            class="w-32 h-32"
                            alt="Vue logo"
                            src="./assets/y-logo.svg"
                        />

                        <!-- Mobile menu button -->
                        <div class="flex md:hidden">
                            <button
                                type="button"
                                class="
                                    text-gray-500
                                    dark:text-gray-200
                                    hover:text-gray-600
                                    dark:hover:text-gray-400
                                    focus:outline-none focus:text-gray-600
                                    dark:focus:text-gray-400
                                "
                                aria-label="toggle menu"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    class="w-6 h-6 fill-current"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
                    <div
                        class="
                            w-full
                            md:flex md:items-center md:justify-between
                        "
                    >
                        <div
                            class="
                                flex flex-col
                                px-2
                                py-3
                                -mx-4
                                md:flex-row md:mx-0 md:py-0
                            "
                        >
                            <a
                                href="#"
                                class="
                                    px-2
                                    py-1
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition-colors
                                    duration-200
                                    transform
                                    rounded
                                    dark:text-gray-200
                                    hover:bg-gray-900 hover:text-gray-100
                                    md:mx-2
                                "
                                >Start</a
                            >
                            <a
                                href="#"
                                class="
                                    px-2
                                    py-1
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition-colors
                                    duration-200
                                    transform
                                    rounded
                                    dark:text-gray-200
                                    hover:bg-gray-900 hover:text-gray-100
                                    md:mx-2
                                "
                                >About me</a
                            >
                            <a
                                href="#"
                                class="
                                    px-2
                                    py-1
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition-colors
                                    duration-200
                                    transform
                                    rounded
                                    dark:text-gray-200
                                    hover:bg-gray-900 hover:text-gray-100
                                    md:mx-2
                                "
                                >Portfolio</a
                            >
                            <a
                                href="#"
                                class="
                                    px-2
                                    py-1
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition-colors
                                    duration-200
                                    transform
                                    rounded
                                    dark:text-gray-200
                                    hover:bg-gray-900 hover:text-gray-100
                                    md:mx-2
                                "
                                >Contact</a
                            >
                        </div>
                    </div>
                </div>
            </nav>

            <div
                class="
                    flex flex-wrap
                    justify-center
                    align-around
                    bg-blue-100
                    gap-16
                    py-16
                "
            >
                <portfolio-item
                    v-for="(item, i) in sertificates"
                    :key="i"
                    :project="item.title"
                    :link="item.link"
                    :picture="item.picture"
                />
            </div>
        </div>
    </div>
</template>
