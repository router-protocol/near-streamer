# Steps to Run Near Streamer

Ensure that you have Docker, Node.js, and Yarn installed on your machine. If not, follow the installation guides below:

[Docker Installation Guide](https://docs.docker.com/get-docker/)

[Node.js Installation Guide](https://nodejs.org/en/download/)

[Yarn Installation Guide](https://classic.yarnpkg.com/en/docs/install)

1. **Git Clone**

`git clone https://github.com/router-protocol/near-streamer.git`

2. **Install Dependencies**
   `yarn install`

3. **Modify `docker-compose.yml`**
Update the following environment variables in the `docker-compose.yml` file:
```yaml
- MONGO_DB_URI=mongodb://mongodb:27018/
- NETWORK=testnet
- START_BLOCK=146791266
- PORT=6901
- ALERTER_ACTIVE=true
- SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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

5. **Run Docker Compose**
`docker-compose up -d`