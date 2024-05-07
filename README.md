# Steps to Run Near Streamer

Ensure that you have Docker, Node.js, and Yarn installed on your machine. If not, follow the installation guides below:

[Docker Installation Guide](https://docs.docker.com/get-docker/)

[Node.js Installation Guide](https://nodejs.org/en/download/)

[Yarn Installation Guide](https://classic.yarnpkg.com/en/docs/install)

1. **Git Clone**

`git clone https://github.com/router-protocol/near-streamer.git`

2. **Aws Configuration**
   ### For listening NEAR

   To access the data provided by [NEAR Lake](/tools/realtime#near-lake-indexer) you need to provide valid AWS credentials in order to be charged by the AWS for the S3 usage.

    ### info AWS-cli

   We will require AWS CLI to access to query S3. If you don't have AWS CLI, please follow these steps. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   
   ### AWS S3 Credentials
   To be able to get objects from the AWS S3 bucket you need to provide the AWS credentials.

   ```[default]
   aws_access_key_id = EXAMEXAMPLEEXAMPLE
   aws_secret_access_key = EXAMPLEKEYEXAMPLEKEYEXAMPLEKEY
   ```
   Save this file as `./aws_credentials/credentials`

3. **Create `.env` file**
Update the following environment variables from `.env.example` file:
```yaml
- MONGO_DB_URI=mongodb://mongodb:27018/
- NETWORK=testnet
- START_BLOCK=SOME_BLOCK_NUMBER # omit this if you want to start from the latest block
- PORT=6901
- ALERTER_ACTIVE=true
- PRUNE_AFTER=604800
- SLACK_WEBHOOK_URL=**https**://hooks.slack.com/services/FOR/YOUR/SLACK/WEBHOOK
```
`MONGO_DB_URI` is the URI of the MongoDB instance. We are running MongoDB locally, you have to use port defined in mongodb. `NETWORK` either will be mainnet, testnet or alpha-devnet. `START_BLOCK` is block to be started from during intial start. `PORT` to be exposed. `ALERTER_ACTIVE` and `SLACK_WEBHOOK_URL` is for slack health alerter. `PRUNE_AFTER` is the time in seconds after which the db data will be pruned.

`FORCE_START_BLOCK` is the overide block to be started from. If this is set, all other condition will be ignored.

# Running the Near Streamer

1. **Run Start Db Script**
`bash scripts/start-db.sh`

2. **Run Docker Swarm Script**
`bash scripts/swarm-start.sh`

3. **Health Check for service**
`curl http://localhost:6903/health`