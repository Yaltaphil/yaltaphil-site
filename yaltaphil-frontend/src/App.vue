<script setup>
import portfolioItem from "./components/portfolio-item.vue";
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
            from-gray-500
            via-slate-200
            to-blue-400
            overflow-hidden
        "
    >
        <div class="max-w-screen-lg mx-auto">
            <nav>
                <div class="p-3">
                    <div class="flex items-center justify-between">
                        <img
                            alt="logo"
                            class="w-32 h-32 hover:animate-pulse"
                            src="/img/Y-logo.png"
                        />

                        <div class="w-full md:flex md:justify-end">
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
                                        text-gray-700
                                        transition-colors
                                        duration-200
                                        transform
                                        rounded
                                        hover:bg-indigo-300 hover:text-red-900
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
                                        text-gray-700
                                        transition-colors
                                        duration-200
                                        transform
                                        rounded
                                        hover:bg-indigo-300 hover:text-red-900
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
                                        text-gray-700
                                        transition-colors
                                        duration-200
                                        transform
                                        rounded
                                        hover:bg-indigo-300 hover:text-red-900
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


            <section class="px-4">
                <h2
                    id="about"
                    class="text-black font-sans text-4xl font-light m-8 mt-12 md:mt-16 text-center"
                >
                    About me
                </h2>
                <div class="md:flex">
                    <div>
                        <img alt="My photo" class="mx-auto object-cover w-64 rounded-lg"
                             src="/img/yaltaphil.jpg">
                    </div>
                    <div class="p-4 md:px-8">
                        <p class="block mt-1 text-xl text-center font-medium text-black"> Hi there, I'm Phil 👋 and
                            I do frontend development. I
                            really enjoy learning languages and frameworks like Vue and
                            Nuxt, as well as vanilla Javascript.</p>
                    </div>
                </div>
                <p class="text-black text-center font-light my-8">
                    Github profile:
                    <a class="py-5 text-red-700 font-bold" href="https://github.com/yaltaphil"
                       target="_blank"
                    >https://github.com/yaltaphil</a
                    >
                </p>
            </section>

            <section class="">
                <h2 class="text-black font-sans text-4xl font-light m-8 md:mt-16 text-center">
                    My current technology stack:
                </h2>
                <div class="flex flex-row flex-wrap
                    justify-center
                    gap-12">
                    <div v-for="(tech, i) in technologies" :key="i"
                         class="p-4 rounded-full bg-zinc-200 bg-opacity-25 hover:animate-pulse">
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
                    <portfolio-item
                        v-for="(item, i) in projects"
                        :key="i"
                        :item="item"
                    />
                </div>
            </section>

            <section class="md:p-8">
                <h2
                    id="contacts"
                    class="text-black font-sans text-5xl font-light m-8 mt-12 md:mt-24 text-center"
                >
                    Contact info
                </h2>
                <p class="text-black font-sans font-light m-1 text-center">Feel free to contact me via email or
                    telegram </p>
                <div class="flex flex-wrap justify-around">
                    <p class="py-8 px-4 text-red-700 font-bold">email:
                        <a href="mailto:yaltaphil@gmail.com">yaltaphil@gmail.com</a>
                    </p>
                    <p class="py-8 px-4 text-red-700 font-bold">
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
