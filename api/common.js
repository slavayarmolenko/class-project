var session = require('express-session');
var errorCodes = require('./errorTypes.js');

exports.getUpdateValueString = function(columnObject, columnValue){
    //columnObject : { type: 'string'/'number', id: string, required: true/false}
    if(columnObject.required &&(!columnValue)){
        return "";
    }
    if(columnObject.type == "string"){
        return columnObject.id + "='" + (columnValue||'') + "', "; 
    } else if ((columnObject.type == "number")||(columnObject.type == "boolean")){
        return columnObject.id + "=" + (columnValue||'') + ", "; 
    } else {
        return "";
    }
};
exports.getInsertNameString = function(columnObject, columnValue){
    if(!columnObject.required &&(!columnValue)){
        return "";
    }
    return  columnObject.id +', ';
};
exports.getInsertValueString = function(columnObject, columnValue){
    //addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.uzvername + '",';
    if(!columnObject.required &&(!columnValue)){
        return "";
    }
    if(columnObject.type == "string"){
        return  "'"+(columnValue||"") + "', "; 
    } else if ((columnObject.type == "number")||(columnObject.type == "boolean")){
        return (columnValue||'') + ", "; 
    } else {
        return "";
    }
};

exports.getIsLogged = function(req) {
    console.log('We logged: ' + (req.session && req.session.userID) ? true : false);
    return (req.session && req.session.userID) ? true : false;
};

exports.getSuccessObject = function(data, req) {
    console.log('Returning success.');
    var logged = this.getIsLogged(req);
    return {
        success: true,
        data: data,
        logged: logged
    }
};
exports.getSqlErrorObject = function(err, req) {
    console.error('Error:');
    console.log(err);
    return this.getErrorObject(err.sqlMessage, req, errorCodes.errors.SQL_RESTRICTIONS_FAILED);

};

exports.getErrorObject = function(errText, req, errCode) {
    return { 
        success: false, 
        errMessage: errText || 'Unknown error',
        errCode: errCode || errorCodes.errors.BAD_REQUEST,
        logged: this.getIsLogged(req),
        data: req.query || req.body
    };

};



exports.getUnloggedError = function() {
    return { 
        success: false, 
        errMessage: 'Can not perform this operation without logging',
        errCode: errorCodes.errors.UNAUTHORIZED,
        logged: false
    };
};
