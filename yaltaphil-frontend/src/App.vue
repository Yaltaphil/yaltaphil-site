<script setup>
import PortfolioItem from "./components/PortfolioItem.vue";
import {technologies} from "./assets/data/technologies";
import {projects} from "./assets/data/projects";

function count() {
    return projects.length;
}
</script>

<template>
    <main
        class="
            min-w-full min-h-screen
            bg-gradient-to-b
            from-indigo-700
            via-slate-200
            to-green-400
            pb-20
        "
    >
        <div class="container max-w-5xl mx-auto px-2">
            <nav>
                <div class="p-3">
                    <div class="flex items-center justify-between">
                        <img
                            alt="logo"
                            class="w-32 h-32 hover:animate-pulse"
                            src="/img/Y-logo.png"
                        />

                        <div class="w-full flex justify-end">
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
                                    class="
                                        px-4
                                        py-2
                                        font-bold
                                        text-gray-900
                                        transition-colors
                                        duration-200
                                        transform
                                        rounded
                                       hover:bg-blue-700 hover:text-white
                                        md:mx-2
                                    "
                                    href="#about"
                                >About me</a
                                >
                                <a
                                    class="
                                        px-4
                                        py-2
                                        font-bold
                                        text-gray-900
                                        transition-colors
                                        duration-200
                                        transform
                                        rounded
                                       hover:bg-blue-700 hover:text-white
                                        md:mx-2
                                    "
                                    href="#portfolio"
                                >Portfolio: {{ count() }} items</a
                                >
                                <a
                                    class="
                                        px-4
                                        py-2
                                        font-bold
                                        text-gray-900
                                        transition-colors
                                        duration-200
                                        transform
                                        rounded
                                        hover:bg-blue-700 hover:text-white
                                        md:mx-2
                                    "
                                    href="#contacts"
                                >Contact</a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <section>
                <h2
                    id="about"
                    class="text-black font-sans text-4xl font-light my-12 md:mt-24 text-center"
                >
                    About me
                </h2>
                <div class="sm:flex flex-row-reverse">
                    <div class="flex-auto mx-auto rounded-lg shadow-lg overflow-hidden">
                        <img alt="My photo" class="w-full h-full object-cover pan-image-top-right "
                             src="/img/yaltaphil.jpg">
                    </div>
                    <div class="p-4 md:p-12">
                        <p class="block text-xl text-center font-medium text-black"> Hi there, I'm Phil 👋 and
                            I do frontend development. I
                            really enjoy learning languages and frameworks like Vue and
                            Nuxt, as well as vanilla Javascript. </p>
                        <p class="block text-xl text-center font-medium text-black">I'm looking for cooperation of any
                            kind in frontend development, freelancing or full-time
                            remote work on your projects. </p>
                        <p class="text-black text-center font-light m-8">
                            Github profile:
                            <a class="py-5 text-red-700 font-bold" href="https://github.com/yaltaphil"
                               target="_blank"
                            >https://github.com/yaltaphil</a
                            >
                        </p>
                    </div>
                </div>

            </section>

            <section>
                <h2 class="text-black font-sans text-4xl font-light my-12 md:mt-24 text-center">
                    My current technology stack:
                </h2>
                <div class="flex flex-row flex-wrap
                    justify-center
                    gap-12">
                    <div v-for="(tech, i) in technologies" :key="i"
                         class="p-4 rounded-full bg-zinc-200 bg-opacity-25 hover:animate-pulse hover:shadow-xl">
                        <img :src="tech.logo" alt="icon" class="w-12 h-12"/>
                    </div>
                </div>
            </section>

            <section>
                <h2
                    id="portfolio"
                    class="text-black font-sans text-4xl font-light m-4 mt-32 text-center"
                >Some of my projects
                </h2>
                <div
                    class="
                    flex flex-row flex-wrap
                    justify-around justify-items-stretch
                    gap-12
                    py-8
                    md:p-4
                "
                >
                    <PortfolioItem
                        v-for="(item, i) in projects"
                        :key="i"
                        :item="item"
                    />
                </div>
            </section>

            <section>
                <h2
                    id="contacts"
                    class="text-black font-sans text-4xl font-light my-12 md:mt-24 text-center"
                >
                    Contact info
                </h2>
                <p class="text-black font-sans font-light m-1 text-center">Feel free to contact me via email or
                    telegram </p>
                <div class="flex flex-wrap justify-around">
                    <p class="p-4 text-red-700 font-bold text-center">email:
                        <a href="mailto:yaltaphil@gmail.com">yaltaphil@gmail.com</a>
                    </p>
                    <p class="p-4 text-red-700 font-bold text-center">
                        telegram:
                        <a href="https://t.me/Yaltaphil" target="_blank"
                        >https://t.me/Yaltaphil</a
                        >
                    </p>
                </div>
            </section>
        </div>
    </main>
</template>

<style>
.pan-image-top-right {
    animation: pan-image 18s cubic-bezier(0.215, 0.610, 0.355, 1.000) infinite;
}

@keyframes pan-image {
    0% {
        transform: scale(1) translate(0, 0);
        transform-origin: 84% 16%;
    }
    50% {
        transform: scale(1.25) translate(20px, -15px);
        transform-origin: right top;
    }
    100% {
        transform: scale(1) translate(0, 0);
        transform-origin: 84% 16%;
    }
}

</style>