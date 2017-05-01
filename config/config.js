var config = {
	port: process.env.PORT || 3000,
	db: 'mongodb://localhost:27017/myimdb',
    //dburl:'mongodb://sa:password123@ds121171.mlab.com:21171/testmongo'
	dburl: 'mongodb://sa:password123@ds123381.mlab.com:23381/testimdb',
	
    homepage:'index.html'
};
module.exports = config;
