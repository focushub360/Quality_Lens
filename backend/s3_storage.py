# s3_storage.py
import os
import logging
import boto3
from botocore.exceptions import ClientError
import config

logger = logging.getLogger("citnow_analyzer.s3")

class S3StorageManager:
    def __init__(self):
        self.bucket_name = config.AWS_STORAGE_BUCKET_NAME
        self.region = config.AWS_S3_REGION_NAME
        self.enabled = config.USE_S3_STORAGE
        
        self.s3_client = None
        if self.enabled:
            if not self.bucket_name:
                logger.error("USE_S3_STORAGE is true, but AWS_STORAGE_BUCKET_NAME is not set. S3 storage will be disabled.")
                self.enabled = False
            else:
                try:
                    # Let boto3 automatically pick up IAM Roles, ECS Task Roles, or environmental variables.
                    self.s3_client = boto3.client(
                        's3',
                        region_name=self.region
                    )
                    logger.info(f"S3 storage manager initialized for bucket: {self.bucket_name} in {self.region}")
                except Exception as e:
                    logger.error(f"Failed to initialize boto3 S3 client: {e}. Falling back to local storage.")
                    self.enabled = False

    def upload_file(self, local_path: str, s3_key: str) -> bool:
        """Uploads a local file to S3."""
        if not self.enabled or not self.s3_client:
            logger.debug("S3 storage is disabled, skipping upload.")
            return False
        
        try:
            self.s3_client.upload_file(local_path, self.bucket_name, s3_key)
            logger.info(f"Successfully uploaded {local_path} to S3 bucket {self.bucket_name} as {s3_key}")
            return True
        except ClientError as e:
            logger.error(f"ClientError uploading {local_path} to S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error uploading {local_path} to S3: {e}")
            return False

    def download_file(self, s3_key: str, local_path: str) -> bool:
        """Downloads an S3 object to a local file path."""
        if not self.enabled or not self.s3_client:
            logger.debug("S3 storage is disabled, skipping download.")
            return False
        
        try:
            # Ensure local directory exists
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            self.s3_client.download_file(self.bucket_name, s3_key, local_path)
            logger.info(f"Successfully downloaded {s3_key} from S3 bucket {self.bucket_name} to {local_path}")
            return True
        except ClientError as e:
            logger.error(f"ClientError downloading {s3_key} from S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error downloading {s3_key} from S3: {e}")
            return False

    def delete_file(self, s3_key: str) -> bool:
        """Deletes an S3 object."""
        if not self.enabled or not self.s3_client:
            return False
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=s3_key)
            logger.info(f"Successfully deleted {s3_key} from S3 bucket {self.bucket_name}")
            return True
        except ClientError as e:
            logger.error(f"ClientError deleting {s3_key} from S3: {e}")
            return False

    def object_exists(self, s3_key: str) -> bool:
        """Checks if an S3 object exists in the bucket."""
        if not self.enabled or not self.s3_client:
            return False
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=s3_key)
            return True
        except ClientError as e:
            if e.response.get('Error', {}).get('Code') == '404':
                return False
            logger.error(f"ClientError checking existence of {s3_key} in S3: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error checking existence of {s3_key} in S3: {e}")
            return False

    def generate_presigned_url(self, s3_key: str, expiration_seconds: int = 3600) -> str:
        """Generates a presigned URL to share/download a private S3 object."""
        if not self.enabled or not self.s3_client:
            return ""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': s3_key},
                ExpiresIn=expiration_seconds
            )
            return url
        except Exception as e:
            logger.error(f"Failed to generate presigned URL for {s3_key}: {e}")
            return ""

    def test_connection(self) -> bool:
        """Verifies S3 connection and bucket access."""
        if not self.enabled or not self.s3_client:
            return False
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            return True
        except Exception as e:
            logger.error(f"S3 Connection test failed: {e}")
            return False

s3_storage = S3StorageManager()
