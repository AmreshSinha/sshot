# This is a Dockerfile for building a Docker image for aarch64 host

# Base Image: Ubuntu
FROM ubuntu:18.04

# Installing NodeJS v16x and latest npm
RUN apt-get update -y
RUN apt-get install nodejs npm curl wget -y
RUN npm install -g n
RUN n 16
RUN npm install --global npm@latest

# Installing Chromium Browser
RUN apt-get install chromium-browser -y

# Installing Dotnet 5 and adding to PATH
RUN wget https://download.visualstudio.microsoft.com/download/pr/27840e8b-d61c-472d-8e11-c16784d40091/ae9780ccda4499405cf6f0924f6f036a/dotnet-sdk-5.0.100-linux-arm64.tar.gz -O /tmp/dotnet-sdk-5.0.100-linux-arm64.tar.gz
RUN mkdir /lib/dotnet-arm64 && tar zxf /tmp/dotnet-sdk-5.0.100-linux-arm64.tar.gz -C /lib/dotnet-arm64
ENV DOTNET_ROOT=/lib/dotnet-arm64
ENV PATH=/lib/dotnet-arm64:$PATH
ENV PATH=$PATH:/root/.dotnet/tools

# Setting up Workdir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/

# Installing npm packages and installing retype from nuget
RUN npm install && npm cache clean --force
RUN dotnet tool install --global retypeapp
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80

# Exposing app to PORT 80
EXPOSE 80

# Building docs and running app 
RUN retype build
CMD node app.js