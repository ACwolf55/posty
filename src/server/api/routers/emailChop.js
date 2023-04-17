const emailChop = (email) => {
    let emailAr = email.split("");
    console.log(emailAr);
    let chop = emailAr.findIndex((char) => char == "@");
    let len = emailAr.length - chop;
    emailAr.splice(chop, len, " !");
    let str = emailAr.join("");
    return str;
  };

module.exports = emailChop