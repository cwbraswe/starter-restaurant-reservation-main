function hasProps(props){
    return function(req, res, next){
      const { data = {} } = res.locals;
      try {
        props.forEach((prop) => {
          const value = data[prop];
          if (!value) {
            const error = new Error(`A '${prop}' property is required.`);
            error.status = 400;
            throw error;
          }
        });
        return next();
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = hasProps;