const errorHandler = (res, error) => {
	console.error(error);
	return res.status(500).json({
			status: "ERR",
			message: error.message || "An unexpected error occurred"
	});
};

module.exports = errorHandler;