var ZipCodes = require('zipcodes');
exports.filterLawyers = function (languageID, serviceID, zip, rad) {
    var SQLquery;
    if (languageID && serviceID && languageID.length && serviceID.length) {
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip, images.url FROM lawyers ' +
            'INNER JOIN (SELECT * FROM lawyer_language WHERE lawyer_language.languageID IN (' + languageID + ')) AS lawyer_language ON lawyers.id = lawyer_language.lawyerID ' +
            'INNER JOIN (SELECT * FROM lawyer_service WHERE lawyer_service.serviceID IN (' + serviceID + ')) AS lawyer_service ON lawyers.id=lawyer_service.lawyerID LEFT JOIN images ON images.id=lawyers.imageID';
    } else if (languageID && languageID.length) {
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip, images.url FROM lawyers ' +
            'INNER JOIN (SELECT * FROM lawyer_language WHERE lawyer_language.languageID IN (' + languageID + ")) AS lawyer_language ON lawyers.id = lawyer_language.lawyerID LEFT JOIN images ON images.id=lawyers.imageID";
    } else if (serviceID && serviceID.length) {
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip, images.url FROM lawyers ' +
            'INNER JOIN (SELECT * FROM lawyer_service WHERE lawyer_service.serviceID IN (' + serviceID + ")) AS lawyer_service ON lawyers.id = lawyer_service.lawyerID LEFT JOIN images ON images.id=lawyers.imageID";

    } else {
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip, images.url FROM lawyers LEFT JOIN images ON images.id=lawyers.imageID';
    }
    if (zip && rad) {
        var zips = ZipCodes.radius(zip, rad);
        if (zips.length) {
            if (languageID && serviceID && languageID.length && serviceID.length) {
                SQLquery += " WHERE lawyers.zip IN (" + zips + ") ";
            } else if (languageID && languageID.length) {
                SQLquery += " WHERE lawyers.zip IN (" + zips + ") ";
            } else if (serviceID && serviceID.length) {
                SQLquery += " WHERE lawyers.zip IN (" + zips + ") ";
            } else {
                SQLquery += " WHERE zip IN (" + zips + ") ";
            }
        }
    }
    if (languageID && serviceID && languageID.length && serviceID.length) {
        SQLquery += " GROUP BY lawyers.id ORDER BY lawyers.name;";
    } else if (languageID && languageID.length) {
        SQLquery += " GROUP BY lawyers.id ORDER BY lawyers.name;";
    } else if (serviceID && serviceID.length) {
        SQLquery += " GROUP BY lawyers.id ORDER BY lawyers.name;";
    } else {
        SQLquery += " ORDER BY lawyers.name;";
    }
    console.log(SQLquery);
    return SQLquery;
}
