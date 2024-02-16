# Steps to Run Near Streamer

Ensure that you have Docker, Node.js, and Yarn installed on your machine. If not, follow the installation guides below:

[Docker Installation Guide](https://docs.docker.com/get-docker/)

[Node.js Installation Guide](https://nodejs.org/en/download/)

[Yarn Installation Guide](https://classic.yarnpkg.com/en/docs/install)

1. **Git Clone**

`git clone https://github.com/router-protocol/near-streamer.git`

3. **Aws Configuration**
   ```[default]
   aws_access_key_id = EXAMEXAMPLEEXAMPLE
   aws_secret_access_key = EXAMPLEKEYEXAMPLEKEYEXAMPLEKEY
   ```
   Save this file as `./.aws/credentials`

4. **Modify `docker-compose.yml`**
Update the following environment variables in the `docker-compose.yml` file:
```yaml
- MONGO_DB_URI=mongodb://mongodb:27018/
- NETWORK=testnet
- START_BLOCK=146791266
- PORT=6901
- ALERTER_ACTIVE=true
- PRUNE_AFTER=604800
- SLACK_WEBHOOK_URL=https://hooks.slack.com/services/FOR/YOUR/SLACK/WEBHOOK
```
`MONGO_DB_URI` is the URI of the MongoDB instance. We  are running MongoDB locally, you have to use port defined in mongodb. `NETWORK` either will be mainnet, testnet or alpha-devnet. `START_BLOCK` is block to be started from. `PORT` to be exposed. `ALERTER_ACTIVE` and `SLACK_WEBHOOK_URL` is for slack health alerter. `PRUNE_AFTER` is the time in seconds after which the db data will be pruned.

5. **Build Docker Image**
`docker build -t near-streamer .`

6. **Run Docker Compose**
`docker-compose up -d`