<?php

namespace App\Services;

use App\Models\Todo;

class TodoService
{
    public function __construct(private readonly Todo $todo)
    {
    }

    public function getListTodo($param = []): \Illuminate\Database\Eloquent\Collection|array
    {
        $query = $this->todo->query();
        // TODO: implement search and filter if needed
//        if (!empty($param['q'])) {
//            $query->where('title', 'like', "%{$param['q']}%");
//        }
//
//        if (!empty($param['status'])) {
//            $query->where('status', $param['status']);
//        }

        return $query->get();
    }

    public function createTodo($data): \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model
    {
        return $this->todo->query()->create($data);
    }

    public function updateTodo(Todo $todo, $data): Todo
    {
        $todo->update($data);
        return $todo;
    }

    public function deleteTodo(Todo $todo): ?bool
    {
        return $todo->delete();
    }
}
