import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/css/bootstrap.css', 'resources/css/uppload.css', 'resources/js/app.js', 'resources/js/uppload.js'],
            refresh: true,
        }),
    ],
});
