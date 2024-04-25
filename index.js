const AWS = require('aws-sdk');
const s3 = new AWS.S3();

//testing codebuild 
const x = 1;
exports.handler = async (event) => {
    try {
        // Retrieve the image data from the event
        const imageBuffer = Buffer.from(event.image, 'base64');

        // Define the S3 bucket and key (file path) where you want to store the image
        const bucketName = 'pure-poker-profile-pics';
        const key = event.key; // Change this to your desired file path and format

        // Upload the image to S3
        await s3.putObject({
            Bucket: bucketName,
            Key: key,
            Body: imageBuffer,
            ContentType: 'image/jpeg' // Change this according to your image format
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify('Image added to S3 successfully')
        };
    } catch (error) {
        console.error('Error adding image to S3:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error adding image to S3')
        };
    }
};