<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;
use Illuminate\Support\Str;

class TodoTest extends TestCase
{
    use DatabaseTransactions;

    public function testGetListTodoSuccess() {
        // Create 5 todos
        Todo::factory()->count(5)->create();

        $response = $this->getJson(route('todo.index'));

        $response->assertStatus(Response::HTTP_OK);
        $data = $response->json('data');

        $this->assertIsArray($data);
        $this->assertDatabaseCount('todos', count($data));
    }
    public function testCreateSuccess(): void
    {
        $todo     = Todo::factory()->make()->toArray();
        $response = $this->postJson(route('todo.store'), $todo);

        $response->assertStatus(Response::HTTP_CREATED);
        $data = $response->json('data');
        $this->_testResponseWithValidTodoResource($data);
        $this->assertEquals($todo['title'], $data['title']);
    }

    public function testCreateFailIfMissingTitle(): void
    {
        $response = $this->postJson(route('todo.store'), [
            'title' => null
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testCreateFailIfTitleLengthGreaterThan1000(): void
    {
        $response = $this->postJson(route('todo.store'), [
            'title' => Str::random(1001)
        ]);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testUpdateTitleSuccess(): void
    {
        /** @var Todo $todo */
        $todo        = Todo::factory()->create();
        $updatedData = [
            'title' => Str::random(10)
        ];
        $response    = $this->putJson(
            route('todo.update', ['todo' => $todo->id]),
            $updatedData
        );
        $updatedTodo = Todo::find($todo->id);
        $this->assertEquals($updatedTodo->title, $updatedData['title']);

        $response->assertStatus(Response::HTTP_OK);
        $data = $response->json('data');
        $this->_testResponseWithValidTodoResource($data);
        $this->assertEquals($updatedData['title'], $data['title']);
    }

    public function testUpdateTodoStatusSuccess(): void
    {
        /** @var Todo $todo */
        $todo        = Todo::factory()->create();
        $updatedData = [
            'is_completed' => true
        ];
        $response    = $this->putJson(
            route('todo.update', ['todo' => $todo->id]),
            $updatedData
        );
        $updatedTodo = Todo::find($todo->id);

        $this->assertEquals($updatedTodo->is_completed, $updatedData['is_completed']);

        $response->assertStatus(Response::HTTP_OK);
        $data = $response->json('data');
        $this->_testResponseWithValidTodoResource($data);
        $this->assertEquals($updatedData['is_completed'], $data['is_completed']);
    }

    public function testUpdateTitleFailIfMissingTitle(): void
    {
        /** @var Todo $todo */
        $todo     = Todo::factory()->create();
        $response = $this->putJson(
            route('todo.update', ['todo' => $todo->id]),
            ['title' => null]
        );

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testUpdateTitleFailIfTitleLengthGreaterThan1000(): void
    {
        /** @var Todo $todo */
        $todo     = Todo::factory()->create();
        $response = $this->putJson(
            route('todo.update', ['todo' => $todo->id]),
            ['title' => Str::random(1001)]
        );

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testDeleteSuccess(): void
    {
        /** @var Todo $todo */
        $todo     = Todo::factory()->create();
        $this->assertDatabaseHas('todos', [
            'id' => $todo->id
        ]);
        $response = $this->delete(route('todo.destroy', ['todo' => $todo->id]));

        $response->assertNoContent();
        $response->assertStatus(Response::HTTP_NO_CONTENT);
        $this->assertDatabaseMissing('todos', [
            'id' => $todo->id
        ]);
    }

    public function testDeleteFailIfTodoNotFound(): void
    {
        $response = $this->delete(route('todo.destroy', ['todo' => -1]));

        $response->assertStatus(Response::HTTP_NOT_FOUND);
    }

    private function _testResponseWithValidTodoResource(array $dataFromResponse)
    {
        $this->assertArrayHasKey('id', $dataFromResponse);
        $this->assertArrayHasKey('title', $dataFromResponse);
        $this->assertArrayHasKey('date', $dataFromResponse);
        $this->assertArrayHasKey('is_completed', $dataFromResponse);
    }
}
