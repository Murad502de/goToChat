<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\amoCRMredirect;

class amoCRMredirectController extends Controller
{
    function __construct(){}

    public function redirect ( Request $request, amoCRMredirect $amoRedirect )
    {

        $redirectData = $request->all() ? $request->all() : false;

        return $redirectData ? $amoRedirect->saveRedirectData( $redirectData ) : response( [ 'No Content ' ], 204 );
    }

    public function deleteData ( Request $request, amoCRMredirect $amoRedirect, $subdomain )
    {
        $amoRedirect->deleteRedirectData( $subdomain );

        return response( [ 'OK', $subdomain ], 200 );
    }
}