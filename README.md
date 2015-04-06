POSDB
=====

Ziqiao Charlie Li - 100832679

Thanks for taking the chance to view my Node POS program made for my database 
project in COMP 3005 at Carleton University for the winter semester of 2014 
(in 2015). This read me is meant to get the project up and running. 

Although the application is highly responsive, it is still recommended that you 
run the project full screen so you can see everything as the application is fixed,
therefore no scrolling.

Please run on a newer modern version of Chrome as it was developed on this 
browser.

Dependencies:
Must have internet connection and Node.js installed
Run the following commands:

cd posdb
npm install
npm install express-session
npm install sqlite3
npm install connect-sqlite3

These should be the command neccessary to download dependencies for the proj:

To start:
node ./bin/www

If there is any issues when starting, try to npm install <missing dependency>

Accounts you may play with:
username    password    role
========    ========    ====
charlie1    password    admin (super user) - prefered login
johnny3     password    employee
john2       password    manager
sally4      password    accountant - only sales data

To update data, usually clicking the the row of data you want to update will 
create a pop up for you to edit
