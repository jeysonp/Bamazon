var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host:"localhost",
  port:3306,
  user:"root",
  password:"root",
  database:"bamazon"
});

connection.connect(function(error){
  if (error) throw error;
  console.log("Connection is successeful");
  drawTable();
});

var drawTable = function(){
  connection.query("SELECT * FROM products", function(error,result){
    for(var i=0; i<result.length; i++){
      console.log(result[i].item_id+" || "+
      result[i].product_name+" || "+
      result[i].department_name+" || "+
      result[i].price+" || "+
      result[i].stock_quantity+
      "\n=========================================================================================");
    }
  userPrompt(result);
  })
};

var userPrompt = function(result){
  inquirer.prompt([{
    type:"input",
    name:"selection",
    message:"What would you like to buy? [Press Q to Quit]"
  }]).then(function(answer){
    if(answer.selection.toUpperCase()=="Q"){
      process.exit();
    }
    for(var i=0;i<result.length;i++){
      if(result[i].product_name==answer.selection){
        correct=true;
        var product=answer.selection;
        var id=i;
        inquirer.prompt({
          type:"input",
          name:"quantity",
          message: "What quantity would you like to buy?",
          validate: function(value){
            if(isNaN(value)==false){
              return true;
            } else {
              return false;
            }
          }
        }).then(function(answer){
          if((result[id].stock_quantity-answer.quantity)>0){
            connection.query("UPDATE products SET stock_quantity='"+
            (result[id].stock_quantity-answer.quantity)+
            "'WHERE product_name='"+product+"'",
             function(error,result2){
              console.log("Product Purchased");
              drawTable();
            })
          } else {
            console.log("Selection not valid!");
            userPropt(result);
          }
        })
      }
    }
    if (i==result.length && correct==false){
      console.log("Selction not valid!");
      userPrompt(result);
    }  
  })
}