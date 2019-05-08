import {S3} from 'aws-sdk';
import {Err, Ok, Result} from "../types/util";


export class S3Client {
    private readonly bucket: string;
    private s3: S3;

    constructor(bucket: string) {
        this.bucket = bucket;
        this.s3 = new S3();
    }

    public async get<T>(key: string): Promise<Result<T>> {
        const params = {
            Bucket: this.bucket,
            Key: key,
        };
        let message = '';
        try {
            const data = await this.s3.getObject(params).promise();
            if (data && data.Body) {
                const result = JSON.parse(data.Body.toString()) as T;
                return new Ok(result)
            }
            message = 'Error getting object';
        } catch (e) {
            console.log(e);
            message = e.toString();
        }

        return new Err(message);
    }

    public async put<T>(key: string, value: T): Promise<Result<T>> {
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: JSON.stringify(value)
        };

        try{
            await this.s3.putObject(params).promise();
            return new Ok(value);
        } catch (e) {
            return new Err(e.toString());
        }
    }


    public async delete(key: string): Promise<Result<string>> {
        const params = {
            Bucket: this.bucket,
            Key: key,
        };

        try{
            await this.s3.deleteObject(params).promise();
            return new Ok(key);
        } catch (e) {
            return new Err(e.toString());
        }
    }
}