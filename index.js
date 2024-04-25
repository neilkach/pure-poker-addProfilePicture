const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const mysql = require('mysql');

exports.handler = async (event) => {
    const requestOrigin = event.headers ? event.headers.origin : "*";

    try { 
        // Retrieve the image data from the event
        const imageBuffer = Buffer.from(event.params.image, 'base64');

        // Define the S3 bucket and key (file path) where you want to store the image
        const bucketName = 'pure-poker-profile-pics';
        const key = event.params.username + '.jpeg';
        // Upload the image to S3
        await s3.putObject({
            Bucket: bucketName,
            Key: key,
            Body: imageBuffer,
            ContentType: 'image/jpeg' // Change this according to your image format
        }).promise();

        await updateProfilePic(event.params.username, key);

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

const updateProfilePic = async(username, link) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        connection.connect(err => {
            if (err) {
                console.error('Database connection failed:', err);
                reject(new Error('Database connection failed', host, user, password, databse));
                return;
            }

            const updateQuery = 'UPDATE users SET profile_pic_link = ? WHERE username = ?'
            
            connection.query(updateQuery, [link, username], (err) => {
                connection.end();
                if (err) {
                    reject(new Error(`Failed to update profile_pic_link. Error: ${err.message}`));
                    return;
                }
                resolve(true);
            });
        })
    })
}