// AWS pre-signed url for directly upload from clients
const AWS = require("aws-sdk");

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
const url = s3.getSignedUrl("putObject", {
  Bucket: "exantra-image-storage",
  Key: "test.png",
  Expires: 60 * 5,
});

console.log(url);
