# SimpleMockServer

It's an easy config mock server mainly for mobile/frontend developers as they might need early API access while the backend guys still trying to setup their system. With SimpleMockServer, people can setup API mock response from a simple settings file (config.ini) as well as a bunch of sample JSON files in couple of seconds.

## How to use

1. Setup your environment with NodeJS (http://howtonode.org/how-to-install-nodejs)
2. Install NodeJS dependencies using the following command inside project folder:
   npm install
3. Modify the config.ini file and related json files to meet your business requirement
4. Start NodeJS with following command:
   node bin/www
   You will see the project started at port 8080. If you do want to change it to other value like 80, please check the serverConfig.js in config folder (And please make sure you have the proper permission to change the port)
5. Try your API from either mobile API clients or your favourite web browser
   e.g. http://localhost:8080/api/v1/demoshop/products

## Project roadmap

1. Sample iOS clients with both Objective C and Swift
2. Sample Android client
3. Authentication header checking with fail response of HTTP status 401
