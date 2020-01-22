import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as util from 'util';
import * as uuidv4 from 'uuid/v4';

const readFile = util.promisify(fs.readFile);

const BUCKET_NAME = 'pot-of-gold-at-the-end-of-the-rainbow';

dotenv.config();
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

const uploadToS3 = async (data: Buffer): Promise<string> => {
    const name = uuidv4() + '.jpeg';
    await s3.putObject({
        Key: name,
        Bucket: BUCKET_NAME,
        ContentType: 'image/jpeg',
        Body: data,
        ACL: 'public-read',
    }).promise();
    return name;
}

const main = async () => {
    try {
        const data = await readFile('./image.jpeg');
        const url = await uploadToS3(data);
    } catch (err) {
        console.log(err);
    }
};

main();