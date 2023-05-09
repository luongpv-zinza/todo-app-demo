<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\CreateTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\Services\TodoService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    use ApiResponse;

    private TodoService $todoService;

    public function __construct(TodoService $todoService)
    {
        $this->todoService = $todoService;
    }

    public function index(Request $request)
    {
        $listTodo = $this->todoService->getListTodo();

        return TodoResource::collection($listTodo);
    }

    public function store(CreateTodoRequest $createTodoRequest)
    {
        $todo = $this->todoService->createTodo($createTodoRequest->validated());

        return new TodoResource($todo);
    }

    public function update(UpdateTodoRequest $updateTodoRequest, Todo $todo)
    {
        $updatedTodo = $this->todoService->updateTodo($todo, $updateTodoRequest->validated());

        return new TodoResource($updatedTodo);
    }

    public function destroy(Todo $todo)
    {
        $this->todoService->deleteTodo($todo);

        return $this->responseNoContent();
    }
}
