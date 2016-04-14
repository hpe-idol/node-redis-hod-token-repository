var uuid = require('node-uuid');
var Redis = require('ioredis');


module.exports = RedisTokenRepository;

function RedisTokenRepository (config) {
    if(config.redis) {
        this.redis = config.redis;
    } else if(config.sentinels && config.sentinels.length) {
        this.redis = new Redis({
            sentinels: config.sentinels,
            name: config.master || 'mymaster',
            db: config.database || 0
        });
    } else {
        this.redis = new Redis({
            port: config.port || 6379,
            host: config.host || 'localhost',
            db: config.database || 0
        });
    }
}

RedisTokenRepository.prototype.insert = function (token, callback) {
    if(tokenExpired(token)) {
        return callback(new Error('Token has already expired.'), null);
    }

    var tokenProxy = uuid.v4();
    return this.redis.setex(tokenProxy, getExpirySeconds(token), JSON.stringify(token), function(err) {
        if(err) return callback(err);

        return callback(null, tokenProxy);
    });
};

RedisTokenRepository.prototype.update = function(tokenProxy, token, callback) {
    if(tokenExpired(token)) {
        return callback(new Error('Token has already expired.'), null);
    }

    this.redis.multi()
        .get(tokenProxy)
        .set(tokenProxy, JSON.stringify(token), 'XX', 'EX', getExpirySeconds(token))
        .exec(function(err, results) {
            if(err) return callback(err);

            return callback(null, JSON.parse(results[0][1]));
        });
};

RedisTokenRepository.prototype.get = function (tokenProxy, callback) {
    this.redis.get(tokenProxy, function(err, result) {
        if(err) return callback(err);

        return callback(null, JSON.parse(result));
    });
};

RedisTokenRepository.prototype.remove = function (tokenProxy, callback) {
    this.redis.multi()
        .get(tokenProxy)
        .del(tokenProxy)
        .exec(function(err, results) {
            if(err) return callback(err);

            return callback(null, JSON.parse(results[0][1]));
        });
};

function tokenExpired(token) {
    return token.expiry && token.expiry <= Date.now();
}

function getExpirySeconds(token) {
    return Math.round((token.expiry - Date.now()) / 1000);
}

