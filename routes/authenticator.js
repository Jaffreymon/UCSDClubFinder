/**
 * Created by Jeffers on 2/25/2017.
 * Authenticate user's input to database
 */


let authenticator = module.exports = {
    /**
     * Extracts a phone number from a given string
     * @param phone_number: given input string
     * @returns
     *      - true, if formatted correctly
     *      - false, if formatted incorrectly
     */
    parse_phoneNum: function (phone_number) {
        let number = "";

        for (let idx = 0; idx < phone_number.length; idx++) {
            let curr_dig = phone_number.charAt(idx);
            // Verifies if current symbol is a number
            if (!isNaN(curr_dig)) {
                number += curr_dig;
            }
        }
        return number;
    },

    /**
     * Takes 10 digit phone number and format it under (<area code>)<3 digits>-<4 digits>
     */
    format_phone :function (phone) {
      let phoneNum = "(";
      phoneNum += phone.substring(0,3) + ")" + phone.substring(3,6)+"-"+phone.substring(6);

      return phoneNum;
    },

    /**
     * verifies given phone number is valid
     */
    verify_phone: function (req, res, phone) {
        // Assures final phone number is valid
        if (phone.length == 10) {
            return true;
        }

        req.flash('errorMsg', 'Ten digit Phone Number required (###-###-####)');
        return false;
    },

    /**
     * Verifies given email is a ucsd.edu email
     */
    verify_email: function (req, res, email) {

        // kickbox.verify(email, function (err, response) {
        //     // Let's see some results
        //     console.log(response.body);
        // });

        // Assures email address ends in ucsd.edu to be a ucsd email
        if(email.substring(email.length-9) === '@ucsd.edu') {
            return true;
        }
        req.flash('errorMsg', ' Valid UCSD Email required (@ucsd.edu)');
        return false;
    },

    /**
     * Capitalizes the first letter of a string to formalize a pronoun
     * @param name : string name
     * @returns the name with pronoun style
     */
    capitalize_name : function (name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    },

    /**
     * Ensures a user's session shows they're logged on
     */
    ensureLoggedIn: function (req, res, next) {
        if (req.session.user !== undefined) {
            return next();
        }
        else {
            res.redirect('/users/login');
        }
    },

    /**
     * Ensures a user is a club leader of the current club
     */
    verifyCredentials: function (req, res, email, phone) {
        let result = !authenticator.verify_phone(req, res, phone);
        result = !authenticator.verify_email(req, res, email) || result;
        return result;
    },

    /**
     * Formats 24 hour time to 12 hour time
     */
    formatTime : function (time) {
        if (time === '') {
            return '';
        }

        let amOrPM= "";

        // Get hour in 24 hour string
        let currHour = parseInt(time.substring(0,2));
        // Get minute in 24 hour string
        let currMin = time.substring(3);

        // Determine if time is in AM or PM
        if (currHour < 12) {
            amOrPM = "AM";
        } else {
            amOrPM= "PM";
        }
        // Get the correct PM time if past 12
        currHour = currHour % 12 === 0 ? 12 : (currHour % 12);
        return currHour + ":" + currMin + "" + amOrPM;
    }

};