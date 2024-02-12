FROM node
COPY . .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && echo "y" | apt-get install curl
RUN apt-get install ffmpeg -y
RUN curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
