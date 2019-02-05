# phone-verification

This is a node.js / mongodb web application for processing, storing, and providing phone verification codes along with associated 
transaction data through a set of API endpoints. 

API Endpoints

/phoneinfo (HTTP POST) 
- inserts a row into mongodb with the required values for host_number, remote_number, and message (TBD - add example of the post body)

/phoneinfo/:id (HTTP GET)
- returns at a row based on provided database row id

/phoneinfo/host_number/:host_number (HTTP GET)
- returns a row based on provided host number

/phoneinfo/host_number/:host_number/message/:message (HTTP GET)
- returns a row based on provided host number and message

/phoneinfo/host_number/:host_number/creation_date/:date (HTTP GET)
- returns a row based on provided host number and creation date

/phoneinfo/:id (HTTP DELETE)
- deletes a row based on provided database row id

/phoneinfo/:id (HTTP PUT)
-updates a row based on the provided database row id
