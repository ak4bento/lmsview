# Gakken Indonesia LMS (Base Repo)

This is the base repository for Gakken Indonesia Learning Management System (LMS) for use by select institutions. For development tasks list, please refer to this [Trello board](https://trello.com/b/DVniKQs7/lms).

## Repo URLs

- SSH: git@bitbucket.org:gakkenidn/lms.git
- HTTPS: https://[username]@bitbucket.org/gakkenidn/lms.git

## Installation

1. Clone the repo (see Repo URLs).
2. Make sure you have all the requirements set up as stated in the [Laravel Docs](https://laravel.com/docs/5.6/installation).
3. Navigate to root project directory.
4. Install PHP dependencies `composer install`.
5. Copy environment definitions file `[cp|copy] .env.example .env`, then edit contents accordingly.
6. Migrate database `php artisan migrate`.
7. Install roles to database `php artisan roles:install`.
8. Configure app settings `php artisan app:config`.

## Starting Development
1. Do the **Installation** procedure.
2. Checkout `develop` branch.
3. Install missing PHP dependencies `composer install`.
4. Seed database with dummy data `php artisan db:seed`.
5. Serve application using PHP development server `php artisan serve`.
6. Access application at `http://localhost:8000/`.

### Developing Front-end
1. Install Node dependencies `npm i`.
2. Edit your machine's `hosts` file to point lms.gakken-idn.local to 127.0.0.1.
3. Serve application using PHP development serve `php artisan serve --port=80`.
4. **After creating feature branch**, run Webpack compiler, serve with BrowserSync, then watch file changes `npm run watch`.

## Git Flow

### Starting a new feature
1. Checkout `develop` branch: `git checkout develop`.
2. Create and checkout feature branch with name in format `feature/[username-feature-name]`: `git checkout -b feature/endyhardy-admin-create-user`.
3. Start coding.

### Committing
- Commit changes which you think is significant enough.
- Updates to dependency requirements should be committed individually (not committed along with code changes).
- Commit message should clearly describe the changes made, and be in present tense.

### Finishing a feature
1. Test everything related to the feature and fix known bugs.
2. When finished, make a pull request to `origin/develop` branch.