<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use App\Http\Controllers\amoCRMredirectController;

$router->get('/home/{p1}/{p2}', function ( $p1, $p2 ) {
    return "Hallo Welt! " . $p1 . " " . $p2;
});

$router->get('/api/redirect', [ 'uses' => 'amoCRMredirectController@redirect' ] );

$router->get('/api/redirect/clean/{subdomain}', [ 'uses' => 'amoCRMredirectController@deleteData' ] );
