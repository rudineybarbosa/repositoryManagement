const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Middleware
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function middlewareLogActions(request, response, next){
  const {method, url} = request;
  const log = `[${method.toUpperCase()}] ${url}`;

  console.time(log);
  next();
  console.timeEnd(log);

};

app.use(middlewareLogActions);

/**
 * Middleware
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function middlewareValidateId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: "Invalid Id"});
  }
  
  const repositoryIndex = getDataIndex(id);

  const notFound = repositoryIndex < 0;
  if(notFound){
    return response.status(400).json({message: "Repository not found"});
  }

  next();
};

app.use('/repositories/:id', middlewareValidateId);

function getDataIndex(id){
  let index = repositories.findIndex(repository => repository.id == id);
  return index;
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  let {title, url, techs, likes} = request.body;
  likes = 0;
  
  let repository = {title, url, techs, likes}
  
  const id = uuid();

  repository = { id: id, ...repository};//adding new property 'id'

  repositories.push(repository);

  return response.json(repository); //just return new data

});

app.put("/repositories/:id", (request, response) => {
  
  const {id} = request.params;

  const {title, url, techs} = request.body;
  
  let repositoryUpdated = {title, url, techs};
  repositoryUpdated = { id:id, ...repositoryUpdated};

  const repositoryIndex = getDataIndex(id);
  let repositoryOld = repositories[repositoryIndex];
  let likes = repositoryOld.likes;
  
  repositoryUpdated = {...repositoryUpdated, likes:likes};
  
  repositories[repositoryIndex] = repositoryUpdated;

  return response.json(repositoryUpdated);

});

app.delete("/repositories/:id", (req, res) => {
  console.log("entry onDelete")
  const {id} = req.params;

  const repositoryIndex = getDataIndex(id);
  repositories.splice(repositoryIndex, 1);//SPLICE() -> can be used to remove element from array

  return res.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {  
  const {id} = request.params;
  
  let repositoryIndex = getDataIndex(id);
  
  let repository = repositories[repositoryIndex];
  
  repository.likes += 1;//'repository' is a pointer to array element. So array element is updated

  return response.json(repository);

});

module.exports = app;
