const advancedResults = (Model, populate) => async (req, res, next) => {
  let query;

  //copy query
  let reqQuery = { ...req.query };

  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //create operators($gt, $gte, $lte, $lt, in)
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Model.find(JSON.parse(queryStr));

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //populate
  if (populate) {
    query = query.populate(populate);
  }

  //executing query
  const results = await query;

  //pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  } else if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
