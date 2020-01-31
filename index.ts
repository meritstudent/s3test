import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as util from 'util';
import { uuid } from 'uuidv4';

const readFile = util.promisify(fs.readFile);

const BUCKET_NAME = 'realreact-test';

dotenv.config();
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

const uploadToS3 = async (data: Buffer): Promise<string> => {
    const name = uuid() + '.jpeg';
    await s3.putObject({
        Key: name,
        Bucket: BUCKET_NAME,
        ContentType: 'image/jpeg',
        Body: data,
        ACL: 'public-read',
    }).promise();
    return `https://${BUCKET_NAME}.s3-${process.env.AWS_REGION}.amazonaws.com/${name}`;
}

const main = async () => {
    try {
        const data = await readFile('./image.jpeg');
        const url = await uploadToS3(data);
        console.log(url)
    } catch (err) {
        console.log(err);
    }
};

main();