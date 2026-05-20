const bcrypt = require('bcryptjs');

const hash = '$2a$10$mcA.7JFTeP.uwa/QTHokW.LH6jVQflKFueR5pLlOf7zLm7iuUPeIC';
const plain = 'Password123!';

bcrypt.compare(plain, hash, function(err, res) {
    if (err) {
        console.error(err);
    } else {
        console.log("Matches Password123!:", res);
    }
});

const plain2 = 'Password123';
bcrypt.compare(plain2, hash, function(err, res) {
    if (err) {
        console.error(err);
    } else {
        console.log("Matches Password123:", res);
    }
});
