exports.getDate =function (){
let today = new Date();
  let option ={
    weekday:"long",
    day:"numeric",
    month:"long"
  };

  return today.toLocaleString("en-US",option);
}

exports.getDay =function (){
    let today = new Date();
      let option ={
        weekday:"long"
      };
    
      return today.toLocaleString("en-US",option);
    }