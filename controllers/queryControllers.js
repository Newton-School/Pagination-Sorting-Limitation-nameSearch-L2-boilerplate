const User = require('../models/userModel');

const filterQueries = async (req, res) => {
  try {
    const { first_name, last_name } = req.query || '';
    const sort = req.query.sort || 'age';
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 5; // Default limit is 5
    const queryObject = {};

    if (first_name) {
      queryObject.first_name = { $regex: first_name, $options: 'i' };
    }
    if (last_name) {
      queryObject.last_name = { $regex: last_name, $options: 'i' };
    }
    const users = await User.find(queryObject)
      .sort(sort.startsWith('-') ? sort.substring(1) : sort)
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(limit); // Limit the number of records returned for pagination

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { filterQueries };
