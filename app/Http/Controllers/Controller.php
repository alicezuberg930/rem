<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    // php artisan migrate --path=/database/migrations/full_migration_file_name_migration.php
    // Card #: 4162 9601 5493 7537
    // Exp date : 11/27
    // Cvv: 381
}
