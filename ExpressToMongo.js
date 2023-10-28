var exp=require('express');
var dot=require('dotenv');
var mon=require('mongoose');
var app=exp();
var bparser=require('body-parser');
bparserinit=bparser.urlencoded({extended:false});
//Create connection to database
mon.connect("mongodb://127.0.0.1:27017/local?directConnection=true&serverSelectionTimeoutMS=2000t&appName=ExpressMongo")
.then(()=>{console.log('Connected to the database')})
.catch(()=>{console.log('Unable to connect ti the database. Check URL')})

/*
defining structure of collection
link structure with name of actual collection in database
Actual collection name in "Users"
prepare the data to be inserted into the collection
insert data into the collection. For inserting data use save() function.
then check if data insertion is succesful.
model(<collectionname>,<schemaname or structure of the collection>)
Retrieve all records.If successfully retrieved display.else error
*/
const userSchema = {userid:String, password:String, emailId:String};
var  userData=mon.model('Users',userSchema);



app.listen(8800,function(error)
{
    if(error != undefined)
    console.log(error.message);
    else
    console.log("Connect to port 8800.Waiting for request");
    console.log("On the browser,visit http://localhost:8800/");
})

function addNewUser(request,response)
{
    var udata=new userData(
        {
         'userid':request.body.userid,
          'password':request.body.password, 
          'emailId':request.body.emailId
        });
    udata.save()
    .then((udata)=>
    {
      console.log("Insert is successful");
      response.send("<b>Inserted Succesfully")
    })
    .catch((error)=>
    {
      console.log(error);
      response.send("Unable to insert data")
    })
}
function getAllUsers(request,response)
{
    userData.find()
    .then((data)=>
    {
      console.log(data);
      response.send(data);
    })
    .catch((error)=>
    {
      console.log(error);
      response.send('could not retrieve data');
    });
}
function updateUserData(request, response) {
  const userid = request.body.userid;
  const updateData = {
      password: request.body.password,
      emailId: request.body.emailId
  };
   userData.findOneAndUpdate({ userid: userid }, updateData, { new: true })
      .then((updatedUser) => {
          if (updatedUser) {
              console.log("Update is successful");
              response.send("Updated Successfully");
          } else {
              console.log("User not found for update");
              response.send("User not found for update");
          }
      })
      .catch((error) => {
          console.log(error);
          response.send("Unable to update data");
      });
}
function deleteUserData(request, response) {
  const userid = request.params.userid;
  userData.findOneAndRemove({ userid: userid })
      .then((removedUser) => {
          if (removedUser) {
              console.log("Deletion is successful");
              response.send("User Deleted Successfully");
          } else {
              console.log("User not found for deletion");
              response.send("User not found for deletion");
          }
      })
      .catch((error) => {
          console.log(error);
          response.send("Unable to delete user");
      });
}
app.post('/addNewUser',bparserinit,addNewUser);
app.get('/getAll',getAllUsers);
app.put('/updateUser', bparserinit, updateUserData);
app.delete('/deleteUser/:userId', deleteUserData);


