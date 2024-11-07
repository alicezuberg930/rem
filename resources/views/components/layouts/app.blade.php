<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
    <title>{{ $title ?? 'Page Title' }}</title>
</head>

<body>
    <div class="flex h-screen">
        @include('components.sidebar')
        <div class="flex flex-col flex-1 w-full">
            <header class="z-10 py-4 bg-white shadow-md ">
                <div class="container flex items-center justify-between h-full px-6 mx-auto">
                    <button class="p-1 rounded-md focus:outline-none text-blue-300" onclick="openSidebar()">
                        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <ul class="flex items-center flex-shrink-0 space-x-6">
                        <!-- Profile menu -->
                        <li class="relative">
                            <div class="flex items-center">
                                <div>
                                    <div class="relative inline-block w-full">
                                        <select class="block w-full p-1 border border-blue-300 rounded text-blue-300"
                                            wire:change="" name="locale" id="locale">
                                            <option value="en">English</option>
                                            <option value="vi">Vietnamese</option>
                                        </select>
                                    </div>
                                </div>
                                <button class="flex items-center focus:outline-none" @click="toggleProfileMenu"
                                    @keydown.escape="closeProfileMenu">
                                    <p class="hidden mx-4 text-blue-300 md:block">Admin Account</p>
                                    <img class="object-cover w-8 h-8 ml-2 mr-2 rounded-full"
                                        src="https://sobexpressacms.di4l.vn/images/user.png" alt="profile">
                                </button>
                            </div>
                            <template x-if="isProfileMenuOpen">
                                <ul x-transition:leave="transition ease-in duration-150"
                                    x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
                                    @click.away="closeProfileMenu" @keydown.escape="closeProfileMenu"
                                    class="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 "
                                    aria-label="submenu">
                                    <li class="flex">
                                        <a class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                            href="https://sobexpressacms.di4l.vn/profile">
                                            <svg class="w-4 h-4 mr-3" aria-hidden="true" fill="none"
                                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                                </path>
                                            </svg>
                                            <span>Profile</span>
                                        </a>
                                    </li>
                                    <li class="flex cursor-pointer logout">
                                        <div
                                            class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                            <svg class="w-4 h-4 mr-3" aria-hidden="true" fill="none"
                                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                                                </path>
                                            </svg>
                                            <span>Log out</span>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                        </li>
                    </ul>
                </div>
            </header>

            {{ $slot }}
        </div>
    </div>

    @filepondScripts
    <script type="text/javascript">
        function dropdown() {
            document.querySelector("#submenu").classList.toggle("hidden");
            document.querySelector("#arrow").classList.toggle("rotate-180");
        }
        dropdown();

        function openSidebar() {
            document.querySelector(".sidebar").classList.toggle("hidden");
        }
    </script>
</body>

</html>
