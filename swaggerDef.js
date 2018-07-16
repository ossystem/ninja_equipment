module.exports = {
  info: {
    title: 'Ninja equipment',
    version: '0.0.1',
    description: 'API for online shop selling ninja equipment',
  },
  produces: ['application/json'],
  schemes: ['https', 'http'],
  components: {
		"securitySchemes": {
			"BearerAuth": {
				"type": "https",
				"scheme": "bearer"
			}
		}
	},
  host: 'localhost'
};
