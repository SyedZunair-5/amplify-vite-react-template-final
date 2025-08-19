import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [contacts, setContacts] = useState<Array<Schema["Contacts"]["type"]>>(
    []
  );
  const { signOut } = useAuthenticator();

  useEffect(() => {
    // Subscribe to Todo observations
    const todoSub = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    // Subscribe to Contacts observations
    const contactsSub = client.models.Contacts.observeQuery().subscribe({
      next: (data) => setContacts([...data.items]),
    });

    // Cleanup subscriptions on unmount
    return () => {
      todoSub.unsubscribe();
      contactsSub.unsubscribe();
    };
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>

      <h1>Contacts</h1>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.username} (Age: {contact.age})
          </li>
        ))}
      </ul>

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
