import bcrypt from 'bcrypt';

const saltRounds = 10;

//throwaway password; read the real deal in from a user-submitted form later!!!!
const dummyPass = 'nNg7y3wj5pYJ9DBvqZ4z';

async function hashPass(pass) {
    try {
        const hashed = await bcrypt.hash(dummyPass, saltRounds);
        console.log("Hashed password: " + hashed);
        return hashed;
    }
    catch (error) {
        console.error("Error hashing password: " + error);
    }
}

const hashed = await hashPass(dummyPass);

export default hashPass;


// L8pGTjeahEkRmKMU6XDV
// nNg7y3wj5pYJ9DBvqZ4z
// L8q9BrJfn6PE7SMeXtj5
// Edn7JF6spLuhWqj4Qw2X