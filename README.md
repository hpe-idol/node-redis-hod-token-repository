# node-redis-hod-token-repository

Redis based repository for storing tokens from [HPE Haven OnDemand](http://www.havenondemand.com)

Designed for use with the hod-request-lib

## Usage

node-redis-hod-token-repository is compatible with only [ioredis](https://github.com/luin/ioredis) at this time.

To configure the token repository either pass an existing ioredis instance:

    var Redis = require('ioredis');

    new RedisTokenRepository({
        redis: new Redis(options)
    });

...Or pass the details of your redis server directly to the library and it will instantiate ioredis itself:

    // Using redis sentinel
    new RedisTokenRepository({
        sentinels: sentinels,
        master: 'masterName',
        db: 0
    });

    // Or connecting to a single redis server
    new RedisTokenRepository({
        host: 'localhost',
        port: 6379,
        db: 0
    });

## License
Copyright 2016 Hewlett Packard Enterprise Development LP

Licensed under the MIT License (the "License"); you may not use this project except in compliance with the License.
