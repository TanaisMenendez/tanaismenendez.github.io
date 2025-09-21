function showDatey()
{
var now = new Date();
function fourdigitsy(number)
{
return (number < 1000) ? number + 1900 : number;
}
  
today =  fourdigitsy(now.getYear())  ;
document.getElementById("dateDivy").innerHTML = today;
}
setInterval("showDatey()", 1000);