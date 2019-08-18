// routes/utils/findDomain.js



////////////////////////////////////////////////////////////////////////////////
//
// Here is the list of pids with parsing logic in this module:
//
//  NOTE: pid 0 is the default for any forwarded sms message that doesn't get
//        assigned one of the below pid values
//
//  - pid 1 : Gmail
//  - pid 2 : Yahoo mail
//  - pid 3 : AOL mail
//  - pid 4 : Office 365
//
////////////////////////////////////////////////////////////////////////////////
module.exports = function(fullMessage) {
	//default pid to 0
	pid = "0";
	
	if (fullMessage.indexOf("AOL") != -1) {
		pid = "3";
	}
	else if (fullMessage.indexOf("Yahoo") != -1) {                                                                                                                                                       
        pid = "2";
	}
	else if (fullMessage.indexOf("G-") != -1) {                                                                                                                                                          
        pid = "1";
	}
	else if (fullMessage.indexOf("Office") != -1) {                                                                                                                                                      
        pid = "4";
	}
	return pid;
};