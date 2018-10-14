module.exports = function (context, req) {

    const azureStorage = require('azure-storage');
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log('filename: ' + req.body.filename);
    const sasKey = 'SAS_TOKEN';
    const blobUri = "http://<YOUR_ACCOUNT>.blob.core.windows.net";
    const blobService = azureStorage.createBlobServiceWithSas(blobUri, sasKey);
    let rawdata = req.body.data;
    const matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const type = matches[1];
    const buffer = new Buffer(matches[2], 'base64');

    blobService.createBlockBlobFromText('mycontainer', 'subFolder/' + req.body.filename + '.png', buffer, {
            contentType: type
        }, (error, result, response) => {
            if (error) {
                console.log(error);
                context.res = {
                    status: 400,
                    error: error
                }
                context.done();
            } else {
                console.log(result)
                context.res = {
                    body: {
                        status: 'uploaded success',
                        url: blobUri + '/mycontainer/subFolder/' + req.body.filename + '.png'
                    }
                }
                context.done();
            }
        });
};