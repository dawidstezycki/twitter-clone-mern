const relationshipRouter = require('express').Router();
const { getRelationships, getRelationship, postRelationship, deleteRelationship } = require('./relationshipController');

relationshipRouter.get('/', getRelationships);
relationshipRouter.get('/:id', getRelationship);
relationshipRouter.post('/', postRelationship);
relationshipRouter.delete('/:id', deleteRelationship);

module.exports = relationshipRouter;
