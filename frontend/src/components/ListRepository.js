import React from 'react';
import api from  '../services/api';

export default function ListRespository(props){
  
  
  async function handleRemoveRepository(id) {
    console.log("delete id:", id)

    const response = await api.delete(`/repositories/${id}`);
   //filter to remove

  }

  return(
   <>
    <ul data-testid="repository-list">
      {props.repositories.map(repository =>
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
  )
}