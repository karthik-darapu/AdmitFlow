const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const applicationController = require('../controllers/applicationController');

router.post('/', [authMiddleware, roleMiddleware(['student'])], applicationController.submitApplication);
router.get('/', authMiddleware, applicationController.listApplications);
router.get('/stats/overview', [authMiddleware, roleMiddleware(['admin'])], applicationController.applicationStats);
router.get('/:id', authMiddleware, applicationController.getApplication);
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], applicationController.updateApplicationStatus);

module.exports = router;