

/**
* Helper Functions for validating register Email and Password.
*/

/** 
 * Check Name Format: First Name (Starting with uppercase) Last Name (Starting with Uppercase letter)
 * @param {string} username
 * Returns a String error message if username is not in the required format, 
 * otherwise "" if username is valid 
 */

const check_username = (username) => {
    const pattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    const reg = new RegExp(pattern, "i");

    if (username.match(reg)) {
        return "";
    } else {
        return `Invalid Username! Username include first and last name, and start with uppercase`;
    }
}

// /**
// * Check Etown email Format: account@etown.edu
// * @param {string} email
// * Returns a String error message if email is not in the required format,
// * otherwise "" if email valid.
// **/
const check_email = (email) => {
    const pattern = /^[a-z]+\d*\@etown\.edu$/;
    const reg = new RegExp(pattern, "i");
 
 
    if (email.match(reg)) {
        return "";
    } else {
        return `Invalid etown.edu email: ${email}`;
    }
}
 
 
 /**
 * Check password Format:
    At least
         - one uppercase letter,
         - one lowercase letter,
         - one number,
         - one special character,
    and at least 8 characters long.
 
 
 * @param {string} password
 * Returns a String error message if password is not in the required format,
 * otherwise "" if password valid.
 **/
 const check_password = (password) => {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    // (?=.*[A-Za-z]): a positive lookahead.
    // There must be at least one letter anywhere in the string.
 
 
    const reg = new RegExp(pattern, "i");
 
 
    if (password.match(reg)) {
        return "";
    } else {
        return `Invalid password! Password must be at least 8 characters long and contain at least one uppercase letter,
         one lowercase letter, one number, and one special character.`;
    }
 }
 
 
 module.exports = {
    check_username,
    check_email,
    check_password
 };
 