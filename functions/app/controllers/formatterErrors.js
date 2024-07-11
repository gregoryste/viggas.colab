function formatterErrors(validate){

    const formatter = ({
        location,
        msg,
        param,
        value,
        nestedErrors
      }) => {
          return `${msg}`;
      };
    
    return validate.formatWith(formatter);
}

module.exports = formatterErrors;