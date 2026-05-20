const bcrypt = require('bcryptjs');

const password = 'Thaonguyen101004@';
bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log("Hash for Thaonguyen101004@ is:", hash);
    }
});
