const micropostRouter = require('express').Router();
const { getMicroposts, getMicropost, postMicropost, deleteMicropost } = require('./micropostController');

micropostRouter.get('/', getMicroposts);
micropostRouter.get('/:id', getMicropost);
micropostRouter.post('/', postMicropost);
micropostRouter.delete('/:id', deleteMicropost);

module.exports = micropostRouter;
