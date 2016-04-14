var proxyquire = require('proxyquire');
var sinon = require('sinon');

// TODO: add more tests
describe('redis token repository constructor', function() {
    var TokenRepository;

    before(function() {
        TokenRepository = proxyquire('../', {
            ioredis: sinon.stub()
        });
    });

    it('should initialize the instance of redis', function() {
        var repository = new TokenRepository({
           host: 'localhost',
           port: 6379
        });

        repository.redis.should.be.ok();
    });
});