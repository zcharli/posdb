# POSDB
###### Ziqiao Charlie Li - 100832679

Thanks for taking the chance to view my Node POS program made for my database 
project in COMP 3005 at Carleton University for the winter semester of 2014 
(in 2015). This read me is meant to help you get the project up and running. 

Although the application is responsive to the screen size, it is still recommended that you 
run the project full screen so you can see everything as the application screen is fixed,
therefore no scrolling.

Please run on a newer modern version of Chrome as it was developed on this 
browser.

## ~ Getting it up ~

Go ahead and download this project [here](/zcharli/posdb/archive/master.zip) 

#### Dependencies:
Internet connection 
Node.js 0.10.x

Run the following commands:

Extract the zip file with project in it or git clone this repository, open up a terminal or powershell
`cd posdb`
`npm install`

*If anything goes wrong* here are some additional command you can use with out harm:

`npm install sqlite3`

`npm install connect-sqlite3`

`npm install express-session`

This should be the command neccessary to download the dependencies for the proj:

To start:
`npm start`

Now browse to *localhost:3000* to play with the app

If there is any issues when starting, try to npm install <missing dependency>

Accounts you may play with:

|username |  password  | role								 |
|---------|------------|-------------------------------------|
|charlie1 |  password  | admin (super user) - prefered login |
|johnny3  |  password  | employee							 |
|john2    |  password  | manager							 |
|sally4   |  password  | accountant - only sales data        |

To update data, usually clicking the the row of data you want to update will 
spawn a pop up for you to edit
