const router = require('express').Router();
const programController = require('../controllers/programController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

router.get('/', programController.listPrograms);
router.post('/', [authMiddleware, roleMiddleware(['admin'])], programController.createProgram);
router.get('/:id', programController.getProgram);
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], programController.updateProgram);
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], programController.deleteProgram);

module.exports = router;