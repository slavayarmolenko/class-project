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
}
exports.getInsertNameString = function(columnObject, columnValue){
    if(!columnObject.required &&(!columnValue)){
        return "";
    }
    return  columnObject.id +', ';
}
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
}