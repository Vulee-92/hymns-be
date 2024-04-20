const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req,res,next) => {
	const token = req.headers.token?.split(' ')[1];
	console.log("token",token)
	if (token === null) {
		return res.status(401).json({
			message: 'Unauthorized',
			status: 'ERROR'
		});
	}

	jwt.verify(token,process.env.ACCESS_TOKEN,function (err,user) {
		if (err || !user.isAdmin) {
			return res.status(401).json({
				message: 'Unauthorized',
				status: 'ERROR'
			});
		}
		next();
	});
};

const authUserMiddleWare = (req,res,next) => {
	const token = req.headers.token?.split(' ')[1];
	const userId = req.params.id;
	if (!token) {
		return res.status(401).json({
			message: 'Unauthorized',
			status: 'ERROR'
		});
	}

	jwt.verify(token,process.env.ACCESS_TOKEN,function (err,user) {
		if (err || (!user.isAdmin && user.id !== userId)) {
			return res.status(401).json({
				message: 'Unauthorized',
				status: 'ERROR'
			});
		}
		next();
	});
};

module.exports = {
	authMiddleWare,
	authUserMiddleWare
};
