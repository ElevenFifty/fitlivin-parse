FROM node:latest

RUN mkdir parse

ADD . /parse
WORKDIR /parse
RUN npm install

ENV APP_ID setYourAppId
ENV APP_NAME setYourAppName
ENV MASTER_KEY setYourMasterKey
ENV DATABASE_URI setMongoDBURI

ENV S3_ACCESS_KEY setYourS3AccessKey
ENV S3_SECRET_KEY setYourS3SecretKey
ENV S3_BUCKET setYourS3Bucket
ENV S3_REGION setYourS3Region

ENV FILE_KEY setYourFileKey

ENV TWITTER_CONSUMER_KEY setYourTwitterConsumerKey
ENV TWITTER_CONSUMER_SECRET setYourConsumerSecret

ENV ANDROID_PUSH_SENDER_ID setYourAndroidSenderId
ENV ANDROID_PUSH_API_KEY setYourAndroidPushAPIKey

ENV MG_FROM_ADDRESS setMailGunFromAddress
ENV MG_DOMAIN setMailGunDomain
ENV MG_API_KEY setMailGunApiKey

# Optional (default : 'parse/cloud/main.js')
# ENV CLOUD_CODE_MAIN cloudCodePath

# Optional (default : '/parse')
# ENV PARSE_MOUNT mountPath

EXPOSE 1337

# Uncomment if you want to access cloud code outside of your container
# A main.js file must be present, if not Parse will not start

# VOLUME /parse/cloud

CMD [ "npm", "start" ]
