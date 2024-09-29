FROM ghcr.io/puppeteer/puppeteer:23.4.1

# Install dependencies
RUN apt-get update && apt-get install -y wget gnupg

# Add Google Chrome's official GPG key
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

# Set up the repository
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

# Install Google Chrome
RUN apt-get update && apt-get install -y google-chrome-stable

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

CMD [ "node", "index.js" ]
