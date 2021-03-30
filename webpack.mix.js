let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/assets/js/users/users.jsx', 'public/js')
   .react('resources/assets/js/admins/admins.jsx', 'public/js')
   .js('resources/assets/js/start.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
   .sass('resources/assets/sass/start.scss', 'public/css')
   .sass('resources/assets/sass/admin-screen.scss', 'public/css')
   .copy('node_modules/react-datetime/css/react-datetime.css', 'public/css')

   .version()
   .browserSync('lms.gakken-idn.local');
