# Steps to Run Near Streamer

Ensure that you have Docker, Node.js, and Yarn installed on your machine. If not, follow the installation guides below:

[Docker Installation Guide](https://docs.docker.com/get-docker/)

[Node.js Installation Guide](https://nodejs.org/en/download/)

[Yarn Installation Guide](https://classic.yarnpkg.com/en/docs/install)

1. **Git Clone**

`git clone https://github.com/router-protocol/near-streamer.git`

3. **Aws Configuration**
   ```[default]
   aws_access_key_id = AKIAIOSFODNN7EXAMPLE
   aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```
   Save this file as `./.aws/credentials`

4. **Install Dependencies**
   `yarn install`

5. **Modify `docker-compose.yml`**
Update the following environment variables in the `docker-compose.yml` file:
```yaml
- MONGO_DB_URI=mongodb://mongodb:27018/
- NETWORK=testnet
- START_BLOCK=146791266
- PORT=6901
- ALERTER_ACTIVE=true
- SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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

1. **Run Docker Compose**
`docker-compose up -d`