// This file is present so that travis ci doesnt run into serve mode .

var port = process.env.PORT||80;

if(port===80)
{
console.log(' Check the online  heroku build of this app      ===>        https://zygolo.herokuapp.com/')
}
