
module.exports.getDate = function (){
    let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    // year: "numeric",
  };

  let formattedDay = today.toLocaleDateString("en-US", options);
  return formattedDay;
}




module.exports.getDay = function (){
    let today = new Date();
  let options = {
    weekday: "long",
    // day: "numeric",
    // month: "long",
    // year: "numeric",
  };

  let formattedDay = today.toLocaleDateString("en-US", options);
  return formattedDay;
}