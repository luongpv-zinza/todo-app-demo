<?php

namespace App\Services;

use App\Models\Todo;

class TodoService
{
    protected $limit = 30;

    public function getListTodo($param = [])
    {
        $query = Todo::query();
        if (!empty($param['q'])) {
            $query->where('title', 'like', "%{$param['q']}%");
        }

        if (!empty($param['status'])) {
            $query->where('status', $param['status']);
        }

        return $query->get();
    }

    public function createTodo($data)
    {
        return Todo::create($data);
    }

    public function updateTodo(Todo $todo, $data)
    {
        $todo->update($data);
        return $todo;
    }

    public function deleteTodo(Todo $todo)
    {
        return $todo->delete();
    }
}
