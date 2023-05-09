<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\Services\TodoService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    use ApiResponse;
    public $todoService;
    public function __construct(TodoService $todoService)
    {
        $this->todoService = $todoService;
    }

    public function index(Request $request)
    {
        $rs = $this->todoService->getListTodo($request->all());

        return TodoResource::collection($rs);
    }

    public function store(CreateUpdateTodoRequest $request)
    {
        $rs = $this->todoService->createTodo($request->validated());

        return new TodoResource($rs);
    }

    public function update(CreateUpdateTodoRequest $request, Todo $todo)
    {
        $rs = $this->todoService->updateTodo($todo, $request->validated());
        return new TodoResource($rs);
    }

    public function delete(Todo $todo)
    {
        $this->todoService->deleteTodo($todo);
        return $this->responseNoContent();
    }
}
