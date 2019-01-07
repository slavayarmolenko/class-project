var session = require('express-session');
var errorCodes = require('./errorTypes.js');
var _escapeString = function (val) {
    val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
      switch (s) {
        case "\0":
          return "\\0";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "\b":
          return "\\b";
        case "\t":
          return "\\t";
        case "\x1a":
          return "\\Z";
        case "'":
          return "''";
        case '"':
          return '""';
        default:
          return "\\" + s;
      }
    });
  
    return val;
  };
exports.getUpdateValueString = function(columnObject, columnValue){
    //columnObject : { type: 'string'/'number', id: string, required: true/false}
    if(columnObject.required &&((columnValue === undefined) || (columnValue === null) || (columnValue === ''))){
        return "";
    }
    if(columnObject.type == "string"){
        var dbColumnValue = _escapeString(columnValue||'');
        return columnObject.id + "='" + dbColumnValue + "', "; 
    } else if ((columnObject.type == "number")||(columnObject.type == "boolean")){
        return columnObject.id + "=" + (columnValue) + ", "; 
    } else {
        throw "ColumObject unknown type in common.js" + columnObject.id;
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
        var dbColumnValue = _escapeString(columnValue||'');
        return  "'"+dbColumnValue + "', "; 
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

exports.getLoggedUserID = function(req) {
    return (req.session && req.session.userID) ? req.session.userID : 0;
};
exports.getLoggedUserName = function(req) {
    return (req.session && req.session.userID) ? req.session.username : '';
};

exports.getSuccessObject = function(data, req) {
    console.log('Returning success.');
    var logged = this.getIsLogged(req);
    var userID = this.getLoggedUserID(req);
    return {
        success: true,
        data: data,
        logged: logged,
        userID: userID
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
        userID: this.getLoggedUserID(req),
        data: req.query || req.body
    };

};



exports.getUnloggedError = function() {
    return { 
        success: false, 
        errMessage: 'Can not perform this operation without logging',
        errCode: errorCodes.errors.UNAUTHORIZED,
        logged: false,
        userID: 0
    };
};
