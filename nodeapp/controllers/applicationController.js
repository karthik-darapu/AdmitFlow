const Application = require('../models/Application');

exports.submitApplication = async (req, res, next) => {
  try {
    if (req.body.documents) {
      const oversizedFiles = req.body.documents.filter(doc => doc.size > 10485760);
      if (oversizedFiles.length > 0) {
        return res.status(400).json({ success: false, message: 'One or more files exceed the maximum size of 10MB' });
      }
    }

    const existingApplication = await Application.findOne({ userId: req.user.userId, program: req.body.program });
    if (existingApplication) return res.status(400).json({ success: false, message: 'You have already applied to this program' });

    const application = new Application({ ...req.body, userId: req.user.userId, status: 'submitted' });
    await application.save();
    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

exports.listApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    let query = {};

    if (req.user.role === 'student') query.userId = req.user.userId;
    if (req.query.status) query.status = req.query.status;
    if (req.query.program) query.program = req.query.program;

    const [applications, total] = await Promise.all([
      Application.find(query).populate('userId', 'name email').sort({ submittedAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments(query)
    ]);

    res.json({ success: true, applications, currentPage: page, totalPages: Math.ceil(total / limit), totalApplications: total });
  } catch (error) {
    next(error);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('userId', 'name email').populate('reviewedBy', 'name');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (req.user.role === 'student' && application.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'You do not have permission to view this application' });
    }
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    // For admin users, allow direct transitions to accepted/rejected
    if (req.user.role === 'admin') {
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Admin can only set status to accepted or rejected'
        });
      }
    } else {
      const validTransitions = {
        submitted: ['under review'],
        'under review': ['accepted', 'rejected']
      };
      if (!validTransitions[application.status]?.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from '${application.status}' to '${status}'`
        });
      }
    }

    application.status = status;
    application.reviewedAt = Date.now();
    application.reviewedBy = req.user.userId;
    
    // For accepted/rejected status, also store the decision timestamp
    if (['accepted', 'rejected'].includes(status)) {
      application.decisionAt = Date.now();
    }
    
    await application.save();
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

exports.applicationStats = async (req, res, next) => {
  try {
    const [totalApplications, statusStats, recentApplications, programStats] = await Promise.all([
      Application.countDocuments(),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.find().sort({ submittedAt: -1 }).limit(5).populate('userId', 'name'),
      Application.aggregate([{ $group: { _id: '$program', count: { $sum: 1 } } }])
    ]);

    const byStatus = statusStats.reduce((acc, stat) => { acc[stat._id] = stat.count; return acc; }, {});
    res.json({ success: true, totalApplications, byStatus, recentApplications, byProgram: programStats });
  } catch (error) {
    next(error);
  }
};
