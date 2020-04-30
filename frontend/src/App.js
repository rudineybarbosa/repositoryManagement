import React, {useState, useEffect} from "react";
import api from  './services/api';

import "./styles.css";
import ListRepository from './components/ListRepository';


function App() {
  const [repositories, setRepositories] = useState([]);
  const [newRepositoryAdd, setNewRepositoryAdd] = useState('');
   
  useEffect( () => {

    api.get('repositories').then(response => {
        setRepositories(response.data);
      }
    );    
  }, []);

  async function handleAddRepository() {

    const response = await api.post('repositories',	{ 
       title: `Projeto ${Date.now()}`,
      url: "http://github.com/...", 
      techs: ["Node.js", "..."], 
      likes: 0 
    });
    
    setNewRepositoryAdd(response.data.title);
    
    setRepositories([...repositories, response.data]);

  }

  async function handleRemoveRepository(id) {
    
    await api.delete(`/repositories/${id}`);

    let newRepositories = repositories.filter(repository => repository.id != id);

    setRepositories(newRepositories);
    
  }

  return (
    <>
      <button onClick={handleAddRepository}>Adicionar</button>

      Repositório adicionado: {newRepositoryAdd}

      <ul data-testid="repository-list">
      {repositories.map(repository =>
        (
          
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>

          </li>
        )
      )}
    </ul>

    </>
  );
}

export default App;
