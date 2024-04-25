const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const requestOrigin = event.headers ? event.headers.origin : "*";

    try {
        // Retrieve the image data from the event
        const imageBuffer = Buffer.from(event.image, 'base64');

        // Define the S3 bucket and key (file path) where you want to store the image
        const bucketName = 'pure-poker-profile-pics';
        const key = event.key; // Change this to your desired file path and format
        console.log(key)

        // Upload the image to S3
        await s3.putObject({
            Body: imageBuffer,
            Bucket: bucketName,
            Key: key,
            ContentType: 'image/jpeg' // Change this according to your image format
        }).promise();

        console.log("Image added to S3 successfully");

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