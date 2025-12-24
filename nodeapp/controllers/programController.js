const Program = require('../models/Program');

exports.listPrograms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchQuery = {
      isActive: true
    };

    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [programs, total] = await Promise.all([
      Program.find(searchQuery)
        .populate('createdBy', 'name')
        .sort({ deadline: 1 })
        .skip(skip)
        .limit(limit),
      Program.countDocuments(searchQuery)
    ]);

    // Set headers to prevent caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
    
    res.json({
      success: true,
      programs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPrograms: total
    });
  } catch (error) {
    next(error);
  }
};

exports.createProgram = async (req, res, next) => {
  try {
    const program = new Program({
      ...req.body,
      availableSeats: req.body.totalSeats,
      createdBy: req.user.userId
    });
    await program.save();
    res.status(201).json({ success: true, program });
  } catch (error) {
    next(error);
  }
};

exports.getProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id).populate('createdBy', 'name');
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program });
  } catch (error) {
    next(error);
  }
};

exports.updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program });
  } catch (error) {
    next(error);
  }
};

exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
