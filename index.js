const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const requestOrigin = event.headers ? event.headers.origin : "*";

    try {
        console.log(event);
        console.log(event.params);
        const key = event.params.key; 
        console.log(key)

        // Retrieve the image data from the event
        console.log(event.params.image)
        const imageBuffer = Buffer.from(event.params.image, 'base64');

        // Define the S3 bucket and key (file path) where you want to store the image
        const bucketName = 'pure-poker-profile-pics';

        // Upload the image to S3
        await s3.putObject({
            Bucket: bucketName,
            Key: key,
            Body: imageBuffer,
            ContentType: 'image/jpeg' // Change this according to your image format
        }).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": requestOrigin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify('Image added to S3 successfully')
        };
    } catch (error) {
        console.error('Error adding image to S3:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": requestOrigin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify('Error adding image to S3')
        };
    }
};