declare namespace NodeJS {
    interface ProcessEnv {
      PORT : number,
      MONGO_URI : string,
      JWT_SECRET : string,
      SMTP_PASS : string,
      SMTP_USER : string
    }
  }