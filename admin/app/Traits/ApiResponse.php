<?php

namespace App\Traits;

trait ApiResponse
{
    public function responseSuccess($data, $message = null, $code = \Illuminate\Http\Response::HTTP_OK)
    {
        return response()->json([
            'data'        => $data,
            'message'     => $message,
            'rid'         => request('rid'),
            'measureTime' => microtime(true) - request('initTime'),
            'statusCode'  => $code
        ], $code);
    }

    public function responseError($data, $message = null, $code = \Illuminate\Http\Response::HTTP_INTERNAL_SERVER_ERROR)
    {
        return response()->json([
            'errors'      => $data,
            'message'     => $message,
            'rid'         => request('rid'),
            'measureTime' => microtime(true) - request('initTime'),
            'statusCode'  => $code
        ], $code);
    }

    function responseNoContent()
    {
        return response()->noContent();
    }
}
